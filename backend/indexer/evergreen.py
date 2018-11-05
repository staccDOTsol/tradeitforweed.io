import sys

import inspect
import json
import os
from apscheduler.schedulers.background import BackgroundScheduler
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
from pprint import pprint
from pymongo import MongoClient
from smoke import Steem
from smoke.blockchain import Blockchain
from smoke.converter import Converter
from smoke.steemd import Steemd
from smoke.utils import block_num_from_hash

# load config from json file
print('Reading config.json file')
with open('../config.json') as json_config_file:
    config = json.load(json_config_file)
print(config)


#########################################
# Connections
#########################################

nodes = config['steemd_nodes']

s = Steem(nodes)
d = Steemd(nodes)
b = Blockchain(steemd_instance=s, mode='head')
c = Converter(steemd_instance=s)

fn = Steem(nodes)

# MongoDB
ns = os.environ['namespace'] if 'namespace' in os.environ else 'btstalk'
# mongo = MongoClient('mongodb://mongo')
mongo = MongoClient(config['mongo_url'])
db = mongo[ns]

# MongoDB Schema Enforcement
if not 'forum_requests' in db.collection_names():
    db.create_collection('forum_requests')
request_index = 'created'
request_collection = db.forum_requests
if request_index not in request_collection.index_information():
    request_collection.create_index('created', unique=True, name='created', expireAfterSeconds=60*60)

#########################################
# Globals
#########################################

# Which block was last processed
init = db.status.find_one({'_id': 'height_processed'})
if(init):
    last_block_processed = int(init['value'])
else:
    last_block_processed = 1

# Global Properties
props = {}

# Forums Cache
forums_cache = {}

# Vote Queue
vote_queue = []

# Known Bots
bots = set()
start = datetime.now()
past = datetime.now() - timedelta(days=1)

query = {'created':{'$gte':past}}

#posts = db.posts.find(query)
#l(posts)
# ------------
# If the indexer is behind more than the quick_value, it will:
#
#     - stop updating posts based on votes processed
#
# This is useful for when you need the index to catch up to the latest block
# ------------
quick_value = 100

# ------------
# For development:
#
# If you're looking for a faster way to sync the data and get started,
# uncomment this line with a more recent block, and the chain will start
# to sync from that point onwards. Great for a development environment
# where you want some data but don't want to sync the entire blockchain.
# ------------

# last_block_processed = 12880609
# tuanpa added for testing
# last_block_processed = 12880771

#matched_tags = ['bts', 'bitshares', 'bts-project', 'bts-support', 'bts-dev', 'bts-bps', 'bts-meetups', 'bts-price']
matched_tags= ["tfwstrains","tfwwatercooler", "tfwevents", "tfwpolsci", "tfwbazaar","tfwweed","tfwcontests","tfwcanada","tradeitforweed", "tfwannouncements", "tfwgeneral", "tfwprice-of-weed", "tfwservices", "tfwitems", "tfwbarter", "tfwprojects", "tfwevergreen"]
from bson import json_util


def l(msg):
    caller = inspect.stack()[1][3]
    print('[FORUM][INDEXER][{}] {}'.format(str(caller), str(msg)))
    sys.stdout.flush()
count = 0
for document in db.posts.find(query):


    document2 = json.loads(json.dumps(document, default=json_util.default))
  
    if count is 0:
        l(document2)
    count=count+1
def sanitize(string):
    return BeautifulSoup(string, 'html.parser').get_text()


def find_root_comment(comment):
    # check if this is root post
    if comment['parent_author'] == '':
        return comment
    else:
        parent_author = comment['parent_author']
        parent_permlink = comment['parent_permlink']
        parent_id = parent_author + '/' + parent_permlink
        # Grab the parsed data of the post
        # l(parent_id)
        parent_comment = load_post(parent_id, parent_author, parent_permlink)
        return find_root_comment(parent_comment)


