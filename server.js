var server = require('http').createServer();
var io = require('socket.io')(server);

var players = [];

console.log("Welcome ! Listening on port 3000.");

io.on('connection', function(client){
  
    var player;
    
    console.log("Player connected, but not identified...");
    
    client.on('init', function(data){
        player = data;
        players.push(player);
        console.log("Player identified ! (" + client.id + "), " + players.length + " clients connected");
        io.emit('player_join', players);
    });
    
    client.on('pos', function(data){
        player.x = data.x;
        player.y = data.y;
        
    });
    
    client.on('fire', function(data){
        client.broadcast.emit('player_fire', data);
    });
    
    client.on('disconnect', function(){
        players.splice(players.indexOf(player), 1);
        console.log("Player disconnected (" + client.id + ")");
        io.emit('player_quit', {id: player.id});
    });
});

server.listen(3000);

setInterval(sendPos, 15);

function sendPos() {
    io.emit('players_update', players);
}