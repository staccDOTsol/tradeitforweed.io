# tradeitforweed.io

## Requirements

python3, python3-pip, npm, node, ubuntu, docker, docker-compose, smoked on 8090

## Installation

run smoked on 8090

git clone repo

cd into repo

sudo nohup docker-compose up &

cd backend

sudo find ./ -type f -exec sed -i -e "s/btstalk/(name of your db on mongo)/g" {} \;

cd rest

sudo nohup python3 main.py &

cd ../indexer

sudo nano main.py

change matched_tags to the tags of your forum

sudo nohup python3 main.py &

cd ../statistics

sudo nohup python3 main.py &

cd ../../frontend

npm i -f

git clone https://github.com/smokenetwork/smoke-js/

cd smoke-js

npm i -f

cd ..

sudo mv smoke-js node_modules/steem

(you'll want to recursively change mentions of tradeitforweed.io and etc)

(you'll want to edit urls in src/global.js and a few other places, look for instances of tradeitforweed.io)

nohup npm start &

sudo nano test.sh

paste:



  python3 reindex.py '{
    "_id": "tradeitforweed-canada",
    "name": "Canada Talk, Trade, Barter, Grow!",
    "group": "tradeitforweed",
    "group_order": 2,
    "forum_order": 1,
    "description": "Canadian Talk",
    "tags": ["tfwcanada"],
    "accounts": ["tradeitforweed"]
  }'



  python3 reindex.py '{
    "_id": "tradeitforweed-contests",
    "name": "Contests! Start your contest, promote one here!",
    "group": "tradeitforweed",
    "group_order": 2,
    "forum_order": 1,
    "description": "For all your Smoke contest needs! You are welcome to share or promote a contest here!",
    "tags": ["tfwcontests"],
    "accounts": ["tradeitforweed"]
  }'


change it to what you want

sudo nano config.json

{
  "mongo_url":"mongodb://localhost:27017",
 "steemd_nodes": [        "https://api.steemit.com",
        "https://steem.chainbb.com"
  ]
}
        
        
replace mongourl

you need reindex.py in that dir:

(it's uploaded to the root of this project)

sudo chmod +x test.sh

sudo ./test.sh
