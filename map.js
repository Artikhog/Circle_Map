function init_map() {
    var canvas = document.getElementById('map');
    var stage = new createjs.Stage(canvas);
    add_ticker(6000, stage);

    var map = new Map(4, stage, canvas.width / 2, 700);
    map.draw_all();

    add_keyboard(map.drones[map.main_drone_number], map);
}

class Map {
    constructor(main_drone_number, stage, center, size, angle = 0, meter_size = 11) {
        this.main_drone_number = main_drone_number;
        this.stage = stage;
        this.center = center;
        this.size = size;
        this.meter_size = meter_size;
        this.scale = size / meter_size;
        this.angle = angle;
        this.map_container = new createjs.Container();
        this.map_container.x = center;
        this.map_container.y = center;
        this.starts = [];
        this.starts.length = 8;
        this.drones = []
        this.drones.length = 8;
        this.chargers = []
        this.chargers.length = 2;
        this.factories = [];
        this.factories.length = 4;
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
        background.graphics.beginFill("black")
            .drawRect(0, 0, this.size, this.size);
        this.map_container.addChild(background);

        for (let i = 1; i < this.meter_size; i++) {
            var line = new createjs.Shape();
            line.graphics.beginStroke("white");
            line.graphics.moveTo(this.scale * i, 0);
            line.graphics.lineTo(this.scale * i, this.size);
            line.graphics.moveTo(0, this.scale * i);
            line.graphics.lineTo(this.size, this.scale * i);
            this.map_container.addChild(line);
        }
        this.stage.addChild(this.map_container);
        this.add_mask();
    }
    add_objects() {
        for (let i = 0; i < 4; i++) {
            this.drones[i] = new Drone(5.5, 5.5, 'blue');
            this.drones[i+4] = new Drone(5.5, 5.5, 'red');
            this.starts[i] = new Place(5.5, 5.5, 'blue', 'start');
            this.starts[i+4] = new Place(5.5, 5.5, 'red', 'start');
            this.factories[i] = new Place(5.5, 5.5, 'grey', 'factory', 1.6);
        }
        this.chargers[0] = new Place(5.5, 5.5,'green', 'charger', 0.6);
        this.chargers[1] = new Place(5.5, 5.5, 'green', 'charger', 0.6);
    }
    draw_objects() {
        this.chargers[0].draw(this.scale);
        this.chargers[1].draw(this.scale);
        this.map_container.addChild(this.chargers[0].place, this.chargers[0].bitmap);
        this.map_container.addChild(this.chargers[1].place, this.chargers[1].bitmap);

        for (let i = 0; i < 8; i++) {
            this.starts[i].draw(this.scale);
            this.drones[i].draw(this.scale);
            this.map_container.addChild(this.starts[i].place, this.starts[i].bitmap);
            this.map_container.addChild(this.drones[i].drone);
        }
        for (let i = 0; i < 4; i++) {
            this.factories[i].draw(this.scale);
            this.map_container.addChild(this.factories[i].place, this.factories[i].bitmap);
        }
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
        }, 100);
        this.stage.addChild(new createjs.Text(`angle:${this.angle}`, "20px Arial", "#ff7700"))
    }
    update() {
        this.map_container.regX = this.drones[this.main_drone_number].x * this.scale + this.drones[this.main_drone_number].drone.x;
        this.map_container.regY = this.drones[this.main_drone_number].y * this.scale + this.drones[this.main_drone_number].drone.y;
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
class Drone {
    constructor(x, y, color, scale_koef = 0.2) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.scale_koeff = scale_koef;
        this.drone = new createjs.Shape();
    }
    draw(scale, x = scale * this.x, y = scale * this.y) {
        this.drone.graphics.beginFill(this.color)
            .drawCircle(x, y, scale * this.scale_koeff);
    }
}

class Place{
    constructor(x, y, color, path, scale_koef = 0.8) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.scale_koef = scale_koef;
        this.place = new createjs.Shape();
        this.bitmap = new createjs.Bitmap(document.getElementById(path));
    }
    draw(scale, x = scale * (this.x-this.scale_koef/2), y = scale * (this.y-this.scale_koef/2)) {
        this.place.graphics.beginFill(this.color)
            .drawRect(x, y, scale * this.scale_koef, scale * this.scale_koef);
        this.bitmap.x = this.x * scale + this.place.x - scale * this.scale_koef * 0.4;
        this.bitmap.y = this.y * scale + this.place.y - scale * this.scale_koef * 0.4;
        this.bitmap.scaleX = this.bitmap.scaleY = scale * this.scale_koef * 0.8 / 176;
    }
}

function add_ticker(framerate = 3000, stage) {
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate = framerate;
    createjs.Ticker.addEventListener("tick", stage);
}

function add_keyboard(main_drone_circle, map) {
    window.onkeydown = function (e) {
        switch (e.code) {
            case 'KeyW':
                main_drone_circle.drone.y -= 0.1 * map.scale;
                map.draw_all();
                break;
            case 'KeyS':
                main_drone_circle.drone.y += 0.1 * map.scale;
                map.draw_all();
                break;
            case 'KeyA':
                main_drone_circle.drone.x -= 0.1 * map.scale;
                map.draw_all();
                break;
            case 'KeyD':
                main_drone_circle.drone.x += 0.1 * map.scale;
                map.draw_all();
                break;
            case 'KeyE':
                map.draw_all();
                map.spin('right');
                break;
            case 'KeyQ':
                map.draw_all();
                map.spin('left');
                break;
        }
    }}
