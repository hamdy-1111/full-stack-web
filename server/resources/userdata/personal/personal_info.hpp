#pragma once
#include <httpserver.hpp>
#include <iostream>

using namespace httpserver;
using std::shared_ptr;
using std::string;

#include <nlohmann/json.hpp>
using namespace nlohmann;

class personal_info_resource : public http_resource {
public:
    shared_ptr<http_response> render_POST(const http_request &req) override;
private:
    shared_ptr<http_response> return_error(const string &error);
    json get_user_info_params(const string &uuid, const string &key);
    bool uuid_and_key_match(const string &uuid, const string &key);
};