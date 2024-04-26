#pragma once

#include <httpserver.hpp>
using namespace httpserver;
using std::shared_ptr;
using std::string;

class verify_resource : public http_resource {
    public:
        shared_ptr<http_response> render_POST(const http_request &req) override;
    private:
        string add_new_user(string uuid, string key);
        void delete_user(const string &uuid, const string &key);
};

