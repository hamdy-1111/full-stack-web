#!/bin/python3
import sys
import subprocess as sp
import platform as pl
THIS_OS = pl.system()

# Check if build is for frontend
if len(sys.argv) == 2 and sys.argv[1] == "frontend":
    print("BUIDLING FRONTEND API")
    sp.run(["tsc"]) # Command for building
    print("BUILDING FRONTEND DONE")
    exit(0)

TARGET_OS = ""
MODE = ""

def exitWithMessage():
    print("./build.py <OS_NAME> (windows or linux) <MODE> (release or debug)")
    print("or\n./build.py frontend (for compiling ts files to js file)")
    exit(1)

if len(sys.argv) <= 1 or sys.argv[1] not in ["windows", "linux"]:
    exitWithMessage()
TARGET_OS = sys.argv[1]
if len(sys.argv) >= 3:
    if sys.argv[2] not in ["release", "debug"] or len(sys.argv) > 3:
        exitWithMessage()
    else:
        MODE = sys.argv[2]

cmake_config_cl = ["cmake" ,"-G", "Ninja","-S", ".", "-B"] # all builds starts with these args 'cmake' is the command
cmake_build_cl = ["cmake" , "--build"]
if TARGET_OS == "windows":
    if THIS_OS == "Linux":
        cmake_config_cl[0] = "x86_64-w64-mingw32-cmake"
        cmake_config_cl.append("cmakefiles-mingw/")
        cmake_build_cl.append("cmakefiles-mingw/")
    elif THIS_OS == "Windows":
        cmake_config_cl[0] = 'cmake'
        cmake_config_cl.append('build/')
        cmake_build_cl.append('build/')
elif TARGET_OS == "linux":
    if THIS_OS == "Windows":
        print("Cannot build for linux on windows exiting.")
        exit(1)
    cmake_config_cl.append("cmakefiles/")
    cmake_build_cl.append("cmakefiles/")
    # my cmake login will build for linux by default

if MODE == "release":
    cmake_config_cl.append("-DCMAKE_BUILD_TYPE=Release")
elif MODE == "debug":
    cmake_config_cl.append("-DCMAKE_BUILD_TYPE=Debug")

sp.run(cmake_config_cl, stdout=sp.DEVNULL)
sp.run(cmake_build_cl)
