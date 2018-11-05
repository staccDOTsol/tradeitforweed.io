#!/bin/bash
	

## example 1: checking if "python3" is running
while :
do
OUTPUT=$(ps -aux | grep -cE statistics.py)

if (( OUTPUT > 0 )); then
    echo "python3 is running"
	sleep 30s
else
    echo "python3 is not running"
	
    sudo nohup python3 statistics.py &
fi


done
