#!/bin/bash
	

## example 1: checking if "node" is running
while :
do
OUTPUT=$(ps -e  | grep -cE node)

if (( OUTPUT > 1 )); then
    echo "node is running"
	sleep 30s
else
    echo "node is not running"
	sudo nohup npm start &
	sleep 10s
fi


done
