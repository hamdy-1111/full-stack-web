#!/bin/python3
import sys
import subprocess as sp
OS = ""
MODE = ""

def exitWithMessage():
    print("./build.py <OS_NAME> (windows or linux) <MODE> (release or debug)")
    exit(1)

if len(sys.argv) <= 1 or sys.argv[1] not in ["windows", "linux"]:
    exitWithMessage()
OS = sys.argv[1]
if len(sys.argv) >= 3:
    if sys.argv[2] not in ["release", "debug"] or len(sys.argv) > 3:
        exitWithMessage()
    else:
        MODE = sys.argv[2]

cmake_config_cl = ["cmake" ,"-S", ".", "-B"] # all builds starts with these args 'cmake' is the command
cmake_build_cl = ["cmake" , "--build"]
if OS == "windows":
    cmake_config_cl.append("cmakefiles-mingw/")
    cmake_config_cl.append("-DOS_NAME:String=Windows") # OS_NAME is a variable I use in CMakeLists.txt
    cmake_build_cl.append("cmakefiles-mingw/")
elif OS == "linux":
    cmake_config_cl.append("cmakefiles/")
    cmake_build_cl.append("cmakefiles/")
    # my cmake login will build for linux by default

if MODE == "release":
    cmake_config_cl.append("-DCMAKE_BUILD_TYPE=Release")
elif MODE == "debug":
    cmake_config_cl.append("-DCMAKE_BUILD_TYPE=Debug")

sp.run(cmake_config_cl)
sp.run(cmake_build_cl)