def is_filtered(comment):
    # check if comment should be content weather root post contains:
    #   - author: btstalk
    #   - tags: matched_tags

    root_comment = find_root_comment(comment)

    if root_comment['author'] == 'tradeitforweed' or root_comment['author'] == 'tfw.club':
        return True

    json_metadata = root_comment['json_metadata']

    if isinstance(json_metadata, dict) and 'tags' in json_metadata and isinstance(json_metadata['tags'], list):
        if any(tag in matched_tags for tag in json_metadata['tags']):
            return True
    else:
        try:
            if isinstance(json_metadata, str) and len(json_metadata) > 0:
                metadata = json.loads(json_metadata)
                if 'tags' in metadata:
                    if any(tag in matched_tags for tag in metadata['tags']):
                        return True
        except ValueError as e:
            l("ValueError {}".format(str(e)))

    return False


def process_op(op, block, quick=False):
    # Split the array into type and data
    opType = op[0]
    opData = op[1]
    if opType == 'custom_json' and opData['id'] == ns:
        process_custom_op(opData)
    elif opType == 'vote' and not quick:
        queue_parent_update(opData)
    elif opType == 'comment':
        process_post(opData, block, quick=False)
    elif opType == 'delete_comment':
        remove_post(opData)
    # elif opType == 'transfer' and opData['to'] == ns:
    #     # Format the data better
    #     amount, symbol = opData['amount'].split(" ")
    #     opData['amount'] = float(amount)
    #     opData['symbol'] = symbol
    #     # Process incoming transfer
    #     process_incoming_transfer(opData)


# def process_incoming_transfer(opData):
#     # Save record of the op
#     db.transfer.update({
#         '_id': opData['txid']
#     }, {
#         '$set': opData
#     }, upsert=True)
#     # Attempt to process the command within the transfer
#     try:
#         dataType, ns = opData['memo'].split(':')
#         if dataType == 'ns':
#             # Store the namespace for this transfer
#             opData['ns'] = ns
#             opData['timestamp'] = datetime.strptime(opData['timestamp'], '%Y-%m-%dT%H:%M:%S')
#             # Store the value of this transfer, in WLS
#             opData['type'] = 'transfer'
#             opData['steem_value'] = opData['amount']
#             opData['sbd_value'] = opData['amount']
#             if opData['symbol'] == 'WLS':
#                 opData['sbd_value'] = float("%.3f" % (opData['amount']))
#             # Process the funding data
#             process_namespace_funding(opData)
#     except:
#         # Save the transfers that caused errors
#         db.transfer_errors.update({
#             '_id': opData['txid']
#         }, {
#             '$set': opData
#         }, upsert=True)
#         l('Error parsing transfer')
#         # l(opData)
#         # l(block)
#         pass


# def update_funding(opData):
#     db.funding.update({
#         '_id': opData['txid']
#     }, {
#         '$set': opData
#     }, upsert=True)
#     # Determine the total funding for this namespace
#     total = list(db.funding.aggregate([
#         {'$match': {'ns': opData['ns']}},
#         {'$group': {'_id': 'total', 'amount': {'$sum': '$steem_value'}}}
#     ]))[0]['amount']
#     # Return the total
#     return total


# def process_namespace_funding(opData):
#     l('funding for {} - {} {} '.format(opData['ns'], opData['amount'], opData['symbol']))
#     is_request = False
#     sufficient_funds = False
#     # Record the funding event
#     total = update_funding(opData)
#     forum = db.forums.find_one({'_id': opData['ns']})
#     if forum:
#         # Store the funding value on the forum
#         db.forums.update({
#             '_id': opData['ns']
#         }, {
#             '$set': {
#                 'funded': total
#             }
#         })
#     else:
#         request = db.forum_requests.find_one({'_id': opData['ns']})
#         if request:
#             if total >= 10:
#                 sufficient_funds = True
#             # If it has exceeded the minimum
#             if sufficient_funds:
#                 # create the forum
#                 request.pop('expires', None)
#                 request['funded'] = total
#                 db.forums.insert(request)
#             else:
#                 # If it's still under the threshold, update the request
#                 db.forum_requests.update({
#                     '_id': opData['ns']
#                 }, {
#                     '$set': {
#                         'funded': total
#                     }
#                 })
#         else:
#             l('invalid namespace: {}'.format(opData['ns']))
#             l(opData)


