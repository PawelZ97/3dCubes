var screen3D = new function () {
    var screen = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    };

    var canvs;
    var contxt;

    var key = {
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

    var objectPool = [];

    var scale = 100;

    var initsize = 10;

    var j = 0;

    for (var i = 0; i < 400; i += 2*scale) {

            j = 0;
            objectPool.push(new line(new point(0 + i, 0, 0 + j), new point(0 + i, 0, scale + j)));
            objectPool.push(new line(new point(0 + i, 0, scale + j), new point(scale + i, 0, scale + j)));
            objectPool.push(new line(new point(scale + i, 0, scale + j), new point(scale + i, 0, 0 + j)));
            objectPool.push(new line(new point(0 + i, 0, 0 + j), new point(scale + i, 0, 0 + j)));

            objectPool.push(new line(new point(0 + i, -scale, 0), new point(0 + i, -scale, scale + j)));
            objectPool.push(new line(new point(0 + i, -scale, scale), new point(scale+ i, -scale, scale + j)));
            objectPool.push(new line(new point(scale + i, -scale, scale), new point(scale+ i, -scale, 0 + j)));
            objectPool.push(new line(new point(0 + i, -scale, 0), new point(scale+ i, -scale, 0 + j)));

            objectPool.push(new line(new point(0 + i, 0, 0 + j), new point(0+ i, -scale, 0 + j)));
            objectPool.push(new line(new point(0 + i, 0, scale + j), new point(0 + i, -scale, scale + j)));
            objectPool.push(new line(new point(scale + i, 0, scale + j), new point(scale + i, -scale, scale + j)));
            objectPool.push(new line(new point(scale + i, 0, 0 + j), new point(scale + i, -scale, 0 + j)));

            j = 200;
            objectPool.push(new line(new point(0 + i, 0, 0 + j), new point(0 + i, 0, scale + j)));
            objectPool.push(new line(new point(0 + i, 0,  scale + j), new point(scale + i, 0, scale + j)));
            objectPool.push(new line(new point(scale + i, 0, scale + j), new point(scale + i, 0, 0 + j)));
            objectPool.push(new line(new point(0 + i, 0, 0 + j), new point(scale + i, 0, 0 + j)));

            objectPool.push(new line(new point(0 + i, -2*scale, 0 + j), new point(0 + i, -2*scale, scale + j)));
            objectPool.push(new line(new point(0 + i, -2*scale, scale + j), new point(scale+ i, -2*scale, scale + j)));
            objectPool.push(new line(new point(scale + i, -2*scale, scale+ j), new point(scale+ i, -2*scale, 0 + j)));
            objectPool.push(new line(new point(0 + i, -2*scale, 0 + j), new point(scale+ i, -2*scale, 0 + j)));

            objectPool.push(new line(new point(0 + i, 0, 0 + j), new point(0 + i, -2*scale, 0 + j)));
            objectPool.push(new line(new point(0 + i, 0, scale + j), new point(0 + i, -2*scale, scale + j)));
            objectPool.push(new line(new point(scale + i, 0, scale + j), new point(scale + i, -2*scale, scale + j)));
            objectPool.push(new line(new point(scale + i, 0, 0 + j), new point(scale + i, -2*scale, 0 + j)));
    }

    var renderPool = [];

    var cam = new camera(150, -200, -200, -0.5, 0, 0, 1.5);

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
            cam.move(initsize);
        }
        if (key.back) {
            cam.move(-initsize);
        }
        if (key.left) {
            cam.pan(-initsize);
        }
        if (key.right) {
            cam.pan(initsize);
        }
        if (key.up) {
            cam.heig(-initsize);
        }
        if (key.down) {
            cam.heig(initsize);
        }
        if (key.up_rot) {
            cam.orientation.x += 0.03;
        }
        if (key.down_rot) {
            cam.orientation.x -= 0.03;
        }
        if (key.left_rot) {
            cam.orientation.y -= 0.03;
        }
        if (key.right_rot) {
            cam.orientation.y += 0.03;
        }
        if (key.zoom_in) {
            cam.zoom += 0.05;
        }
        if (key.zoom_out) {
            cam.zoom -= 0.05;
        }

        var temp;
        for (var i = 0, len = objectPool.length; i < len; i++) {
            var object = objectPool[i];
            if (typeof object === 'undefined') {
                continue;
            }

            temp = object.getScreenCoords(cam);
            if ((temp.x < -screen.width) || (temp.y < -screen.height) || (temp.x > screen.width * 2) || (temp.y > screen.height * 2) || (temp.distance < 0)) {
            } else {
                renderPool.push(object);
            }
        }
        renderPool.sort(function (a, b) {
            return b.tempIndex - a.tempIndex;
        });

        contxt.fillStyle = "rgba(0,0,0,1)";
        contxt.clearRect(0, 0, screen.width, screen.height);
        for (var i = 0, len = renderPool.length; i < len; i++) {
            var object = renderPool[i];
            object.render(cam, contxt, 1);
        }
        renderPool = [];

        console.log(cam.position.x + ","+ cam.position.y + "," + cam.position.z + "," + cam.orientation.x +
            "," + cam.orientation.y + "," + + cam.orientation.z + "," + cam.zoom);
    }
};

