function Wall(x, y, width, height) {
    
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    
    this.draw = function () {
        fill(37, 196, 244);
        rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    
}