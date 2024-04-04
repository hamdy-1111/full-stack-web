cmake_minimum_required(VERSION 3.5)
project(Backend VERSION 1.0)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR})

if(OS_NAME STREQUAL "Windows")
    set(EXE_NAME server-windows.exe)
else()
    set(EXE_NAME server-linux)
endif()

add_executable(${EXE_NAME})
if(OS_NAME STREQUAL "Windows")
    # WINDOWS
    set(CMAKE_C_COMPILER x86_64-w64-mingw32-gcc)
    set(CMAKE_CXX_COMPILER x86_64-w64-mingw32-g++)
    set(CMAKE_FIND_ROOT_PATH /usr/x86_64-w64-mingw32/)
endif()

if( NOT OS_NAME STREQUAL "Windows")
    target_link_libraries(${EXE_NAME} httpserver microhttpd)
else()
    message("STATIC BUILD FOR WINDOWS")
    target_link_libraries(${EXE_NAME} PUBLIC -static)
    target_link_libraries(${EXE_NAME} PRIVATE ${CMAKE_CURRENT_SOURCE_DIR}/server/external/libhttpserver/windows/libhttpserver.a 
                                                ${CMAKE_CURRENT_SOURCE_DIR}/server/external/libhttpserver/windows/libmicrohttpd.a 
                                                ${CMAKE_CURRENT_SOURCE_DIR}/server/external/libhttpserver/windows/libws2_32.a)
endif()


include_directories(server/external/httpserver/include)

target_sources(${EXE_NAME} PRIVATE server/main.cpp
    server/resources/root/root.cpp)
target_include_directories(${EXE_NAME} PRIVATE server/resources)
