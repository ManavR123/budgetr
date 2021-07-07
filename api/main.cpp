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

date string_to_dat(const std::string &str) {
  const std::locale fmt2(std::locale::classic(),
                         new boost::gregorian::date_input_facet("%m/%d/%Y"));
  std::istringstream is(str);
  is.imbue(fmt2);
  boost::gregorian::date date;
  is >> date;
  return date;
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
                   string_to_dat(body["date"].s()));
        transaction t(db->begin());
        db->persist(p);
        t.commit();
        return crow::response(200);
      });

  app.port(8080).multithreaded().run();
}
