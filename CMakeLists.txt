cmake_minimum_required(VERSION 3.5)
project(Backend VERSION 1.0)

find_package(OpenSSL REQUIRED)
find_package(SQLiteCpp REQUIRED)
find_library(libhttpserver libhttpserver)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})

if(CMAKE_SYSTEM_NAME STREQUAL "Windows")
    set(EXE_NAME server-windows)
    add_executable(${EXE_NAME})
    target_link_libraries( ${EXE_NAME} PRIVATE )
elseif(CMAKE_SYSTEM_NAME STREQUAL "Linux")
    set(EXE_NAME server-linux)
    add_executable(${EXE_NAME})
endif()

target_sources(${EXE_NAME} PRIVATE
server/resources/root/root.cpp
server/util/security.cpp
server/resources/database.cpp
server/resources/creditials/login/login.cpp
server/resources/creditials/signup/signup.cpp
server/main.cpp)

target_include_directories(${EXE_NAME} PRIVATE server/ server/resources)
target_link_libraries(${EXE_NAME} PRIVATE OpenSSL::Crypto SQLiteCpp httpserver)
