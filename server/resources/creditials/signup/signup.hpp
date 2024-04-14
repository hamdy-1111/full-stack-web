#pragma once
#include <httpserver.hpp>
#include <iostream>
#include <SQLiteCpp/SQLiteCpp.h>

using namespace httpserver;
using std::string;
using std::shared_ptr;


class signup_resource : public http_resource {
    public:
        shared_ptr<http_response> render_POST(const http_request &req) override;
        bool username_exists(string username, bool temp_db = false);
        bool email_exists(string email, bool temp_db = false);
    private:
};