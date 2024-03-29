Array.prototype.each = function(fn) {
    var result = [];
    for (var i = 0; i < this.length; i++) {
        result[i] = fn(this[i], i);
    }
    return result;
};

var Matrix = function(matrix) {
    this.matrix = matrix;
    this.height = matrix.length;
    this.width = matrix[0].length;
};

Matrix.prototype.each = function(fn) {
    return this.matrix.each(fn);
};

Matrix.prototype.get = function(x, y) {
    return (this.matrix[y] && this.matrix[y][x]) || 0;
};

Matrix.prototype.paint = function(offsetx, offsety, color) {
    ctx.fillStyle = color;
    this.matrix.each(function(row, y) {
                         row.each(function(val, x) {
                                      if (val) ctx.fillRect((x + offsetx) * 20, (y + offsety) * 20, 20, 20);
                                  });
                     });
};

Matrix.prototype.check = function(block, offsetx, offsety) {
    if (offsetx < 0 || offsety < 0 ||
        this.height < offsety + block.height ||
        this.width < offsetx + block.width) {
        return false;
    }

    var matrix = this.matrix;
    var ok = true;
    block.each(function(row, y) {
                   row.each(function(val, x) {
                                if (val && matrix[y + offsety][x + offsetx]) ok = false;
                            });
               });
    return ok;
};

Matrix.prototype.merge = function(block, offsetx, offsety) {
    this.matrix.each(function(row, y) {
                         row.each(function(val, x) {
                                      row[x] += block.get(x - offsetx, y - offsety);
                                  });
                     });
};

Matrix.prototype.clearRows = function() {
    var matrix = this.matrix;
    var width = this.width;
    matrix.each(function(row, y) {
                    var full = true;
                    row.each(function(val, x) {
                                 if (!val) full = false;
                             });
                    if (full) {
                        matrix.splice(y, 1);
                        matrix.unshift(new Array(width).each(function() {return 0;}));
                    }
                });
};

Matrix.prototype.rotate = function() {
    var matrix = this.matrix;
    return new Matrix(new Array(matrix[0].length).each(function(_, y) {
                                                           return new Array(matrix.length).each(function(_, x) {
                                                                                                    return matrix[matrix.length - x - 1][y];
                                                                                                });
                                                       }));
};

var ctx;
var blocks = [
    new Matrix([
                   [1, 1],
                   [0, 1],
                   [0, 1]
               ]),
    new Matrix([
                   [1, 1],
                   [1, 0],
                   [1, 0]
               ]),
    new Matrix([
                   [1, 1],
                   [1, 1]
               ]),
    new Matrix([
                   [1, 0],
                   [1, 1],
                   [1, 0]
               ]),
    new Matrix([
                   [1, 0],
                   [1, 1],
                   [0, 1]
               ]),
    new Matrix([
                   [0, 1],
                   [1, 1],
                   [1, 0]
               ]),
    new Matrix([
                   [1],
                   [1],
                   [1],
                   [1]
               ])
];
var block = blocks[Math.floor(Math.random() * blocks.length)];
var posx = 0, posy = 0;
var mapWidth = 10, mapHeight = 20;

var map = new Matrix(new Array(20).each(function() {
                                            return new Array(10).each(function() {return 0;});
                                        }));

function load() {
    var elmTarget = document.getElementById('target');
    ctx = elmTarget.getContext('2d');

    setInterval(function() {
                    ctx.clearRect(0, 0, 200, 400);
                    block.paint(posx, posy, 'rgb(255, 0, 0)');
                    map.paint(0, 0, 'rgb(128, 128, 128)');

                    if (map.check(block, posx, posy + 1)) {
                        posy = posy + 1;
                    }
                    else {
                        map.merge(block, posx, posy);
                        map.clearRows();
                        posx = 0; posy = 0;
                        block = blocks[Math.floor(Math.random() * blocks.length)];
                    }
                }, 200);
};

function key(keyCode) {
    switch(keyCode) {
    case 38:
        if (!map.check(block.rotate(), posx, posy)) return;
        block = block.rotate(block);
        break;
    case 39:
        if (!map.check(block, posx + 1, posy)) return;
        posx = posx + 1;
        break;
    case 37:
        if (!map.check(block, posx - 1, posy)) return;
        posx = posx - 1;
        break;
    case 40:
        var y = posy;
        while (map.check(block, posy, y)) { y++; }
        posy = y - 1;
        break;
    default:
        return;
    }
    ctx.clearRect(0, 0, 200, 400);
    block.paint(posx, posy, 'rgb(255, 0, 0)');
    map.paint(0, 0, 'rgb(128, 128, 128)');
}
