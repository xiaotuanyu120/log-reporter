// initial express and create an instance named "app"
var express = require('express')
var app = express();

// initial a http server with "app"
var http = require('http').Server(app);

// initial socket.io and bind socket.io to http server
var io = require('socket.io')(http);

// initial redis and connect to redis server
var redis = require('redis');
var redisclient = redis.createClient("redis://127.0.0.1:6379");

// set website static dir
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

// redis subscribe
var sub = function(c) {
  var c = c || 'logchannel';
  redisclient.subscribe(c, function(e) {
    console.log('subscribe channel : ' + c);
  });
}
sub();

io.on('connection', function(socket){
  redisclient.on('message', function(error, msg) {
    socket.emit('log', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
