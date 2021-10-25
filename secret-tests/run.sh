#!/bin/bash

function print_green(){
	echo -e "\e[32m$@\e[0m"
}
function print_red(){
	echo -e "\e[31m$@\e[0m"
}

function check(){
	if [[ $? != 0 ]]
		then
		print_red "FAILED"
		exit 1
		else
		print_green "PASS"
	fi
}

echo "http get test"
node open-tests/http_get_test.js
check
