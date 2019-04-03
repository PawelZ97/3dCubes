let debug = false;

let screen3D = new function () {
    let screen = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    };

    let refreshing = 50;
    let movespeed = 10;

    let canvs;
    let contxt;

    let cam = new Camera(150, -200, -200, -0.5, 0, 0, 1.0);

    let key = {
        front: false,
        back: false,
        left: false,
        right: false,
        up_rot: false,
        left_rot: false,
        down_rot: false,
        right_rot: false,
        q: false,
        e: false,
        up: false,
        down: false,
        zoom_in: false,
        zoom_out: false
    };

    let objectPool = [];

    let cubes = [new Cube(0, 0, 0, 1, -1, 1, 100),
        new Cube(200, 0, 0, 1, -1, 1, 100),
        new Cube(0, 0, 200, 1, -2, 1, 100)];

    if (debug) {
        for (let i = 0; i < 100; i += 20) {
            cubes.push(new Cube(200, 0, 200 + i, 100, -200, 7, 1))
        }
    } else {
        cubes.push(new Cube(200, 0, 200, 1, -2, 1, 100));
    }


    cubes.forEach(cube => cube.walls.forEach(wall => objectPool.push(wall)));

    let renderPool = [];
    let renderPool2 = [];

    this.initialize = function () {

        canvs = document.getElementById('screen');

        if (canvs && canvs.getContext) {
            contxt = canvs.getContext('2d');

            document.addEventListener('keydown', documentKeyDownHandler, false);
            document.addEventListener('keyup', documentKeyUpHandler, false);

            windowResizeHandler();

            setInterval(loop, refreshing);

        }
    };

    function windowResizeHandler() {
        screen.width = window.innerWidth;
        screen.height = window.innerHeight;

        canvs.width = screen.width;
        canvs.height = screen.height;
    }

    function documentKeyDownHandler(event) {
        switch (event.keyCode) {
            case 87:
                key.front = true;
                event.preventDefault();
                break;
            case 83:
                key.back = true;
                event.preventDefault();
                break;
            case 65:
                key.left = true;
                event.preventDefault();
                break;
            case 68:
                key.right = true;
                event.preventDefault();
                break;
            case 73:
                key.up_rot = true;
                event.preventDefault();
                break;
            case 74:
                key.left_rot = true;
                event.preventDefault();
                break;
            case 75:
                key.down_rot = true;
                event.preventDefault();
                break;
            case 76:
                key.right_rot = true;
                event.preventDefault();
                break;
            case 82:
                key.up = true;
                event.preventDefault();
                break;
            case 70:
                key.down = true;
                event.preventDefault();
                break;
            case 81:
                key.zoom_in = true;
                event.preventDefault();
                break;
            case 69:
                key.zoom_out = true;
                event.preventDefault();
                break;
        }
    }

    function documentKeyUpHandler(event) {
        switch (event.keyCode) {
            case 87:
                key.front = false;
                event.preventDefault();
                break;
            case 83:
                key.back = false;
                event.preventDefault();
                break;
            case 65:
                key.left = false;
                event.preventDefault();
                break;
            case 68:
                key.right = false;
                event.preventDefault();
                break;
            case 73:
                key.up_rot = false;
                event.preventDefault();
                break;
            case 74:
                key.left_rot = false;
                event.preventDefault();
                break;
            case 75:
                key.down_rot = false;
                event.preventDefault();
                break;
            case 76:
                key.right_rot = false;
                event.preventDefault();
                break;
            case 82:
                key.up = false;
                event.preventDefault();
                break;
            case 70:
                key.down = false;
                event.preventDefault();
                break;
            case 81:
                key.zoom_in = false;
                event.preventDefault();
                break;
            case 69:
                key.zoom_out = false;
                event.preventDefault();
                break;
        }
    }


    function loop() {


        if (key.front) {
            cam.moveFB(movespeed);
        }
        if (key.back) {
            cam.moveFB(-movespeed);
        }
        if (key.left) {
            cam.moveLR(-movespeed);
        }
        if (key.right) {
            cam.moveLR(movespeed);
        }
        if (key.up) {
            cam.moveY(-movespeed);
        }
        if (key.down) {
            cam.moveY(movespeed);
        }
        if (key.up_rot) {
            cam.rotation.x += 0.03;
        }
        if (key.down_rot) {
            cam.rotation.x -= 0.03;
        }
        if (key.left_rot) {
            cam.rotation.y -= 0.03;
        }
        if (key.right_rot) {
            cam.rotation.y += 0.03;
        }
        if (key.zoom_in) {
            cam.zoom += 0.05;
        }
        if (key.zoom_out) {
            cam.zoom -= 0.05;
        }

        objectPool.forEach(wall => renderPool.push(wall));

        renderPool = renderPool.filter((wall) => {
            return wall.checkOnScreenVisibility(cam);
        });

        renderPool = renderPool.filter((wall) => {
            return wall.checkOrientationVisibility(cam);
        });

        //console.log(renderPool);

        renderPool.forEach(wall => renderPool2.push.apply(renderPool2, wall.getWallParts()));

        //console.log(renderPool2);

        renderPool2.sort((wallA, wallB) => {
            return wallB.getAvgDistance(cam) - wallA.getAvgDistance(cam);
        });

        contxt.fillStyle = "rgba(0,0,0,1)";
        contxt.clearRect(0, 0, screen.width, screen.height);

        renderPool2.forEach(object => {
            object.render(cam, contxt);
        });

        renderPool = [];
        renderPool2 = [];
    }
};

