let screen3D = new function () {
    let screen = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    };

    let canvs;
    let contxt;

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
    let initsize = 10;

    // let cubeZero = new Cube(-10, 10,-10,20,-20,20,1);
    // cubeZero.lines.forEach(line => objectPool.push(line));

    let cubes = [new Cube(0, 0, 0, 1, -1, 1, 100),
        new Cube(200, 0, 0, 1, -1, 1, 100),
        new Cube(0, 0, 200, 1, -2, 1, 100),
        new Cube(200, 0, 200, 1, -2, 1, 100)];

    cubes.forEach(cube => cube.lines.forEach(line => objectPool.push(line)));

    let renderPool = [];

    let cam = new Camera(150, -200, -200, -0.5, 0, 0, 1.5);

    this.initialize = function () {

        canvs = document.getElementById('screen');

        if (canvs && canvs.getContext) {
            contxt = canvs.getContext('2d');

            document.addEventListener('keydown', documentKeyDownHandler, false);
            document.addEventListener('keyup', documentKeyUpHandler, false);

            windowResizeHandler();

            setInterval(loop, 50);

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
            cam.moveFB(initsize);
        }
        if (key.back) {
            cam.moveFB(-initsize);
        }
        if (key.left) {
            cam.moveLR(-initsize);
        }
        if (key.right) {
            cam.moveLR(initsize);
        }
        if (key.up) {
            cam.moveY(-initsize);
        }
        if (key.down) {
            cam.moveY(initsize);
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

        objectPool.forEach((line) => {
            let ptn = line.points[0].get2DCoords(cam);
            let ptn2 = line.points[1].get2DCoords(cam);
            if ((ptn.x < -screen.width) || (ptn.y < -screen.height) || (ptn.x > screen.width * 2) || (ptn.y > screen.height * 2) || (ptn.distance < 0)
                || (ptn2.x < -screen.width) || (ptn2.y < -screen.height) || (ptn2.x > screen.width * 2) || (ptn2.y > screen.height * 2) || (ptn2.distance < 0)) {
            } else {
                renderPool.push(line);
            }
        });

        renderPool.sort(function (a, b) {
            return b.tempIndex - a.tempIndex;
        });

        contxt.fillStyle = "rgba(0,0,0,1)";
        contxt.clearRect(0, 0, screen.width, screen.height);

        renderPool.forEach(object => {
            object.render(cam,contxt,1);
        });

        renderPool = [];

        //console.log(cam.position.x + ","+ cam.position.y + "," + cam.position.z + "," + cam.rotation.x + "," + cam.rotation.y + "," + + cam.rotation.z + "," + cam.zoom);
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
    this.vertices = [new Point(x, y, z), new Point(x + this.size.x, y, z), new Point(x + this.size.x, y, z + this.size.z), new Point(x, y, z + this.size.z),
        new Point(x, y + this.size.y, z), new Point(x + this.size.x, y + this.size.y, z), new Point(x + this.size.x, y + this.size.y, z + this.size.z), new Point(x, y + this.size.y, z + this.size.z)];

    this.lines = [new Line(this.vertices[0], this.vertices[1]), new Line(this.vertices[1], this.vertices[2]),
        new Line(this.vertices[2], this.vertices[3]), new Line(this.vertices[3], this.vertices[0]),

        new Line(this.vertices[4], this.vertices[5]), new Line(this.vertices[5], this.vertices[6]),
        new Line(this.vertices[6], this.vertices[7]), new Line(this.vertices[7], this.vertices[4]),

        new Line(this.vertices[0], this.vertices[4]), new Line(this.vertices[1], this.vertices[5]),
        new Line(this.vertices[2], this.vertices[6]), new Line(this.vertices[3], this.vertices[7])];

    this.walls = [new Wall(this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]),
        new Wall(this.vertices[0], this.vertices[1], this.vertices[5], this.vertices[4]),
        new Wall(this.vertices[1], this.vertices[2], this.vertices[6], this.vertices[5]),
        new Wall(this.vertices[2], this.vertices[3], this.vertices[7], this.vertices[6]),
        new Wall(this.vertices[3], this.vertices[0], this.vertices[4], this.vertices[7]),
        new Wall(this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7])]
}

function Wall(p1, p2, p3, p4) {
    this.points = [p1, p2, p3, p4];
}

Wall.prototype.render = function (cam) {
    console.log("0");
};

function Line(p1, p2) {
    this.points = [p1, p2];
    //this.tempIndex = 0;
}

Line.prototype.render = function (cam, cont) {
    let screenCoords = this.points[0].get2DCoords(cam);
    let screenCoords2 = this.points[1].get2DCoords(cam);
    cont.beginPath();
    cont.moveTo(screenCoords.x, screenCoords.y);
    cont.lineTo(screenCoords2.x, screenCoords2.y);
    cont.strokeStyle = '#0000FF';
    cont.stroke();
};

function Point(x, y, z) {
    this.position = {
        x: x,
        y: y,
        z: z
    };
    //this.tempIndex = 0;
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


    //this.tempIndex = nz;
    return {
        x: (((nx) * (c.zoom / nz)) * (screen.height / 2)) + (screen.width / 2),
        y: (((ny) * (c.zoom / nz)) * (screen.height / 2)) + (screen.height / 2),
        distance: nz
    };
};

screen3D.initialize();