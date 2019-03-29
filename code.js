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

    let cam = new Camera(150, -200, -200, -0.5, 0, 0, 1.5);

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
        new Cube(0, 0, 200, 1, -2, 1, 100),
        new Cube(200, 0, 200, 1, -2, 1, 100)];

    cubes.forEach(cube => cube.walls.forEach(wall => objectPool.push(wall)));

    let renderPool = [];

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
            return wall.checkOrientationVisibility(cam);
        });

        renderPool = renderPool.filter((wall) => {
            return wall.checkOnScreenVisibility(cam);
        });

        renderPool.sort((wallA,wallB) => {
            return wallB.getAvgDistance(cam) - wallA.getAvgDistance(cam);
        });

        contxt.fillStyle = "rgba(0,0,0,1)";
        contxt.clearRect(0, 0, screen.width, screen.height);

        renderPool.forEach(object => {
            object.render(cam, contxt);
        });

        renderPool = [];
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

    this.walls = [new Wall(this.points[0], this.points[1], this.points[2], this.points[3]),
        new Wall(this.points[0], this.points[1], this.points[5], this.points[4]),
        new Wall(this.points[1], this.points[2], this.points[6], this.points[5]),
        new Wall(this.points[2], this.points[3], this.points[7], this.points[6]),
        new Wall(this.points[3], this.points[0], this.points[4], this.points[7]),
        new Wall(this.points[4], this.points[5], this.points[6], this.points[7])]
}

function Wall(p1, p2, p3, p4) {
    this.points = [p1, p2, p3, p4];
}

Wall.prototype.render = function (cam, context, color = '#baff82') {
    let pointsIn2D = [];
    this.points.forEach(point => pointsIn2D.push(point.get2DCoords(cam)));

    context.fillStyle = color;
    context.beginPath();
    context.moveTo(pointsIn2D[0].x, pointsIn2D[0].y);
    context.lineTo(pointsIn2D[1].x, pointsIn2D[1].y);
    context.lineTo(pointsIn2D[2].x, pointsIn2D[2].y);
    context.lineTo(pointsIn2D[3].x, pointsIn2D[3].y);
    context.closePath();
    context.fill();
    context.stroke();

};

Wall.prototype.checkOnScreenVisibility = function (cam) {
    let pointsIn2D = [];
    this.points.forEach(point => pointsIn2D.push(point.get2DCoords(cam)));
    let renderWallFlag = true;

    pointsIn2D.forEach(point => {
        if  ((point.x < -screen.width) || (point.y < -screen.height) || (point.x > screen.width * 2) || (point.y > screen.height * 2) || (point.distance < 0))
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
    let vecNorm = math.cross(vecA, vecB);
    let vecCam = [pCam.x - p1.x, pCam.y - p1.y, pCam.z - p1.z];
    console.log(math.dot(vecNorm,vecCam) > 0);
    return (math.dot(vecNorm,vecCam) > 0);
};

Wall.prototype.getAvgDistance = function (cam) {
    let pointsIn2D = [];
    this.points.forEach(point => pointsIn2D.push(point.get2DCoords(cam)));
    let distances = [];
    pointsIn2D.forEach(point => distances.push(point.distance));
    let sum = 0;
    let avgDistance = 0;

    if (distances.length)
    {
        sum = distances.reduce(function(a, b) { return a + b; });
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

Point.prototype.get2DCoords = function (c) {

    let dx = this.position.x - c.position.x;
    let dy = this.position.y - c.position.y;
    let dz = this.position.z - c.position.z;

    let cosx = Math.cos(c.rotation.x);
    let cosy = Math.cos(c.rotation.y);
    let cosz = Math.cos(c.rotation.z);
    let sinx = Math.sin(c.rotation.x);
    let siny = Math.sin(c.rotation.y);
    let sinz = Math.sin(c.rotation.z);

    let nx = (cosy * (sinz * (dy) + cosz * (dx)) - siny * (dz));
    let ny = (sinx * (cosy * (dz) + siny * (sinz * (dy) + cosz * (dx))) + cosx * (cosz * (dy) - sinz * (dx)));
    let nz = (cosx * (cosy * (dz) + siny * (sinz * (dy) + cosz * (dx))) - sinx * (cosz * (dy) - sinz * (dx)));

    return {
        x: (((nx) * (c.zoom / nz)) * (screen.height / 2)) + (screen.width / 2),
        y: (((ny) * (c.zoom / nz)) * (screen.height / 2)) + (screen.height / 2),
        distance: nz
    };
};

screen3D.initialize();