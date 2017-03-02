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
    
    this.up = false, this.down = false, this.left = false, this.right = false;
    
    this.draw = function () {
        this.bullets.forEach(function (bullet) {
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
        /*textSize(10);
        text(this.id, this.pos.x, this.pos.y - 10);*/
        
    }
    
    this.update = function () {
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
        
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        
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
        
        if (this.lifes < 0) {
            //DIE STUFF HERE
            this.lifes = 3;
        }
        
        if (this.lastPos.x != this.pos.x || this.lastPos.y != this.pos.y) {
            this.lastPos = createVector(this.pos.x, this.pos.y);
            if (isPlayer) {
                socket.emit('pos', {
                x: this.pos.x
                , y: this.pos.y
                , id: this.id
            });
            }
        }
    }
    
    this.hurt = function () {
        console.log("Hurted");
        this.lifes--;
    }
    
    this.fire = function (target) {
        this.bullets.push(new Bullet(this, target));
        socket.emit('fire', {targetX: target.x, targetY: target.y, id: this.id});
    }
    
    this.onKeyPressed = function (keyCode) {
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
    
    this.onKeyReleased = function (keyCode) {
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
    
    this.onMouseClicked = function (mouseX, mouseY) {
        this.fire(createVector(mouseX, mouseY));
    }
    
}