def process_custom_op(custom_json):
    # Process the JSON
    op = json.loads(custom_json['json'])
    # Split the array into type and data
    opType = op[0]
    opData = op[1]
    # Save record of the op
    db.custom_op.update({
        '_id': custom_json['txid']
    }, {
        '$set': {
            'height': custom_json['height'],
            'id': custom_json['id'],
            'opType': opType,
            'opData': opData,
            'required_posting_auths': custom_json['required_posting_auths'],
            'timestamp': datetime.strptime(custom_json['timestamp'], '%Y-%m-%dT%H:%M:%S'),
        }
    }, upsert=True)
    # Process the op
    if opType == 'forum_reserve':
        process_forum_reserve(opData, custom_json)
    if opType == 'forum_config':
        process_forum_config(opData, custom_json)
    if opType == 'moderate_post':
        process_moderate_post(opData, custom_json)


def process_forum_config(opData, custom_json):
    operator = custom_json['required_posting_auths'][0]
    try:
        settings = opData['settings']
        namespace = sanitize(opData['namespace']).lower()
        query = {'_id': opData['namespace']}
        forum = db.forums.find_one(query)
        if forum and 'creator' in forum and forum['creator'] == operator:
            # Clean all the data as it's coming in
            name = ''
            description = ''
            tags = []
            if 'name' in settings and settings['name']:
                name = sanitize(settings['name'])[:80]
            if 'description' in settings and settings['description']:
                description = sanitize(settings['description'])[:255]
            if 'tags' in settings and settings['tags']:
                tags = list(map(sanitize, settings['tags']))
            exclusive = bool(settings['exclusive'])
            # Update in the database
            l('{} modifying settings for {} ({})'.format(operator, name, namespace))
            db.forums.update(query, {
                '$set': {
                    '_update': True,
                    'name': name,
                    'description': description,
                    'tags': tags,
                    'exclusive': exclusive,
                }
            })
    except:
        pprint(custom_json)
        l('error processing')
        pass


def process_forum_reserve(opData, custom_json):
    operator = custom_json['required_posting_auths'][0]
    l('{} created reservation for {} ({})'.format(operator, opData['name'], opData['namespace']))
    try:
        name = sanitize(opData['name'])
        namespace = sanitize(opData['namespace']).lower()
        created = datetime.strptime(custom_json['timestamp'], '%Y-%m-%dT%H:%M:%S')
        result = db.forum_requests.insert({
            '_id': namespace,
            'name': name,
            'creator': operator,
            'created': created,
            'created_height': custom_json['height'],
            'created_tx': custom_json['txid'],
            'expires': created + timedelta(hours=1)
        })
    except:
        pass


def process_moderate_post(opData, custom_json):
    moderator = custom_json['required_posting_auths'][0]
    forum = opData['forum']
    topic = opData['topic']
    if isModerator(moderator, forum):
        if 'remove' in opData:
            db.forums.update({'_id': forum}, {'$set': {'_update': True}}) # Queue runnign stats update on the forum
            if opData['remove'] == True:
                l('{} removed {} in {}'.format(moderator, topic, forum))
                db.posts.update({'_id': topic}, {'$addToSet': {
                    '_removedFrom': forum
                }})
                db.replies.update({'root_post': topic}, {'$addToSet': {
                    '_removedFrom': forum
                }})
            if opData['remove'] == False:
                l('{} restored {} in {}'.format(moderator, topic, forum))
                db.posts.update({'_id': topic}, {'$pull': {
                    '_removedFrom': forum
                }})
                db.replies.update({'root_post': topic}, {'$pull': {
                    '_removedFrom': forum
                }})


