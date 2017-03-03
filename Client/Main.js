var player;
var players = [];
var objects = [];
var socket;
var id;

function preload() {
    socket = io.connect("192.168.0.9:3000");
    socket.on('connect', function() {
        id = socket.id;
        player.id = id;
        socket.emit('init', {
            x: player.pos.x,
            y: player.pos.y,
            lifes: player.lifes,
            deathes: player.deathes,
            id: id
        });
    });
    socket.on('map_update', function (map) {
      for (var i = 0; i < map.length; i++) {
          var object = map[i];
          switch (object.type) {
            case "Wall":
              objects.push(new Wall(object.x, object.y, object.width, object.height));
              break;
          }
      }
        this.objects = map;
    });
    socket.on('player_join', function(data) {
        for (var i = 0; i < data.length; i++) {
            if (getPlayerById(data[i].id) == -1 && id != data[i].id) {
                players.push(new Player(data[i].x, data[i].y, false, data[i].id));
            }
        }
    });
    socket.on('player_quit', function(data) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].id == data.id) {
                players.splice(i, 1);
            }
        }
    });
    socket.on('players_update', function(data) {
        for (var i = 0; i < data.length; i++) {
            if (id != data[i].id) {
                if (getPlayerById(data[i].id) != -1) {
                    var _player = getPlayerById(data[i].id);
                    _player.pos.x = data[i].x;
                    _player.pos.y = data[i].y;
                }
            }
        }
    });
    socket.on('player_fire', function(data) {
        if (data.id != player.id) {
            getPlayerById(data.id).fire(createVector(data.targetX, data.targetY));
        }
    });
    socket.on('player_update', function(data) {
        if (data.id != player.id) {
            getPlayerById(data.id).lifes = data.lifes;
            getPlayerById(data.id).deathes = data.deathes;
        }
    });
}

function setup() {
    createCanvas(700, 500);
    player = new Player(width / 2, height / 2, true);
    //objects.push(new Wall(200, 100, 200, 20));
}

function draw() {
    background(44, 62, 80);
    player.draw();
    player.update();
    players.forEach(function(p) {
        if (p.id != player.id) {
            p.draw();
            p.update();
        }
    });

    objects.forEach(function(wall) {
        wall.draw();
    });
}

function getPlayerById(id) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == id) {
            return players[i];
        }
    }
    return -1;
}

function keyPressed() {
    player.onKeyPressed(keyCode);
}

function keyReleased() {
    player.onKeyReleased(keyCode);
}

function mouseClicked() {
    player.onMouseClicked(mouseX, mouseY);
}
