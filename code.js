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
            // case 85:
            //     key.z_left_rot = true;
            //     event.preventDefault();
            //     break;
            // case 79:
            //     key.z_right_rot = true;
            //     event.preventDefault();
            //     break;
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
            // case 85:
            //     key.z_left_rot = false;
            //     event.preventDefault();
            //     break;
            // case 79:
            //     key.z_right_rot = false;
            //     event.preventDefault();
            //     break;
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
        // if (key.z_left_rot) {
        //     cam.rotation.z += 0.03;
        // }
        // if (key.z_right_rot) {
        //     cam.rotation.z -= 0.03;
        // }
        if (key.zoom_in) {
            cam.zoom += 0.05;
        }
        if (key.zoom_out) {
            cam.zoom -= 0.05;
        }

        var ptn, pt2;
        for (var i = 0, len = objectPool.length; i < len; i++) {
            var object = objectPool[i];
            if (typeof object === 'undefined') {
                continue;
            }

            ptn = object.get2DCoords(cam ,0);
            pt2 = object.get2DCoords(cam ,1);
            if ((ptn.x < -screen.width) || (ptn.y < -screen.height) || (ptn.x > screen.width * 2) || (ptn.y > screen.height * 2) || (ptn.distance < 0)
            || (pt2.x < -screen.width) || (pt2.y < -screen.height) || (pt2.x > screen.width * 2) || (pt2.y > screen.height * 2) || (pt2.distance < 0)) {
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

        //console.log(cam.position.x + ","+ cam.position.y + "," + cam.position.z + "," + cam.rotation.x + "," + cam.rotation.y + "," + + cam.rotation.z + "," + cam.zoom);
    }
};

function camera(x, y, z, xo, yo, zo, zoom) {
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
camera.prototype.moveFB = function (v) {
    var cosy = Math.cos(-this.rotation.y);
    var siny = Math.sin(-this.rotation.y);

    var nx = (-siny * (v));
    var nz = (cosy * (v));

    this.position.x += nx;
    this.position.z += nz;
};
camera.prototype.moveLR = function (v) {
    var cosy = Math.cos(-this.rotation.y);
    var siny = Math.sin(-this.rotation.y);

    var nx = (cosy * (v));
    var nz = (siny * (v));

    this.position.x += nx;
    this.position.z += nz;
};

camera.prototype.moveY = function (y) {
    this.position.y += y;
};

function point(x, y, z) {
    this.position = {
        x: x,
        y: y,
        z: z
    };
    this.tempIndex = 0;
};

point.prototype.get2DCoords = function (c) {

    var dx = this.position.x - c.position.x;
    var dy = this.position.y - c.position.y;
    var dz = this.position.z - c.position.z;

    var cosx = Math.cos(c.rotation.x);
    var cosy = Math.cos(c.rotation.y);
    var cosz = Math.cos(c.rotation.z);
    var sinx = Math.sin(c.rotation.x);
    var siny = Math.sin(c.rotation.y);
    var sinz = Math.sin(c.rotation.z);

    var nx = (cosy * (sinz * (dy) + cosz * (dx)) - siny * (dz));
    var ny = (sinx * (cosy * (dz) + siny * (sinz * (dy) + cosz * (dx))) + cosx * (cosz * (dy) - sinz * (dx)));
    var nz = (cosx * (cosy * (dz) + siny * (sinz * (dy) + cosz * (dx))) - sinx * (cosz * (dy) - sinz * (dx)));


    this.tempIndex = nz;
    return {
        x: (((nx) * (c.zoom / nz)) * (screen.height / 2)) + (screen.width / 2),
        y: (((ny) * (c.zoom / nz)) * (screen.height / 2)) + (screen.height / 2),
        distance: nz
    };
};

function line(p1, p2) {
    this.points = new Array;
    this.points[0] = p1;
    this.points[1] = p2;
    this.tempIndex = 0;
};

line.prototype.get2DCoords = function (c, i) {
    var screenCoords = this.points[i].get2DCoords(c);
    this.tempIndex = this.points[i].tempIndex;
    return (screenCoords);
};
line.prototype.render = function (cam, cont) {
    var screenCoords = this.points[0].get2DCoords(cam,0);
    var screenCoords2 = this.points[1].get2DCoords(cam,0);
    cont.beginPath();
    cont.moveTo(screenCoords.x, screenCoords.y);
    cont.lineTo(screenCoords2.x, screenCoords2.y);
    cont.strokeStyle = '#0000FF';
    cont.stroke();
};

screen3D.initialize();