#pragma once
#include <httpserver.hpp>
#include <iostream>
#include <SQLiteCpp/SQLiteCpp.h>

using namespace httpserver;
using std::string;
using std::shared_ptr;

class login_resource : public http_resource {
    public:
        shared_ptr<http_response> render_POST(const http_request &req) override;
    private:
        bool username_password_match(const string &username, const string &password);
        void get_uuid_and_key(const string &username, string &uuid, string &key);
};