def isModerator(user, forum):
    forum = db.forums.find_one({'_id': forum})
    if forum and forum['creator'] == user:
        return True
    return False


def remove_post(opData):
    author = opData['author']
    permlink = opData['permlink']

    # Generate ID
    _id = author + '/' + permlink
    l('post self-removed {}'.format(_id))

    # Remove any matches
    db.posts.remove({'_id': _id})
    db.replies.remove({'_id': _id})


def queue_parent_update(opData):
    global vote_queue
    # Determine ID
    _id = opData['author'] + '/' + opData['permlink']
    # Append to Queue
    vote_queue.append(_id)
    # Make the list of queue items unique (to prevent updating the same post more than once per block)
    keys = {}
    for e in vote_queue:
        keys[e] = True
    # Set the list to the unique values
    vote_queue = list(keys.keys())
    # pprint('-----------------------------')
    # pprint('Vote Queue')
    # pprint(opData)
    # pprint(vote_queue)
    # pprint('-----------------------------')


def load_post(_id, author, permlink):
    # Fetch from the rpc
    comment = s.get_content(author, permlink).copy()
    # Add our ID
    comment.update({
        '_id': _id,
    })
    # Remap into our storage format
    for key in ['abs_rshares', 'children_rshares2', 'net_rshares', 'children_abs_rshares', 'vote_rshares', 'total_vote_weight', 'root_comment', 'promoted', 'max_cashout_time', 'body_length', 'reblogged_by', 'replies']:
        comment.pop(key, None)
    for key in ['author_reputation']:
        comment[key] = float(comment[key])
    for key in ['total_pending_payout_value', 'pending_payout_value', 'max_accepted_payout', 'total_payout_value', 'curator_payout_value']:
        comment[key] = float(comment[key].split()[0])
    for key in ['active', 'created', 'cashout_time', 'last_payout', 'last_update']:
        comment[key] = datetime.strptime(comment[key], '%Y-%m-%dT%H:%M:%S')
    for key in ['json_metadata']:
        try:
            comment[key] = json.loads(comment[key])
        except ValueError:
            comment[key] = comment[key]
    return comment


def get_parent_post_id(reply):
    # Determine the original post's ID based on the URL provided
    url = reply['url'].split('#')[0]
    parts = url.split('/')
    parent_id = parts[2].replace('@', '') + '/' + parts[3]
    return parent_id


def update_parent_post(parent_id, reply):
    # Prevent bots from updating the parent post
    if reply['author'] in bots:
        l('skipping bot {} - {}'.format(reply['author'], reply['url']))
        return

    # Split the ID into parameters for loading the post
    author, permlink = parent_id.split('/')
    # Load + Parse the parent post
    # l(parent_id)
    parent_post = load_post(parent_id, author, permlink)
    # Update the parent post (within `posts`) to show last_reply + last_reply_by
    parent_post.update({
        'active_votes': collapse_votes(parent_post['active_votes']),
        'last_reply': reply['created'],
        'last_reply_by': reply['author'],
        'last_reply_url': reply['url']
    })
    # Set the update parameters
    query = { '_id': parent_id }
    update = { '$set': parent_post}
    db.posts.update(query, update)
    return db.posts.find_one({'_id': parent_id})


def update_indexes(comment):
    if comment['author'] not in bots:
        update_topics(comment)
        update_forums(comment)


def update_topics(comment):
    query = { '_id': comment['category']}
    updates = {
        '_id': comment['category'],
        'updated': comment['created']
    }
    if comment['parent_author'] == '':
        updates.update({
            'last_post': {
                'created': comment['created'],
                'author': comment['author'],
                'title': comment['title'],
                'url': comment['url']
            }
        })
    else:
        updates.update({
            'last_reply': {
                'created': comment['created'],
                'author': comment['author'],
                'title': comment['root_title'],
                'url': comment['url']
            }
        })
    db.topics.update(query, {'$set': updates, }, upsert=True)


