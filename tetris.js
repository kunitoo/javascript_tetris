var ctx;
var block = [
    [1, 1],
    [0, 1],
    [0, 1]
];
var posx = 0, posy = 0;
var map, mapWidth = 10, mapHeight = 20;

function load() {
    var elmTarget = document.getElementById('target');
    ctx = elmTarget.getContext('2d');
    ctx.fillStyle = 'rgb(255, 0, 0)';

    map = [];
    for (var y = 0; y < mapHeight; y++) {
        map[y] = [];
        for (var x = 0; x < mapWidth; x++) {
            map[y][x] = 0;
        }
    }
    setInterval(paint, 200);
}

function paintMatrix(matrix, offsetx, offsety, color) {
    ctx.fillStyle = color;
    for (var y = 0; y < matrix.length; y++) {
        for (var x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x]) {
                ctx.fillRect((x + offsetx) * 20, (y + offsety) * 20, 20, 20);
            }
        }
    }
    posy = posy + 1;
}

function paint() {
    ctx.clearRect(0, 0, 200, 400);
    paintMatrix(map, 0, 0, 'rgb(128, 128, 128)');
    paintMatrix(block, posx, posy, 'rgb(255, 0, 0)');
    posy = posy + 1;
}

function clean() {
    ctx.clearRect(0, 0, 200, 400);
}

