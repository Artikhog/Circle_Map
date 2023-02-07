var circle_stage, square_stage, circle_map, square_map, main_drone_circle;

//todo: 0. Рефакторинг +++
//      1. Ресайз в зависимости от размеров канваса +++
//      2. Разобраться с движением других объектов (нихуя не работает)
//      3. Прикрутить png ???
//      4. Распарсить json
//      5. Запустить сервер на локалке, затестить карту
//      6. Не заебаться парсить json

function init() {
    var circle_map_canvas = document.getElementById('circle_map');
    var square_map_canvas = document.getElementById('square_map');

    circle_stage = new createjs.Stage(document.getElementById('circle_map'));
    square_stage = new createjs.Stage(document.getElementById('square_map'));
    add_ticker(3000);

    main_drone_circle = new Drone(2, 2, 'red');
    circle_map = new Map(main_drone_circle, circle_stage, circle_map_canvas.width / 2, 200);
    circle_map.draw();
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
            .drawCircle(x, y, scale * 0.3);
    }
    born(stage) {
        stage.addChild(this.drone);
    }
}

window.onkeydown = function (e) {
    switch (e.code) {
        case 'KeyW':
            main_drone_circle.y -= 0.1;
            circle_map.draw();
            break;
        case 'KeyS':
            main_drone_circle.y += 0.1;
            circle_map.draw();
            break;
        case 'KeyA':
            main_drone_circle.x -= 0.1;
            circle_map.draw();
            break;
        case 'KeyD':
            main_drone_circle.x += 0.1;
            circle_map.draw();
            break;
        case 'KeyE':
            circle_map.draw();
            circle_map.spin('right');
            break;
        case 'KeyQ':
            circle_map.draw();
            circle_map.spin('left');
            break;


        case 'KeyI':
            circle_map.drone1.drone.regY += 1;
            circle_map.draw();
            break;
        case 'KeyK':
            circle_map.drone1.drone.regY -= 1;
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
    }
    start1 = new Start_Place(9, 9, 'blue');
    start2 = new Start_Place(7, 9, 'blue');
    start3 = new Start_Place(4, 9, 'blue');
    start4 = new Start_Place(2, 9, 'blue');
    start5 = new Start_Place(9, 2, 'red');
    start6 = new Start_Place(7, 2, 'red');
    start7 = new Start_Place(4, 2, 'red');
    start8 = new Start_Place(2, 2, 'red');
    drone1 = new Drone(2, 9, 'blue');
    draw() {
        this.map_container.removeAllChildren();
        this.update();

        var background = new createjs.Shape();
        background.graphics.beginFill("black")
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
        this.add_objects();
        this.stage.addChild(this.map_container);
        this.stage.addChild(this.obj_container);

        this.main_drone.draw(this.scale, this.center, this.center);
        this.main_drone.born(this.stage);
        this.add_mask();
        this.show_info();
    }
    add_objects() {
        this.map_container.removeChild(this.drone1);
        this.start1.draw(this.scale);
        this.start2.draw(this.scale);
        this.start3.draw(this.scale);
        this.start4.draw(this.scale);
        this.start5.draw(this.scale);
        this.start6.draw(this.scale);
        this.start7.draw(this.scale);
        this.start8.draw(this.scale);
        this.drone1.draw(this.scale);
        this.map_container.addChild(this.start1.start);
        this.map_container.addChild(this.start2.start);
        this.map_container.addChild(this.start3.start);
        this.map_container.addChild(this.start4.start);
        this.map_container.addChild(this.start5.start);
        this.map_container.addChild(this.start6.start);
        this.map_container.addChild(this.start7.start);
        this.map_container.addChild(this.start8.start);
        this.map_container.addChild(this.drone1.drone);
    }
    spin(right_left) {
        switch (right_left) {
            case 'right':
                this.angle += 1;
                createjs.Tween.get(this.map_container).to({
                    rotation: this.angle
                }, 200);
                this.stage.addChild(new createjs.Text(`angle:${this.angle}`, "20px Arial", "#ff7700"))
                break;
            case 'left':
                this.angle -= 1;
                createjs.Tween.get(this.map_container).to({
                    rotation: this.angle
                }, 200);
                this.stage.addChild(new createjs.Text(`angle:${this.angle}`, "20px Arial", "#ff7700"))
                break;
        }
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
        this.stage.addChild(mask);}
}

class Start_Place {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.start = new createjs.Shape();
    }
    draw(scale, x = scale * (this.x-0.8), y = scale * (this.y-0.8)) {
        this.start.graphics.beginFill(this.color)
            .drawRect(x, y, scale*1.6, scale*1.6);
        this.start.graphics.beginFill('white')
            .drawCircle(x + 0.8 * scale, y + 0.8 * scale, scale*0.75);
    }
    born(stage) {
        stage.addChild(this.start);
    }
}

function  add_ticker(framerate = 300) {
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate = framerate;
    createjs.Ticker.addEventListener("tick", circle_stage);
    createjs.Ticker.addEventListener("tick", square_stage);
}