def update_forums_last_post(index, comment):
    # l('updating /forum/{} with post {}/{})'.format(index, comment['author'], comment['permlink']))
    forum = db.forums.find_one({'_id': index})
    if forum:
        # If we have an exclusive flag
        if 'exclusive' in forum and forum['exclusive'] == True:
            # and the namespace of the post doesn't match the forum itself
            if 'namespace' not in comment or comment['namespace'] != forum['_id']:
                # don't update this forum
                return
        query = { '_id': index }
        updates = {
            '_id': index,
            'updated': comment['created'],
            'last_post': {
                'created': comment['created'],
                'author': comment['author'],
                'title': comment['title'],
                'url': comment['url']
            }
        }
        increments = { 'stats.posts': 1 }
        db.forums.update(query, {'$set': updates, '$inc': increments}, upsert=True)


def update_forums_last_reply(index, comment):
    l('updating /forum/{} with post {}/{})'.format(index, comment['author'], comment['permlink']))
    forum = db.forums.find_one({'_id': index})
    if forum:
        # If we have an exclusive flag
        if 'exclusive' in forum and forum['exclusive'] == True:
            # and the namespace of the post doesn't match the forum itself
            if 'root_namespace' not in comment or comment['root_namespace'] != forum['_id']:
                # don't update this forum
                return

        query = { '_id': index }
        updates = {
            '_id': index,
            'updated': comment['created'],
            'last_reply': {
                'created': comment['created'],
                'author': comment['author'],
                'title': comment['root_title'],
                'url': comment['url']
            }
        }
        increments = { 'stats.replies': 1 }
        db.forums.update(query, {'$set': updates, '$inc': increments}, upsert=True)


def update_forums(comment):
    for index in forums_cache:
        if (('tags' in forums_cache[index]
            and
            comment['category'] in forums_cache[index]['tags']
        ) or ('accounts' in forums_cache[index]
            and
            comment['author'] in forums_cache[index]['accounts']
        )):
            if comment['parent_author'] == '':
                update_forums_last_post(index, comment)
            else:
                update_forums_last_reply(index, comment)


def process_vote(_id, author, permlink):
    # Grab the parsed data of the post
    # l(_id)
    comment = load_post(_id, author, permlink)

    # tuanpa added here
    if not is_filtered(comment):
        return

    l(_id)

    # Ensure we a post was returned
    if comment['author'] != '':
        comment.update({
            'active_votes': collapse_votes(comment['active_votes'])
        })
        # If this is a top level post, update the `posts` collection
        if comment['parent_author'] == '':
            db.posts.update({'_id': _id}, {'$set': comment}, upsert=True)
        # Otherwise save it into the `replies` collection and update the parent
        else:
            # Update this post within the `replies` collection
            db.replies.update({'_id': _id}, {'$set': comment}, upsert=True)


def collapse_votes(votes):
    collapsed = []
    # Convert time to timestamps
    for key, vote in enumerate(votes):
        votes[key]['time'] = int(datetime.strptime(votes[key]['time'], '%Y-%m-%dT%H:%M:%S').strftime('%s'))
    # Sort based on time
    sortedVotes = sorted(votes, key=lambda k: k['time'])
    # Iterate and append to return value
    for vote in votes:
        collapsed.append([
            vote['voter'],
            vote['percent']
        ])
    return collapsed


