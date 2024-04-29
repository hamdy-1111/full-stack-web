#include "personal_info.hpp"
#include "resources/database.hpp"
#include <fstream>

shared_ptr<http_response> personal_info_resource::render_POST(const http_request &req) {
    std::cout << req.get_content() << std::endl;
    json req_json = json::parse(string(req.get_content()));
    // return error if action not passed
    if (!req_json.contains("action")) {
        return return_error("no-action");
    }

    // return error if uuid and key not passed
    if (!req_json.contains("uuid") || !req_json.contains("key")) {
        return return_error("no-uuid-and/or-key");
    }
    string uuid = req_json["uuid"];
    string key = req_json["key"];
    string action = req_json["action"];
    if (action == "get-info") {
        if (!req_json.contains("info-param-list")) {
            return return_error("action-set-but-not-info-param-list");
        }
        std::vector<string> info_params = req_json["info-param-list"];

        json info = get_user_info_params(uuid, key);
        json response;
        response["error"] = info["error"];
        if (response["error"] == "no-error")
            for (string &i : info_params) {
                if (info.contains(i)) {
                    response[i] = info[i];
                }
            }
        return shared_ptr<http_response>(new string_response(to_string(response), 200, "application/json"));
    } else if (action == "get-photo") {
        json photo_content;
        if (uuid_and_key_match(uuid, key)) {
            if (std::filesystem::exists(PHOTO_PREFIX + uuid)) {
                std::ifstream in = std::ifstream(PHOTO_PREFIX + uuid);
                std::stringstream ss;
                ss << in.rdbuf();
                photo_content["error"] = "no-error";
                photo_content["photo_content"] = ss.str();
            } else {
                photo_content["error"] = "photo-not-on-server-file-system";
            }
        } else {
            photo_content["error"] = "something-wrong-with-uuid-key";
        }
        return shared_ptr<http_response>(new string_response(to_string(photo_content), 200, "application/json"));
    } else {
        return shared_ptr<http_response>(new string_response(to_string(json({{"error", "unknown-action"}})), 200, "application/json"));
    }
}

shared_ptr<http_response> personal_info_resource::return_error(const string &error) {
    json res = {
        {"error", error}};
    return shared_ptr<http_response>(new string_response(to_string(json(res)), 200, "application/json"));
}

json personal_info_resource::get_user_info_params(const string &uuid, const string &key) {
    try {
        json info;
        SQLite::Statement query_get(*DataBaseManager::users, "SELECT username , email , photo_state FROM users WHERE uuid = ? AND key = ?");
        query_get.bind(1, uuid);
        query_get.bind(2, key);

        while (query_get.executeStep()) {
            info["username"] = string(query_get.getColumn(0));
            info["email"] = string(query_get.getColumn(1));
            info["photo_state"] = (int)query_get.getColumn(2);
            info["error"] = "no-error";
            return info;
        }
    } catch (const std::exception &e) {
        std::cerr << "SQLite: " << e.what() << '\n';
    }
    return json({{"error", "something-wrong"}});
}

bool personal_info_resource::uuid_and_key_match(const string &uuid, const string &key) {
    SQLite::Statement query_check(*DataBaseManager::users, "SELECT COUNT(1) FROM users WHERE uuid = ? AND key = ?");
    query_check.bind(1, uuid);
    query_check.bind(2, key);

    while (query_check.executeStep()) {
        int records_num = query_check.getColumn(0);
        return bool(records_num);
    }
    return false;
}