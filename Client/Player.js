function Player(x, y, isPlayer, id) {
    if (id == null) {
        this.id = "Loading...";
    } else {
        this.id = id;
    }
    this.pos = createVector(x, y);
    this.lastPos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.speed = 5, this.acceleration = .5, this.decceleration = 10;
    this.r = 20;
    this.bullets = [];
    this.lifes = 3;
    this.fireRate = 500;
    this.lastFire = Date.now();
    this.deathes = 0;

    this.up = false, this.down = false, this.left = false, this.right = false;

    this.draw = function() {
        this.bullets.forEach(function(bullet) {
            bullet.draw();
        });
        if (isPlayer) {
            fill(52, 152, 219);
        } else {
            fill(255);
        }
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
        fill(197, 239, 247);
        noStroke();
        rect(this.pos.x - 15, this.pos.y - 20, this.lifes * 10, 5);
        fill(255);
        textSize(10);
        text(this.deathes, this.pos.x - 3 * this.deathes.toString().length, this.pos.y + 20);

    }

    this.update = function() {
        if (this.up && this.vel.y > -this.speed) {
            this.vel.y -= this.acceleration;
        }
        if (this.down && this.vel.y < this.speed) {
            this.vel.y += this.acceleration;
        }
        if (this.left && this.vel.x > -this.speed) {
            this.vel.x -= this.acceleration;
        }
        if (this.right && this.vel.x < this.speed) {
            this.vel.x += this.acceleration;
        }

        this.vel.x += -this.vel.x / this.decceleration;
        this.vel.y += -this.vel.y / this.decceleration;

        if (!this.doesCollideX(this.vel.x)) {
            this.pos.x += this.vel.x;
        }
        if (!this.doesCollideY(this.vel.y)) {
            this.pos.y += this.vel.y;
        }

        if (this.pos.x <= this.r / 2) {
            this.pos.x = this.r / 2;
        }
        if (this.pos.y <= this.r / 2) {
            this.pos.y = this.r / 2;
        }
        if (this.pos.y >= height - this.r / 2) {
            this.pos.y = height - this.r / 2;
        }
        if (this.pos.x >= width - this.r / 2) {
            this.pos.x = width - this.r / 2;
        }

        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update();
        }

        if (this.lastPos.x != this.pos.x || this.lastPos.y != this.pos.y) {
            this.lastPos = createVector(this.pos.x, this.pos.y);
            if (isPlayer) {
                socket.emit('pos', {
                    x: this.pos.x,
                    y: this.pos.y,
                    id: this.id
                });
            }
        }

    }

    this.hurt = function(p) {
      if (isPlayer) {
        this.lifes--;
        if (this.lifes < 0) {
            this.deathes++;
            this.lifes = 3;
        }
        socket.emit('update', {id: this.id, lifes: this.lifes, deathes: this.deathes});
        this.vel.x += (this.pos.x - p.pos.x) / 50;
        this.vel.y += (this.pos.y - p.pos.y) / 50;
      }
    }

    this.fire = function(target) {
        if (Date.now() - this.lastFire >= this.fireRate) {
            this.lastFire = Date.now();
            this.vel.x += (this.pos.x - target.x) / 50;
            this.vel.y += (this.pos.y - target.y) / 50;
            this.bullets.push(new Bullet(this, target));
            socket.emit('fire', {
                targetX: target.x,
                targetY: target.y,
                id: this.id
            });
        }
    }

    this.doesCollideY = function(y) {
        //console.log("ColY");
        for (var i = 0; i < objects.length; i++) {
            var wall = objects[i];
            if (this.pos.x + this.r / 2 >= wall.pos.x - wall.width / 2 && this.pos.x - this.r / 2 <= wall.pos.x + wall.width / 2) {
                if (this.pos.y + this.r / 2 + y >= wall.pos.y - wall.height / 2 && this.pos.y - this.r / 2 + y <= wall.pos.y + wall.height / 2) {
                    return true;
                }
            }
        }
        return false;
    }

    this.doesCollideX = function(x) {
        for (var i = 0; i < objects.length; i++) {
            var wall = objects[i];
            if (this.pos.x + this.r / 2 + x >= wall.pos.x - wall.width / 2 && this.pos.x - this.r / 2 + x <= wall.pos.x + wall.width / 2) {
                if (this.pos.y + this.r / 2 >= wall.pos.y - wall.height / 2 && this.pos.y - this.r / 2 <= wall.pos.y + wall.height / 2) {
                    return true;
                }
            }
        }
        return false;
    }

    this.onKeyPressed = function(keyCode) {
        //console.log(keyCode);
        switch (keyCode) {
            case 38:
                this.up = true;
                break;
            case 40:
                this.down = true;
                break;
            case 37:
                this.left = true;
                break;
            case 39:
                this.right = true;
                break;
        }
    }

    this.onKeyReleased = function(keyCode) {
        switch (keyCode) {
            case 38:
                this.up = false;
                break;
            case 40:
                this.down = false;
                break;
            case 37:
                this.left = false;
                break;
            case 39:
                this.right = false;
                break;
        }
    }

    this.onMouseClicked = function(mouseX, mouseY) {
        this.fire(createVector(mouseX, mouseY));
    }

}
