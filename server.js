var server = require('http').createServer();
var io = require('socket.io')(server);

var players = [];

var map1 = [];
map1.push({type: "Wall", x: 190, y: 100, width: 200, height: 20});
map1.push({type: "Wall", x: 100, y: 200, width: 20, height: 200});
map1.push({type: "Wall", x: 510, y: 400, width: 200, height: 20});
map1.push({type: "Wall", x: 600, y: 300, width: 20, height: 200});

console.log("Welcome ! Listening on port 3000.");

io.on('connection', function(client){

    var player;

    console.log("Player connected, but not identified...");

    client.on('init', function(data){
        player = data;
        players.push(player);
        console.log("Player identified ! (" + client.id + "), " + players.length + " clients connected");
        client.emit('map_update', map1);
        io.emit('player_join', players);
    });

    client.on('pos', function(data){
        player.x = data.x;
        player.y = data.y;

    });

    client.on('fire', function(data){
        client.broadcast.emit('player_fire', data);
    });

    client.on('update', function(data){
        client.broadcast.emit('player_update', data);
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
