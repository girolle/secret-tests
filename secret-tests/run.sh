#!/bin/bash

function check(){
	if [[ $? != 0 ]]
		then
		print_red "FAILED"
		exit 1
	fi
}

node open-tests/run.js
check

node open-tests/http_get_test.js
check
