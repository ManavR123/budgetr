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

  app.port(8080).multithreaded().run();
}