def process_post(opData, block, quick=False):
    # Derive the timestamp
    ts = float(datetime.strptime(block['timestamp'], '%Y-%m-%dT%H:%M:%S').strftime('%s'))
    # Create the author/permlink identifier
    author = opData['author']
    permlink = opData['permlink']
    _id = author + '/' + permlink
    # Grab the parsed data of the post
    comment = load_post(_id, author, permlink)

    # tuanpa added here
    if not is_filtered(comment):
        return

    l(_id)

    if 'namespace' in opData:
        comment.update({'namespace': opData['namespace']})

    # Determine where it's posted from, and record for active users
    if isinstance(comment['json_metadata'], dict) and 'app' in comment['json_metadata'] and not quick:
        try:
            app = comment['json_metadata']['app'].split('/')[0]
            db.activeusers.update({'_id': comment['author']},
                {
                   '$set': {
                        '_id': comment['author'],
                        'ts': datetime.strptime(block['timestamp'], '%Y-%m-%dT%H:%M:%S')
                    },
                    '$addToSet': {'app': app},
                }, upsert=True)
        except:
            pass
    # Collapse the votes
    comment.update({
        'active_votes': collapse_votes(comment['active_votes'])
    })
    try:
        # Ensure we a post was returned
        if comment['author'] != '':
            commnet['ts'] = datetime.strptime(block['timestamp'], '%Y-%m-%dT%H:%M:%S')
            # If this is a top level post, save into the `posts` collection
            if comment['parent_author'] == '':
                db.posts.update({'_id': _id}, {'$set': comment}, upsert=True)
            # Otherwise save it into the `replies` collection and update the parent
            else:
                # Get the parent_id to update
                parent_id = get_parent_post_id(comment)
                # Update the parent post to indicate a new reply
                parent_post = update_parent_post(parent_id, comment)
                # Add data from the parent to this comment
                comment.update({
                    'root_post': parent_id,
                    'root_namespace': parent_post['namespace'] if parent_post and 'namespace' in parent_post else False,
                })
                # Update this post within the `replies` collection
                db.replies.update({'_id': _id}, {'$set': comment}, upsert=True)
    except:
        l('Error parsing post')
        l(comment)
        pass
    # Update the indexes it's contained within
    update_indexes(comment)


def rebuild_forums_cache():
    l('rebuild_forums_cache')
    # l('rebuilding forums cache ({} forums)'.format(len(list(forums))))
    forums = db.forums.find()
    forums_cache.clear()
    for forum in forums:
        cache = {}
        if 'accounts' in forum and len(forum['accounts']) > 0:
            cache.update({'accounts': forum['accounts']})
        if 'parent' in forum:
            cache.update({'parent': forum['parent']})
        if 'tags' in forum and len(forum['tags']) > 0:
            cache.update({'tags': forum['tags']})
        forums_cache.update({str(forum['_id']): cache})


def process_vote_queue():
    global vote_queue
    l("Updating {} posts that were voted upon.".format(len(vote_queue)))
    # Process all queued votes from block
    for _id in vote_queue:
        # Split the ID into parameters for loading the post
        author, permlink = _id.split('/')
        # Process the votes
        process_vote(_id, author, permlink)
    vote_queue = []


def process_global_props():
    l('process_global_props')
    global props
    props = d.get_dynamic_global_properties()
    # Save height
    db.status.update({'_id': 'height'}, {'$set': {'value': props['last_irreversible_block_num']}}, upsert=True)
    # Save steem_per_mvests
    db.status.update({'_id': 'steem_per_mvests'}, {'$set': {'value': c.steem_per_mvests()}}, upsert=True)
    # l('Props updated to #{}'.format(props['last_irreversible_block_num']))


def process_rewards_pools():
    l('process_rewards_pools')
    # Save reward pool info
    fund = s.get_reward_fund('post')
    reward_balance = float(fund['reward_balance'].split(' ')[0])
    db.status.update({'_id': 'reward_balance'}, {'$set': {'value': reward_balance}}, upsert=True)
    recent_claims = int(fund['recent_claims'].split(' ')[0])
    db.status.update({'_id': 'recent_claims'}, {'$set': {'value': recent_claims}}, upsert=True)


