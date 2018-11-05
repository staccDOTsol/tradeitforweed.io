	

## example 1: checking if "python3" is running
while :
do
    OUTPUT="$(ps -e | grep -cE python3)"

if (( OUTPUT > 1 )); then
    echo "python3 is running"
	sleep 30s
else
    echo "python3 is not running"
	cd indexer
    sudo nohup python3 main.py
	cd ../rest
    sudo nohup python3 main.py
	cd ../statistics
    sudo nohup python3 main.py
	cd ..
fi


done
