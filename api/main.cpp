#include <iostream>
#include <string>

#include <odb/database.hxx>
#include <odb/transaction.hxx>

#include "crow_all.h"
#include "database.h" // create_database

#include "category/category-odb.hxx"
#include "category/category.h"
#include "purchase/purchase-odb.hxx"
#include "purchase/purchase.h"

using namespace std;
using namespace odb::core;
using boost::gregorian::date;

std::vector<string> get_all_categories(unique_ptr<database> &db,
                                       const std::string &username) {
  typedef odb::query<category> query;
  typedef odb::result<category> result;
  transaction t(db->begin());
  result r(db->query<category>(query::username == username));

  std::vector<string> categories;
  for (result::iterator i(r.begin()); i != r.end(); ++i) {
    categories.push_back(i->get_category_name());
  }
  return categories;
}

date string_to_date(const std::string &str) {
  const std::locale fmt2(std::locale::classic(),
                         new boost::gregorian::date_input_facet("%m/%d/%Y"));
  std::istringstream is(str);
  is.imbue(fmt2);
  date date;
  is >> date;
  return date;
}

const std::string formatDate(date date) {
  const std::locale fmt(std::locale::classic(),
                        new boost::gregorian::date_facet("%m/%d/%Y"));
  std::ostringstream os;
  os.imbue(fmt);
  os << date;
  return os.str();
}

int main(int argc, char *argv[]) {
  unique_ptr<database> db(create_database(argc, argv));
  crow::SimpleApp app;

  CROW_ROUTE(app, "/")
  ([]() { return "Hello world"; });

  CROW_ROUTE(app, "/add_category")
      .methods("POST"_method)([&](const crow::request &req) {
        auto body = crow::json::load(req.body);
        if (!body)
          return crow::response(400, "Body-Is-Empty");

        auto categories = get_all_categories(db, body["username"].s());
        for (std::vector<string>::iterator cat(categories.begin());
             cat != categories.end(); ++cat) {
          if (cat->compare(body["category_name"].s()) == 0) {
            return crow::response(400, "Category-Already-Exists");
          }
        }

        category cat(body["username"].s(), body["category_name"].s());
        transaction t(db->begin());
        db->persist(cat);
        t.commit();
        return crow::response(200);
      });

  CROW_ROUTE(app, "/get_categories")
      .methods("POST"_method)([&](const crow::request &req) {
        auto body = crow::json::load(req.body);
        crow::json::wvalue ret;
        ret["categories"] = get_all_categories(db, body["username"].s());
        return ret;
      });

  CROW_ROUTE(app, "/add_purchase")
      .methods("POST"_method)([&](const crow::request &req) {
        auto body = crow::json::load(req.body);
        if (!body)
          return crow::response(400, "Body-Is-Empty");

        bool found = false;
        auto categories = get_all_categories(db, body["username"].s());
        for (std::vector<string>::iterator cat(categories.begin());
             cat != categories.end(); ++cat) {
          if (cat->compare(body["category"].s()) == 0) {
            found = true;
          }
        }

        if (!found)
          return crow::response(400, "Category-Does-Not-Exist");

        purchase p(body["username"].s(), body["location"].s(),
                   body["category"].s(), body["amount"].d(), body["notes"].s(),
                   string_to_date(body["date"].s()));
        transaction t(db->begin());
        db->persist(p);
        t.commit();
        return crow::response(200);
      });

  CROW_ROUTE(app, "/get_purchases")
      .methods("POST"_method)([&](const crow::request &req) {
        auto body = crow::json::load(req.body);

        typedef odb::query<purchase> query;
        typedef odb::result<purchase> result;
        transaction t(db->begin());
        result r(db->query<purchase>(query::username == body["username"].s()));

        std::vector<string> locations, categories, notes, dates;
        std::vector<float> amounts;
        for (result::iterator p(r.begin()); p != r.end(); ++p) {
          dates.push_back(formatDate(p->get_date()));
          locations.push_back(p->get_location());
          categories.push_back(p->get_category());
          notes.push_back(p->get_notes());
          amounts.push_back(p->get_amount());
        }

        crow::json::wvalue ret;
        ret["dates"] = dates;
        ret["locations"] = locations;
        ret["categories"] = categories;
        ret["amounts"] = amounts;
        ret["notes"] = notes;
        return ret;
      });

  CROW_ROUTE(app, "/get_total_purchases")
      .methods("POST"_method)([&](const crow::request &req) {
        auto body = crow::json::load(req.body);

        typedef odb::query<purchase_stat> query;
        typedef odb::result<purchase_stat> result;
        transaction t(db->begin());
        result r(
            db->query<purchase_stat>(query::username == body["username"].s()));

        std::vector<string> categories;
        std::vector<float> amounts;
        for (result::iterator p(r.begin()); p != r.end(); ++p) {
          categories.push_back(p->category);
          amounts.push_back(p->total_amount);
        }

        crow::json::wvalue ret;
        ret["categories"] = categories;
        ret["amounts"] = amounts;
        return ret;
      });

  app.port(8080).multithreaded().run();
}
