#!/bin/bash

function print_red(){
	echo -e "\e[31m$@\e[0m"
}

function check(){
	if [[ $? != 0 ]]
		then
		print_red "FAILED"
		exit 1
	fi
}

echo run.js
node open-tests/run.js
check

echo http_get_test
node open-tests/http_get_test.js
check

echo http_post_test
node open-tests/http_post_test.js
check
