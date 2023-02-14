function init() {
    var circle_map_canvas = document.getElementById('circle_map');

    var circle_stage = new createjs.Stage(document.getElementById('circle_map'));
    add_ticker(6000, circle_stage);
    // var loader = load_Image();

    var main_drone_circle = new Drone(2, 2, 'red');
    var circle_map = new Map(main_drone_circle, circle_stage, circle_map_canvas.width / 2, 300);
    circle_map.draw_all();
    add_keyboard(main_drone_circle, circle_map);
}

class Drone {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.drone = new createjs.Shape();
    }
    draw(scale, x = scale * this.x, y = scale * this.y) {
        this.drone.graphics.beginFill(this.color)
            .drawCircle(x, y, scale * 0.2);
    }
    born(stage) {
        stage.addChild(this.drone);
    }
}
function add_keyboard(main_drone_circle, circle_map) {
    window.onkeydown = function (e) {
        switch (e.code) {
            case 'KeyW':
                main_drone_circle.y -= 0.1;
                circle_map.draw_all();
                break;
            case 'KeyS':
                main_drone_circle.y += 0.1;
                circle_map.draw_all();
                break;
            case 'KeyA':
                main_drone_circle.x -= 0.1;
                circle_map.draw_all();
                break;
            case 'KeyD':
                main_drone_circle.x += 0.1;
                circle_map.draw_all();
                break;
            case 'KeyE':
                circle_map.draw_all();
                circle_map.spin('right');
                break;
            case 'KeyQ':
                circle_map.draw_all();
                circle_map.spin('left');
                break;


            case 'KeyI':
                circle_map.drone1.drone.y += 1;
                circle_map.draw();
                break;
            case 'KeyK':
                circle_map.drone1.drone.y -= 1;
                circle_map.draw();
                break;
            case 'KeyJ':
                circle_map.drone1.drone.regX += 1;
                circle_map.draw();
                break;
            case 'KeyL':
                circle_map.drone1.drone.regX -= 1;
                circle_map.draw();
                break;
        }
    }
}

