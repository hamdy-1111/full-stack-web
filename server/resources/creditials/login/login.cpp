#include "login.hpp"
#include "database.hpp"
#include "util/security.hpp"
#include <nlohmann/json.hpp>
#include <stdio.h>

using namespace nlohmann;
shared_ptr<http_response> login_resource::render_POST(const http_request &req) {
    json req_json = json::parse(string(req.get_content()));
    string action   = req_json["action"];
    string username = req_json["username"];
    string password = req_json["password"];
    
    if( action != "login" ) {
        shared_ptr<http_response>(new string_response(to_string(json({{"error", "unknown-action"}})), 200, "application/json"));
    }

    json res;
    if (username_password_match(username, password)) {
        string uuid, key;
        get_uuid_and_key(username, uuid, key);
        res["error"] = "no-error";
        res["logged_in"] = true;
        res["uuid"] = uuid;
        res["key"] = key;
    } else {
        res["error"] = "password-user-no-match";
        res["logged_in"] = false;
    }
    return shared_ptr<http_response>(new string_response(to_string(res), 200, "application/json"));
}

bool login_resource::username_password_match(const string &username, const string &password) {
    try {
        SQLite::Statement query(*DataBaseManager::users, "SELECT username, salt, password FROM users WHERE username = ?");

        query.bind(1, username);
        while (query.executeStep()) {
            string stored_username = query.getColumn(0);
            string stored_salt = query.getColumn(1);
            string stored_password_hash = query.getColumn(2);
            string password_hash = sha256_string(stored_salt.append(password));

            if (password_hash == stored_password_hash) {
                return true;
            } else {
                return false;
            }
        }
    } catch (SQLite::Exception &e) {
        std::cout << e.what() << std::endl;
    }
    return false;
}

void login_resource::get_uuid_and_key(const string &username, string &uuid, string &key) {
    try {
        SQLite::Statement query_get(*DataBaseManager::users, "SELECT uuid , key FROM users WHERE username = ?");
        query_get.bind(1, username);
        while( query_get.executeStep() ) {
            uuid = string(query_get.getColumn(0));
            key  = string(query_get.getColumn(1));
            return;
        }
    } catch (const std::exception &e) {
        std::cerr << e.what() << '\n';
    }
}