def process_platform_history():
    l('platform account')
    moreops = True
    limit = 100
    # How many history ops have been processed previously?
    init = db.status.find_one({'_id': 'history_processed'})
    if(init):
        last_op_processed = int(init['value'])
    else:
        last_op_processed = limit
    while moreops:
        ops = fn.get_account_history(ns, last_op_processed + 100, limit)
        if ops[-1][0] == last_op_processed:
            moreops = False
        for idx, op in ops:
            if idx > last_op_processed:
                block = {
                    'timestamp': op['timestamp'],
                }
                if op['op'][0] in ['comment_benefactor_reward']:
                    process_op(op['op'], block)
                last_op_processed = idx
                db.status.update({'_id': 'history_processed'}, {'$set': {'value': idx}}, upsert=True)


def rebuild_bots_cache():
    l('rebuild_bots_cache')
    global bots
    docs = db.bots.find()
    for bot in docs:
        bots.add(str(bot['_id']))


if __name__ == '__main__':
    l('Starting services @ block #{}'.format(last_block_processed))

    # while True:
    #     time.sleep(30)

    # process_platform_history()
    process_global_props()
    process_rewards_pools()
    rebuild_forums_cache()
    rebuild_bots_cache()

    scheduler = BackgroundScheduler()
    scheduler.add_job(process_global_props, 'interval', seconds=30, id='process_global_props')
    scheduler.add_job(rebuild_forums_cache, 'interval', minutes=1, id='rebuild_forums_cache')
    scheduler.add_job(rebuild_bots_cache, 'interval', minutes=1, id='rebuild_bots_cache')
    scheduler.add_job(process_vote_queue, 'interval', seconds=15, id='process_vote_queue')
    scheduler.add_job(process_rewards_pools, 'interval', minutes=10, id='process_rewards_pools')
    scheduler.start()

    quick = False
    # last_save_height_time = time.time()
    last_save_block_processed = last_block_processed

    while True :
        for block in b.stream_from(start_block=last_block_processed, batch_operations=False, full_blocks=True):
            if(len(block) > 0):
                block_num = block_num_from_hash(block['block_id'])
                timestamp = block['timestamp']
                # If behind by more than X (for initial indexes), set quick to true to prevent unneeded past operations
                remaining_blocks = props['last_irreversible_block_num'] - block_num
                if remaining_blocks > quick_value:
                    quick = True
                dt = datetime.strptime(timestamp, '%Y-%m-%dT%H:%M:%S')
                l('----------------------------------')
                l('#{} - {} - {} ops ({} remaining|quick:{})'.format(block_num, dt, len(block['transactions']), remaining_blocks, quick))
                for idx, tx in enumerate(block['transactions']):
                    txid = block['transaction_ids'][idx]
                    # Is this a group of ops for the forum?
                    if len(tx['operations']) > 1:
                        is_forum_post = False
                        custom_json = False
                        custom_op = False
                        comment = False
                        for idx, op in enumerate(tx['operations']):
                            if op[0] == 'comment':
                                comment = idx
                            if op[0] == 'custom_json' and op[1]['id'] == ns:
                                custom_op = json.loads(op[1]['json'])
                                if custom_op[0] == 'forum_post':
                                    custom_json = idx
                        # If both ops are found and valid, append the namespace before processing
                        if custom_json is not False and comment is not False:
                            tx['operations'][comment][1]['namespace'] = custom_op[1]['namespace']
                    for op in tx['operations']:
                        op[1]['height'] = block_num
                        op[1]['timestamp'] = timestamp
                        op[1]['txid'] = txid
                        process_op(op, block, quick=quick)

                # Update our saved block height
                # (time.time() - last_save_height_time > 3)
                if (last_block_processed - last_save_block_processed > 10):
                    db.status.update({'_id': 'height_processed'}, {"$set" : {'value': last_block_processed}}, upsert=True)
                    # last_save_height_time = time.time()
                    last_save_block_processed = last_block_processed

                last_block_processed +=1
