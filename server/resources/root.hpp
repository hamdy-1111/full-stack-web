#pragma once

#include <httpserver.hpp>
#include <iostream>
using namespace httpserver;
using std::string;
// is just std::shared_ptr<http_response>
typedef std::shared_ptr<http_response> response_ptr;

class root_resource : public http_resource {
public:
    response_ptr render(const http_request &req) override {
        return response_ptr( get_requested_file(req) );
    }

    file_response *get_requested_file(const http_request &req) {
        string req_path = string(req.get_path());
        string frontend_file = get_frontend_file(req_path);
        return new file_response( frontend_file, http::http_utils::http_ok, get_file_contenttype(frontend_file));
    }

private:
    const string frontend_dir = "frontend";
    const string get_frontend_file(const string &filepath) {
        // if requested path is / return index.html
        return frontend_dir + (filepath == "/" ? "/index.html" : filepath);
    }

    const string get_file_contenttype(const string &filepath) {
        string buffer = "";
        for (int i = filepath.size() - 1; i >= 0; i--) {
            if (filepath[i] == '.') {
                buffer = filepath.substr(i);
            }
        }

        if (buffer == ".html")
            return "text/html";

        if (buffer == ".css")
            return "text/css";

        if (buffer == ".js")
            return "text/javascript";

        // else
        return http::http_utils::application_octet_stream;
    }
};
