#include <iostream>
#include <string>

#include <odb/database.hxx>
#include <odb/transaction.hxx>

#include "crow_all.h"
#include "database.h" // create_database

#include "category/category.h"
#include "category/category-odb.hxx"
#include "purchase/purchase.h"
#include "purchase/purchase-odb.hxx"

using namespace std;
using namespace odb::core;

int main(int argc, char *argv[])
{
    unique_ptr<database> db(create_database(argc, argv));
    crow::SimpleApp app;

    CROW_ROUTE(app, "/")
    ([]()
     { return "Hello world"; });

    CROW_ROUTE(app, "/add_category").methods("POST"_method)([&](const crow::request &req) {
        auto x = crow::json::load(req.body);
        if (!x)
            return crow::response(400);
        category cat(x["username"].s(), x["category_name"].s());
        transaction t(db->begin());
        db->persist(cat);
        t.commit();
        return crow::response(200);
    });

    CROW_ROUTE(app, "/get_categories").methods("POST"_method)([&](const crow::request &req) {
        auto body = crow::json::load(req.body);
        typedef odb::query<category> query;
        typedef odb::result<category> result;
        transaction t(db->begin());
        result r(db->query<category>(query::username == body["username"].s()));

        std::vector<string> categories;
        for (result::iterator i (r.begin ()); i != r.end (); ++i) {
            categories.push_back(i->get_category_name());
        }
        crow::json::wvalue ret;
        ret["categories"] = categories;
        return ret;
    });

    app.port(8080).multithreaded().run();
}
