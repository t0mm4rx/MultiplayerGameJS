function Wall(x, y, width, height) {

    this.pos = createVector(x, y);
    this.width = width;
    this.height = height;

    this.draw = function () {
        fill(37, 196, 244);
        rect(this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.height);
    }

}
