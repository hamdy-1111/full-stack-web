#!/bin/python
file = open("frontend/email.html")
lines = file.readlines()

for i in range(len(lines)):
    lines[i] = lines[i].replace("\n", "") # remove new line character because emails doesn't accept it
    lines[i] = lines[i].replace("\"", '\\"')
    lines[i] = "\"" + lines[i] + "\""
    if "123456" in lines[i]:
        lines[i] = lines[i].replace("123456", "\"+otp+\"")

    print(lines[i])
