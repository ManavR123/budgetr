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

    CROW_ROUTE(app, "/add_category")
    ([&](const crow::request& req)
     {
        auto x = crow::json::load(req.body);
        if (!x)
            return crow::response(400);
         category cat(x["username"].s(), x["category_name"].s());
         transaction t(db->begin());
         db->persist(cat);
         t.commit();
         return crow::response(200);
     });

    app.port(8080).multithreaded().run();
}
