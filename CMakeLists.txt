cmake_minimum_required(VERSION 3.5)
project(Backend VERSION 1.0)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})

find_package(OpenSSL REQUIRED)
find_package(SQLiteCpp REQUIRED)
find_library(libhttpserver libhttpserver)

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
server/main.cpp)

target_include_directories(${EXE_NAME} PRIVATE server/ server/resources)

if(CMAKE_SYSTEM_NAME STREQUAL "Windows")
    target_link_libraries(${EXE_NAME} PRIVATE -static )
    target_link_libraries(${EXE_NAME} PRIVATE libhttpserver.a libmicrohttpd.a libcrypto.a libws2_32.a libcrypt32.a libSQLiteCpp.a libsqlite3.a)
elseif(CMAKE_SYSTEM_NAME STREQUAL "Linux")
    target_link_libraries(${EXE_NAME} PRIVATE httpserver SQLiteCpp OpenSSL::Crypto)
endif() 