function Camera(x, y, z, xo, yo, zo, zoom) {
    this.position = {
        x: x,
        y: y,
        z: z
    };
    this.rotation = {
        x: xo,
        y: yo,
        z: zo
    };
    this.zoom = zoom;
}

Camera.prototype.moveFB = function (v) {
    let cosy = Math.cos(-this.rotation.y);
    let siny = Math.sin(-this.rotation.y);

    let nx = (-siny * (v));
    let nz = (cosy * (v));

    this.position.x += nx;
    this.position.z += nz;
};
Camera.prototype.moveLR = function (v) {
    let cosy = Math.cos(-this.rotation.y);
    let siny = Math.sin(-this.rotation.y);

    let nx = (cosy * (v));
    let nz = (siny * (v));

    this.position.x += nx;
    this.position.z += nz;
};

Camera.prototype.moveY = function (y) {
    this.position.y += y;
};


function Cube(x, y, z, x_size, y_size, z_size, multip) {
    this.position = {
        x: x,
        y: y,
        z: z
    };
    this.size = {
        x: x_size * multip,
        y: y_size * multip,
        z: z_size * multip,
    };
    this.points = [new Point(x, y, z), new Point(x + this.size.x, y, z), new Point(x + this.size.x, y, z + this.size.z), new Point(x, y, z + this.size.z),
        new Point(x, y + this.size.y, z), new Point(x + this.size.x, y + this.size.y, z), new Point(x + this.size.x, y + this.size.y, z + this.size.z), new Point(x, y + this.size.y, z + this.size.z)];

    this.lines = [new Line(this.points[0], this.points[1]), new Line(this.points[1], this.points[2]),
        new Line(this.points[2], this.points[3]), new Line(this.points[3], this.points[0]),

        new Line(this.points[4], this.points[5]), new Line(this.points[5], this.points[6]),
        new Line(this.points[6], this.points[7]), new Line(this.points[7], this.points[4]),

        new Line(this.points[0], this.points[4]), new Line(this.points[1], this.points[5]),
        new Line(this.points[2], this.points[6]), new Line(this.points[3], this.points[7])];

    if (debug) {
        this.wallscolors = ['#7800b2', '#00ff1c', '#ff9f00', '#0000FF', '#ff0002', '#d5ff00'];
    } else {
        this.wallscolors = ['#baff82', '#baff82', '#baff82', '#baff82', '#baff82', '#baff82'];
    }

    this.walls = [new Wall(this.points[3], this.points[2], this.points[1], this.points[0], this.wallscolors[0]),
        new Wall(this.points[0], this.points[1], this.points[5], this.points[4], this.wallscolors[1]),
        new Wall(this.points[1], this.points[2], this.points[6], this.points[5], this.wallscolors[2]),
        new Wall(this.points[2], this.points[3], this.points[7], this.points[6], this.wallscolors[3]),
        new Wall(this.points[3], this.points[0], this.points[4], this.points[7], this.wallscolors[4]),
        new Wall(this.points[4], this.points[5], this.points[6], this.points[7], this.wallscolors[5])]
}

function Wall(p1, p2, p3, p4, color) {
    this.points = [p1, p2, p3, p4];
    this.color = color;
}

Wall.prototype.checkOnScreenVisibility = function (cam) {
    let pointsIn2D = [];
    this.points.forEach(point => pointsIn2D.push(point.get2DCoords(cam)));
    let renderWallFlag = true;

    pointsIn2D.forEach(point => {
        if ((point.x < -screen.width) || (point.y < -screen.height) || (point.x > screen.width * 2) || (point.y > screen.height * 2) || (point.distance < 0))
            renderWallFlag = false;
    });

    return renderWallFlag;
};

Wall.prototype.checkOrientationVisibility = function (cam) {
    let p1 = this.points[0].position;
    let p2 = this.points[1].position;
    let p3 = this.points[2].position;
    let pCam = cam.position;
    let vecA = [p2.x - p1.x, p2.y - p1.y, p2.z - p1.z];
    let vecB = [p3.x - p2.x, p3.y - p2.y, p3.z - p2.z];
    let vecNorm = crossProduct(vecA, vecB);
    let vecCam = [pCam.x - p1.x, pCam.y - p1.y, pCam.z - p1.z];
    return (dotProduct(vecNorm, vecCam) > 0);
};

