#!/bin/bash

sudo npm install -g node-minify
sudo apt install --assume-yes gcc shc   

rm -Rf open-tests/*
cp -r secret-tests/* open-tests/
minify(){
	if [ -n "$1" ] ; then
		FILE=$1
		if [ -d "${FILE}" ] ; then
			for filename in $FILE/*; do
				minify "${filename}"
			done
		elif [ -f "${FILE}" ]; then
			if [[ "$FILE" =~ ".js" ]] ; then
  				node-minify -i "$FILE" -o "$FILE" -c gcc
				if [[ $? != 0 ]] ; then
					echo "MINIFICATION FAILED"
					exit 1
				fi
			elif [[ "$FILE" =~ ".sh" ]] ; then
                shc -f "${FILE}"
				if [[ $? != 0 ]] ; then
					echo "MINIFICATION FAILED"
					exit 1
				fi
				rm "${FILE}" "${FILE}.x.c"
			fi
		fi
	fi
}

minify open-tests
exit 0
