#pragma once

#include <httpserver.hpp>
#include <iostream>
using namespace httpserver;
using std::string;
// is just std::shared_ptr<http_response>
using std::shared_ptr;

class root_resource : public http_resource {
public:
    shared_ptr<http_response> render(const http_request &req) override;

    http_response *get_requested_content(const http_request &req);

private:
    const string frontend_dir = "frontend";
    const string get_frontend_file(const string &filepath);
    const string get_file_contenttype(const string &filepath);
};
