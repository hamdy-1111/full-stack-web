cmake_minimum_required(VERSION 3.5)
project(Backend VERSION 1.0)

set(CMAKE_CXX_STANDARD  20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})

find_package(OpenSSL REQUIRED)
find_package(SQLiteCpp REQUIRED)
find_library(libhttpserver libhttpserver)
find_package(Boost COMPONENTS system filesystem date_time regex unit_test_framework REQUIRED)
find_package(mailio REQUIRED)

add_subdirectory(server/external/json)


if(CMAKE_SYSTEM_NAME STREQUAL "Windows")
    set(EXE_NAME server-windows)
elseif(CMAKE_SYSTEM_NAME STREQUAL "Linux")
    set(EXE_NAME server-linux)
endif()
    
    add_executable(${EXE_NAME})
target_sources(${EXE_NAME} PRIVATE
server/resources/root/root.cpp
server/util/security.cpp
server/resources/database.cpp
server/resources/creditials/login/login.cpp
server/resources/creditials/signup/signup.cpp
server/resources/creditials/verify/verify.cpp
server/util/email.cpp
server/main.cpp)

target_include_directories(${EXE_NAME} PRIVATE server/ server/resources)

target_link_libraries(${EXE_NAME} PRIVATE nlohmann_json)

if(CMAKE_SYSTEM_NAME STREQUAL "Windows")
    target_link_libraries(${EXE_NAME} PRIVATE httpserver microhttpd mailio SQLiteCpp sqlite3 OpenSSL::Crypto)
elseif(CMAKE_SYSTEM_NAME STREQUAL "Linux")
    target_link_libraries(${EXE_NAME} PRIVATE httpserver SQLiteCpp OpenSSL::Crypto mailio)
endif() 
# Instaling cmake from msys2 is better because you can just use libraries from msys2