function camera(xpos, ypos, zpos, xori, yori, zori, zoom) {
    this.position = {
        x: xpos,
        y: ypos,
        z: zpos
    };
    this.orientation = {
        x: xori,
        y: yori,
        z: zori
    };
    this.zoom = zoom;
}
camera.prototype.move = function (z) {
    var tz = z;

    var cosx = Math.cos(-this.orientation.x);
    var cosy = Math.cos(-this.orientation.y);
    var cosz = Math.cos(0);
    var sinx = Math.sin(-this.orientation.x);
    var siny = Math.sin(-this.orientation.y);
    var sinz = Math.sin(0);

    var nx = (-siny * (tz));
    var nz = (cosx * (cosy * (tz)));

    this.position.x += nx;
    this.position.z += nz;
};
camera.prototype.pan = function (x) {
    var tx = x;

    var cosx = Math.cos(0);
    var cosy = Math.cos(-this.orientation.y);
    var cosz = Math.cos(-this.orientation.z);
    var sinx = Math.sin(0);
    var siny = Math.sin(-this.orientation.y);
    var sinz = Math.sin(-this.orientation.z);

    var nx = (cosy * (cosz * (tx)));
    var ny = (sinx * (siny * (cosz * (tx))) + cosx * (-sinz * (tx)));
    var nz = (cosx * (siny * (cosz * (tx))) - sinx * (-sinz * (tx)));

    this.position.x += nx;
    this.position.y += ny;
    this.position.z += nz;
};

camera.prototype.heig = function (y) {

    var tx = 0;
    var ty = y;
    var tz = 0;

    var cosx = Math.cos(0);
    var cosy = Math.cos(-this.orientation.y);
    var cosz = Math.cos(-this.orientation.z);
    var sinx = Math.sin(0);
    var siny = Math.sin(-this.orientation.y);
    var sinz = Math.sin(-this.orientation.z);

    var nx = (cosy * (sinz * (ty)));
    var ny = (sinx * (siny * (sinz * (ty))) + cosx * (cosz * (ty)));
    var nz = (cosx * (siny * (sinz * (ty))) - sinx * (cosz * (ty)));

    this.position.x += nx;
    this.position.y += ny;
    this.position.z += nz;
};

function point(x, y, z) {
    this.position = {
        x: x,
        y: y,
        z: z
    };
    this.tempIndex = 0;
};

point.prototype.getScreenCoords = function (c) {

    var tx = this.position.x - c.position.x;
    var ty = this.position.y - c.position.y;
    var tz = this.position.z - c.position.z;

    var cosx = Math.cos(c.orientation.x);
    var cosy = Math.cos(c.orientation.y);
    var cosz = Math.cos(c.orientation.z);
    var sinx = Math.sin(c.orientation.x);
    var siny = Math.sin(c.orientation.y);
    var sinz = Math.sin(c.orientation.z);

    var nx = (cosy * (sinz * (ty) + cosz * (tx)) - siny * (tz));
    var ny = (sinx * (cosy * (tz) + siny * (sinz * (ty) + cosz * (tx))) + cosx * (cosz * (ty) - sinz * (tx)));
    var nz = (cosx * (cosy * (tz) + siny * (sinz * (ty) + cosz * (tx))) - sinx * (cosz * (ty) - sinz * (tx)));

    this.tempIndex = nz;
    return {
        x: (((nx) * (c.zoom / nz)) * (screen.height / 2)) + (screen.width / 2),
        y: (((ny) * (c.zoom / nz)) * (screen.height / 2)) + (screen.height / 2),
        distance: nz
    };
};


point.prototype.render = function (cam, cont) {


};

function line(p1, p2) {
    this.points = new Array;
    this.points[0] = p1;
    this.points[1] = p2;
    this.tempIndex = 0;
};

line.prototype.getScreenCoords = function (c) {
    var screenCoords = this.points[0].getScreenCoords(c);
    this.tempIndex = this.points[0].tempIndex;
    return (screenCoords);
};
line.prototype.render = function (cam, cont) {
    var screenCoords = this.points[0].getScreenCoords(cam);
    var screenCoords2 = this.points[1].getScreenCoords(cam);
    cont.beginPath();
    cont.moveTo(screenCoords.x, screenCoords.y);
    cont.lineTo(screenCoords2.x, screenCoords2.y);
    cont.strokeStyle = '#0000FF';
    cont.stroke();
};

screen3D.initialize();