#include "verify.hpp"
#include "database.hpp"
#include "util/security.hpp"
#include <SQLiteCpp/SQLiteCpp.h>
#include <SQLiteCpp/VariadicBind.h>
#include <iostream>
#include <nlohmann/json.hpp>
using namespace nlohmann;

shared_ptr<http_response> verify_resource::serve_POST(const http_request &req) {
    string uuid = req.get_arg("uuid");
    string key = req.get_arg("key");
    string otp = req.get_arg("otp-code");

    try {
        SQLite::Statement query(*DataBaseManager::users, "SELECT otp_code, time_unix FROM users_verify_temp WHERE uuid = ? AND key = ?");
        SQLite::bind(query, uuid, key);
        if (query.executeStep()) {
            string real_otp = query.getColumn(0);
            int time_unix = query.getColumn(1);

            // if user is late delete
            if( time(nullptr) - time_unix > 180 ) {
                SQLite::Statement query_delete(*DataBaseManager::users ,"DELETE FROM users_verify_temp WHERE uuid = ?");
                query_delete.bind(1, uuid);
                query_delete.exec();
                return shared_ptr<http_response>(new string_response(to_string(json({{"error", "time-out"}}))));
            }

            if (real_otp == otp) {
                string new_key = add_new_user(uuid, key);
                if( new_key.empty() ) {
                    string_response *res = new string_response(to_string(json({{"error", "something-wrong"}})));
                    res->with_header("Content-Type", "application/json");
                    return shared_ptr<http_response>(res);
                }
                json data = {
                    {"error", "no-error"},
                    {"uuid", uuid},
                    {"key", new_key},
                    {"status", "user-verified"}
                };
                string_response *res = new string_response(to_string(data));
                res->with_header("Content-Type", "application/json");
                return shared_ptr<http_response>(res);
            } else {
                string_response *res = new string_response(json({{"error", "otp-code-wrong"}}));
                res->with_header("Content-Type", "application/json");
                return shared_ptr<http_response>(res);
            }
        }
    } catch (std::exception &e) {
        std::cout << e.what() << std::endl;
    }
}

string verify_resource::add_new_user(string uuid, string key) {
    string new_key = random_string(64);
    try {
        SQLite::Statement query(*DataBaseManager::users, "SELECT username, email, salt, password, photo_state FROM users_verify_temp WHERE uuid = ? AND key = ?");
        SQLite::bind(query, uuid, key);
        
        while(query.executeStep()) {
            string username = query.getColumn(0);
            string email    = query.getColumn(1);
            string salt     = query.getColumn(2);
            string password = query.getColumn(3);
            int photo_state = query.getColumn(4);

            SQLite::Statement query_add(*DataBaseManager::users, "INSERT INTO users ([uuid], [username], [email], [salt], [password], [key], [photo_state]) VALUES ( ? , ? , ? , ? , ? , ? , ? )");
            SQLite::bind(query_add, uuid, username, email, salt, password, new_key, photo_state);
            query_add.exec();
            return new_key;
        }
    } catch (const std::exception &e) {
        std::cerr << e.what() << '\n';
    }
    return "";
}