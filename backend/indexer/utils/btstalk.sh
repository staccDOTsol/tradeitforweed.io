
# ---------------------------------------------------------------------------
# btstalk + children
# ---------------------------------------------------------------------------

python3 reindex.py '{
  "_id": "btstalk-announcements",
  "name": "Official Announcements",
  "group": "btstalk",
  "group_order": 1,
  "forum_order": 1,
  "description": "Announcements from the official btstalk team",
  "tags": [],
  "accounts": ["btstalk"]
}'

python3 reindex.py '{
  "_id": "btstalk-general",
  "name": "General Discussion",
  "group": "btstalk",
  "group_order": 1,
  "forum_order": 2,
  "description": "General discussions about Bitshares",
  "tags": ["bts", "bitshares"]
}'

python3 reindex.py '{
  "_id": "btstalk-projects",
  "name": "Specific Projects",
  "group": "btstalk",
  "group_order": 1,
  "forum_order": 3,
  "description": "Updates for projects and efforts",
  "tags": ["bts-project"]
}'

python3 reindex.py '{
  "_id": "btstalk-dev",
  "name": "Developers",
  "group": "btstalk",
  "group_order": 1,
  "forum_order": 4,
  "description": "Developer chat, guides and project chatter.",
  "tags": ["bts-dev"]
}'

python3 reindex.py '{
  "_id": "btstalk-bps",
  "name": "Block Producers",
  "group": "btstalk",
  "group_order": 1,
  "forum_order": 5,
  "description": "Bitshares Block Producers",
  "tags": ["bts-bps"]
}'

python3 reindex.py '{
  "_id": "btstalk-meetups",
  "name": "Bitshares Meetups",
  "group": "btstalk",
  "group_order": 1,
  "forum_order": 6,
  "description": "Bitshares Meetups",
  "tags": ["bts-meetups"]
}'

python3 reindex.py '{
  "_id": "btstalk-price",
  "name": "Bitshares price",
  "group": "btstalk",
  "group_order": 1,
  "forum_order": 7,
  "description": "Bitshares price",
  "tags": ["bts-price"]
}'