class Map {
    constructor(main_drone, stage, center, size, angle = 0, meter_size = 11) {
        this.main_drone = main_drone;
        this.stage = stage;
        this.center = center;
        this.size = size;
        this.meter_size = meter_size;
        this.scale = size / meter_size;
        this.angle = angle;
        this.map_container = new createjs.Container();
        this.map_container.x = center;
        this.map_container.y = center;
        this.map_container.regX = main_drone.x * this.scale;
        this.map_container.regY = main_drone.y * this.scale;
        this.starts = [new Start_Place(5.5, 5.5, 'red')];
        this.starts.length = 8;
        this.drones = [new Drone(5.5,5.5, 'red')]
        this.drones.length = 8;
        this.add_objects();
    }
    draw_all() {
        this.draw_map();
        this.draw_objects();
    }
    draw_map() {
        this.stage.removeAllChildren();
        this.map_container.removeAllChildren();
        this.update();
        this.rotate();
        var background = new createjs.Shape();
        background.graphics.beginFill("green")
            .drawRect(0, 0, this.size, this.size);
        this.map_container.addChild(background);

        for (let i = 1; i < this.meter_size; i++) {
            var line = new createjs.Shape();
            line.graphics.beginStroke("white");
            line.graphics.moveTo(this.scale*i, 0);
            line.graphics.lineTo(this.scale*i, this.size);
            line.graphics.moveTo(0, this.scale*i);
            line.graphics.lineTo(this.size, this.scale*i);
            this.map_container.addChild(line);
        }
        this.map_container.cache(0, 0, 3000, 3000);
        this.stage.addChild(this.map_container);
        this.add_mask();
        this.show_info();
    }
    add_objects() {
        for (let i = 0; i < 4; i++) {
            this.drones[i] = new Drone(5.5, 5.5, 'blue');
            this.drones[i+4] = new Drone(5.5, 5.5, 'red');
        }
        for (let i = 0; i < 4; i++) {
            this.starts[i] = new Start_Place(5.5, 5.5, 'blue');
            this.starts[i+4] = new Start_Place(5.5, 5.5, 'red');
        }
    }
    draw_objects() {
        for (let i = 0; i < 8; i++) {
            this.starts[i].draw(this.scale);
            this.map_container.addChild(this.starts[i].start);
        }
        for (let i = 0; i < 7; i++) {
            this.drones[i].draw(this.scale);
            this.map_container.addChild(this.drones[i].drone);
        }

        this.map_container.updateCache();
        this.main_drone.draw(this.scale, this.center, this.center);
        this.stage.addChild(this.main_drone.drone);

    }
    spin(right_left) {
        switch (right_left) {
            case 'right':
                this.angle += 2;
                createjs.Tween.get(this.map_container).to({
                    rotation: this.angle
                }, 200);
                this.stage.addChild(new createjs.Text(`angle:${this.angle}`, "20px Arial", "#ff7700"))
                break;
            case 'left':
                this.angle -= 2;
                createjs.Tween.get(this.map_container).to({
                    rotation: this.angle
                }, 200);
                this.stage.addChild(new createjs.Text(`angle:${this.angle}`, "20px Arial", "#ff7700"))
                break;
        }
    }
    rotate() {
        createjs.Tween.get(this.map_container).to({
            rotation: this.angle
        }, 1000);
        this.stage.addChild(new createjs.Text(`angle:${this.angle}`, "20px Arial", "#ff7700"))

    }
    update() {
        this.map_container.regX = this.main_drone.x * this.scale;
        this.map_container.regY = this.main_drone.y * this.scale;
    }
    show_info() {
        var x_info = new createjs.Text(`x:${Math.round(this.main_drone.x*10)/10}`, "20px Arial", "#ff7700");
        var y_info = new createjs.Text(`y:${Math.round(this.main_drone.y*10)/10}`, "20px Arial", "#ff7700");
        x_info.x = 2;
        y_info.x = 2;
        x_info.y = 15;
        y_info.y = 35;
        this.stage.addChild(x_info);
        this.stage.addChild(y_info);
    }
    add_mask() {
        var mask = new createjs.Shape();
        mask.graphics.beginFill('grey')
            .moveTo(0 , 0)
            .lineTo(0, this.center)
            .arc(this.center, this.center, this.center, 3.14, -1.57, false)
            .lineTo(0 , 0)
            .endFill();
        mask.graphics.beginFill('grey')
            .moveTo(0, this.center * 2)
            .lineTo(this.center, this.center * 2)
            .arc(this.center, this.center, this.center, 1.57, 3.14, false)
            .endFill();
        mask.graphics.beginFill('grey')
            .moveTo(this.center * 2, this.center * 2)
            .lineTo(this.center * 2, this.center)
            .arc(this.center, this.center, this.center, 0, 1.57, false)
            .endFill();
        mask.graphics.beginFill('grey')
            .moveTo(this.center * 2, 0)
            .lineTo(this.center, 0)
            .arc(this.center, this.center, this.center, -1.57, 0, false)
            .endFill();
        mask.cache(0, 0, 300, 300);
        this.stage.addChild(mask);
    }
}

class Start_Place {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.start = new createjs.Shape();
    }
    draw(scale, x = scale * (this.x-0.4), y = scale * (this.y-0.4)) {
        this.start.graphics.beginFill(this.color)
            .drawRect(x, y, scale*0.8, scale*0.8);
        this.start.graphics.beginFill('white')
            .drawCircle(x + 0.4 * scale, y + 0.4 * scale, scale*0.3);
    }
    born(stage) {
        stage.addChild(this.start);
    }
}

function  add_ticker(framerate = 3000, stage) {
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate = framerate;
    createjs.Ticker.addEventListener("tick", stage);
}

// function load_Image() {
//     let manifest = [{
//         src: "start.png", id: "start"}, {
//         src: "factory.png", id: "factory"}, {
//         src: "charger.png", id: "charger"
//     }]
//
//     let loader = new createjs.LoadQueue(false);
//     loader.addEventListener("complete", handleComplete);
//     loader.loadManifest(manifest, true);
//     return loader
// }