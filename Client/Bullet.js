function Bullet(_player, pos2) {
    this.pos = createVector(_player.pos.x, _player.pos.y);
    this.speed = 10;
    this.vel = createVector(pos2.x - this.pos.x, pos2.y - this.pos.y).normalize().mult(this.speed);
    this.r = 3;
    this.draw = function () {
        fill(239, 72, 54);
        ellipse(this.pos.x - this.r / 2, this.pos.y - this.r / 2, this.r, this.r);
    }
    this.update = function () {
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        if (this.pos.x > width || this.pos.x < 0 || this.pos.y < 0 || this.pos.y > height) {
            this.killItself();
        }
        for (var i = 0; i < players.length + 1; i++) {
            if (i == players.length) {
                var p = player;
            } else {
                var p = players[i];
            }
            if (p.id != _player.id) {
                if (this.pos.x > p.pos.x - p.r / 2 && this.pos.x < p.pos.x + p.r / 2) {
                    if (this.pos.y > p.pos.y - p.r / 2 && this.pos.y < p.pos.y + p.r / 2) {
                        //console.log("Col : " + p.id + " && " + _player.id);
                        this.killItself();
                        p.hurt(_player);
                        return;
                    }
                }
            }
        }
        for (var i = 0; i < objects.length; i++) {
          var wall = objects[i];
          if (this.pos.x > wall.pos.x - wall.width / 2 && this.pos.x < wall.pos.x + wall.width / 2) {
              if (this.pos.y > wall.pos.y - wall.height / 2 && this.pos.y < wall.pos.y + wall.height / 2) {
                  this.killItself();
                  return;
              }
          }
        }
    }
    this.killItself = function () {
        _player.bullets.splice(_player.bullets.indexOf(this), 1);
    }
}