function dotProduct(ary1, ary2) {
    if (ary1.length !== ary2.length)
        return;
    let dotprod = 0;
    for (let i = 0; i < ary1.length; i++)
        dotprod += ary1[i] * ary2[i];
    return dotprod;
}

function crossProduct(a, b) {
    if (a.length !== 3 || b.length !== 3) {
        return;
    }
    return [a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]];
}

Wall.prototype.getWallParts = function () {
    let split = 10;
    let dHx = (this.points[1].position.x - this.points[0].position.x) / split;
    let dHy = (this.points[1].position.y - this.points[0].position.y) / split;
    let dHz = (this.points[1].position.z - this.points[0].position.z) / split;
    let dVx = (this.points[3].position.x - this.points[0].position.x) / split;
    let dVy = (this.points[3].position.y - this.points[0].position.y) / split;
    let dVz = (this.points[3].position.z - this.points[0].position.z) / split;
    let walls = [];
    let p1x = this.points[0].position.x;
    let p1y = this.points[0].position.y;
    let p1z = this.points[0].position.z;
    for (let i = 0; i < split; i++) {
        for (let j = 0; j < split; j++) {
            walls.push(new WallPart(new Point(p1x + i * dHx + j * dVx, p1y + i * dHy + j * dVy, p1z + i * dHz + j * dVz),
                new Point(p1x + (i + 1) * dHx + j * dVx, p1y + (i + 1) * dHy + j * dVy, p1z + (i + 1) * dHz + j * dVz),
                new Point(p1x + (i + 1) * dHx + (j + 1) * dVx, p1y + (i + 1) * dHy + (j + 1) * dVy, p1z + (i + 1) * dHz + (j + 1) * dVz),
                new Point(p1x + i * dHx + (j + 1) * dVx, p1y + i * dHy + (j + 1) * dVy, p1z + i * dHz + (j + 1) * dVz), this.color));
        }
    }
    return walls;
};

function WallPart(p1, p2, p3, p4, color) {
    this.points = [p1, p2, p3, p4];
    this.color = color;
}

WallPart.prototype.render = function (cam, context) {
    let pointsIn2D = [];
    this.points.forEach(point => pointsIn2D.push(point.get2DCoords(cam)));

    context.fillStyle = this.color;
    context.beginPath();
    context.moveTo(pointsIn2D[0].x, pointsIn2D[0].y);
    context.lineTo(pointsIn2D[1].x, pointsIn2D[1].y);
    context.lineTo(pointsIn2D[2].x, pointsIn2D[2].y);
    context.lineTo(pointsIn2D[3].x, pointsIn2D[3].y);
    context.closePath();
    context.fill();
    context.stroke();

};

WallPart.prototype.getAvgDistance = function (cam) {
    let pointsIn2D = [];
    this.points.forEach(point => pointsIn2D.push(point.get2DCoords(cam)));
    let distances = [];
    pointsIn2D.forEach(point => distances.push(point.distance));
    let sum = 0;
    let avgDistance = 0;

    if (distances.length) {
        sum = distances.reduce(function (a, b) {
            return a + b;
        });
        avgDistance = sum / distances.length;
    }
    return avgDistance;
};

function Line(p1, p2) {
    this.points = [p1, p2];
}

Line.prototype.render = function (cam, context) {
    let screenCoords = this.points[0].get2DCoords(cam);
    let screenCoords2 = this.points[1].get2DCoords(cam);
    context.beginPath();
    context.moveTo(screenCoords.x, screenCoords.y);
    context.lineTo(screenCoords2.x, screenCoords2.y);
    context.strokeStyle = '#0000FF';
    context.stroke();
};

function Point(x, y, z) {
    this.position = {
        x: x,
        y: y,
        z: z
    };
}

Point.prototype.get2DCoords = function (cam) {

    let dx = this.position.x - cam.position.x;
    let dy = this.position.y - cam.position.y;
    let dz = this.position.z - cam.position.z;

    let cosx = Math.cos(cam.rotation.x);
    let cosy = Math.cos(cam.rotation.y);
    let cosz = Math.cos(cam.rotation.z);
    let sinx = Math.sin(cam.rotation.x);
    let siny = Math.sin(cam.rotation.y);
    let sinz = Math.sin(cam.rotation.z);

    let nx = (cosy * (sinz * (dy) + cosz * (dx)) - siny * (dz));
    let ny = (sinx * (cosy * (dz) + siny * (sinz * (dy) + cosz * (dx))) + cosx * (cosz * (dy) - sinz * (dx)));
    let nz = (cosx * (cosy * (dz) + siny * (sinz * (dy) + cosz * (dx))) - sinx * (cosz * (dy) - sinz * (dx)));

    return {
        x: (((nx) * (cam.zoom / nz)) * (screen.height / 2)) + (screen.width / 2),
        y: (((ny) * (cam.zoom / nz)) * (screen.height / 2)) + (screen.height / 2),
        distance: nz
    };
};

screen3D.initialize();