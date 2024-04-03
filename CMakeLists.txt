cmake_minimum_required(VERSION 3.5)
project(Backend VERSION 1.0)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})
add_executable(server.exe)

include(/usr/share/cmake/Modules/FindLibHttpServer.cmake)
if(LIBHTTPSERVER_FOUND)
    include_directories(${LIBHTTPSERVER_INCLUDE_DIRS})
    target_link_libraries(server.exe ${LIBHTTPSERVER_LIBRARIES})
else()
    message(FATAL_ERROR "LibHttpServer not found.")
endif()


target_sources(server.exe PRIVATE server/main.cpp)
target_include_directories(server.exe PRIVATE server/resources)
