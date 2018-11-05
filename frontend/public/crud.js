var pty = require('pty.js');

const express = require('express')

const app = express()


var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var sleep = require('system-sleep')
app.get('/', (req, res) => {
var seller_account = req.body.seller_account;
var amount_to_sell = req.body.amount_to_sell;
var symbol_to_sell = req.body.symbol_to_sell;
var min_to_receive = req.body.min_to_receive;
var symbol_to_receive= req.body.symbol_to_receive;


//var port = 3030;
//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
var pexpect = require('nexpect');
var p = pexpect.spawn('/home/tradeitforweed_club/bitshares-core/programs/cli_wallet/cli_wallet' , { stream: 'stderr' })
         .expect("No such file or directory")
         .run(function (err) {
           if (!err) {
             console.log("checked that file doesn't exists");
           }
         });
});

//term.on('data', function(data) {
//  console.log(data);
//});

p.sendline('unlock "Melani3B4b%"');
setTimeout(function(){
//term.write('\n');
},2000);

//sleep(5000);
//console.log(term.process);
setTimeout(function(){
p.sendline("list_account_balances('swapit1')");
}, 4000);
//sleep(5000);

setTimeout(function(){
//term.write('\n');
}, 6000);
//console.log(term.process);

//console.log(term.process);

//console.log(term.process);

});

var port = 3030;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
