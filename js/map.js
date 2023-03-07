class Map {
    constructor(mdc, mdn, stage, canvas_center, size, meter_size = 11, locus_x = 5.5, locus_y = 5.5) {
        this.main_drone_color = mdc; //цвет команды игрока
        this.main_drone_number = mdn; //номер игрока в массиве
        this.stage = stage; // объект сцены, к ней добавляются все остальные элементы
        this.canvas_center = canvas_center; // центр канваса
        this.size = size; // размер карты в пикселях
        this.meter_size = meter_size; // размер реального полигона в метрах
        this.scale = size / meter_size; // размер 1 клетки карты в пикселях
        this.locus_x = locus_x;  //координаты локуса
        this.locus_y = locus_y;
        this.angle = 0;  // угол поворота карты
        this.map_container = new createjs.Container(); //контейнер для объектов карты (поворачивается вместе с игроком)
        this.map_container.x = canvas_center; // переносим координаты контейнера в центр канваса, чтобы контейнер крутился вокруг этой точки
        this.map_container.y = canvas_center;
        this.red_team = [];
        this.red_team.length = 4;
        this.red_starts = [];
        this.red_starts.length = 4;
        this.blue_team = [];
        this.blue_team.length = 4;
        this.blue_starts = [];
        this.blue_starts.length = 4;
        this.chargers = [];
        this.chargers.length = 2;
        this.factories = [];
        this.factories.length = 4;
        this.add_objects(); //добавляем обьекты в массивы
    }
    draw_all_objects() {
        this.stage.removeAllChildren();
        this.map_container.removeAllChildren();
        this.stage.addChild(this.map_container);
        this.draw_map();
        this.draw_polygon_objects();
        this.draw_players();
        this.update_coordinates();

        this.add_arrow();
    }
    draw_map() {
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
        this.add_mask();
    }
    add_objects() {
        for (let i = 0; i < 4; i++) {
            this.red_starts[i] = new Start_Charger_Place(this.locus_x, this.locus_y, `red_start${1+i}`, this.scale, 0);
            this.blue_starts[i] = new Start_Charger_Place(this.locus_x, this.locus_y, `blue_start${1+i}`, this.scale, 180);
            this.factories[i] = new Factory_Place(this.locus_x, this.locus_y, 'factory', this.scale, 'grey', 0);
        }
        this.chargers[0] = new Start_Charger_Place(this.locus_x, this.locus_y, 'charger', this.scale, 90);
        this.chargers[1] = new Start_Charger_Place(this.locus_x, this.locus_y, 'charger', this.scale, -90);


        this.red_team[0] = new Drone(this.locus_x, this.locus_y, 'red_drone', 'blocked_drone', this.scale);
        this.red_team[1] = new Drone(this.locus_x, this.locus_y, 'red_car', 'blocked_car', this.scale);
        this.red_team[2] = new Drone(this.locus_x, this.locus_y, 'red_car', 'blocked_car', this.scale);
        this.red_team[3] = new Drone(this.locus_x, this.locus_y, 'red_drone', 'blocked_drone', this.scale);

        this.blue_team[0] = new Drone(this.locus_x, this.locus_y, 'blue_drone', 'blocked_drone', this.scale);
        this.blue_team[1] = new Drone(this.locus_x, this.locus_y, 'blue_car', 'blocked_car', this.scale);
        this.blue_team[2] = new Drone(this.locus_x, this.locus_y, 'blue_car', 'blocked_car', this.scale);
        this.blue_team[3] = new Drone(this.locus_x, this.locus_y, 'blue_drone', 'blocked_drone', this.scale);
    }
    draw_polygon_objects() {
        for (let i = 0; i < 4; i++) {
            this.red_starts[i].draw();
            this.blue_starts[i].draw();
            this.factories[i].draw();
            this.chargers[Math.round(i/4)].draw();
            this.map_container.addChild(this.red_starts[i].object_bitmap, this.blue_starts[i].object_bitmap, this.factories[i].place, this.factories[i].object_bitmap, this.chargers[Math.round(i/4)].object_bitmap);
            this.map_container.addChild(this.red_starts[i].cargo_bitmap, this.blue_starts[i].cargo_bitmap);
        }
    }
    draw_players() {
        for (let i = 0; i < 4; i++) {
            this.red_team[i].draw();
            this.blue_team[i].draw();
            this.map_container.addChild(this.red_team[i].object_bitmap, this.blue_team[i].object_bitmap);
            this.map_container.addChild(this.red_team[i].blocked_drone_bitmap, this.blue_team[i].blocked_drone_bitmap);
            this.map_container.addChild(this.red_team[i].cargo_bitmap, this.blue_team[i].cargo_bitmap);
        }
    }
    update_coordinates() {
        switch (this.main_drone_color) {
            case 'red':
                this.angle = - this.red_team[this.main_drone_number].angle
                createjs.Tween.get(this.map_container).to({
                    rotation: this.angle,
                    regX: (this.red_team[this.main_drone_number].map_center_x + this.red_team[this.main_drone_number].x) * this.scale,
                    regY: (this.red_team[this.main_drone_number].map_center_y + this.red_team[this.main_drone_number].y) * this.scale
                }, 200);
                break;
            case 'blue':
                this.angle = - this.blue_team[this.main_drone_number].angle
                createjs.Tween.get(this.map_container).to({
                    rotation: this.angle,
                    regX: (this.blue_team[this.main_drone_number].map_center_x + this.blue_team[this.main_drone_number].x) * this.scale,
                    regY: (this.blue_team[this.main_drone_number].map_center_y + this.blue_team[this.main_drone_number].y) * this.scale
                }, 200);
                break;

        }
    }
    parse_json(data) {
        for (let i = 0; i < 4; i++) {
            this.blue_starts[i].get_data(data.polygon_info[i + 4]);
            this.red_starts[i].get_data(data.polygon_info[i + 10]);
            this.factories[i].get_data(data.polygon_info[i])
        }

        this.chargers[0].get_data(data.polygon_info[8]);
        this.chargers[1].get_data(data.polygon_info[9]);

        const team_value = Object.values(data.team_info)
        let team_red_value = Object.values(team_value[1])
        let team_blue_value = Object.values(team_value[0])
        let red_players = Object.values(team_red_value[2])
        let blue_players = Object.values(team_blue_value[2])

        for (let i = 0; i < 4; i++) {
            this.blue_team[i].get_data(blue_players[i]);
            this.red_team[i].get_data(red_players[i]);
        }
    }
    add_arrow() {
        var arrow = new createjs.Shape();
        arrow.graphics.beginFill('yellow')
            .drawCircle(this.canvas_center, this.canvas_center, 8);

        switch (this.main_drone_color) {
            case 'red':
                var dif_x = this.red_team[this.main_drone_number].x - this.red_starts[this.main_drone_number].x;
                var dif_y = this.red_team[this.main_drone_number].y - this.red_starts[this.main_drone_number].y;
                var angle = Math.atan2(dif_x, dif_y) + this.red_team[this.main_drone_number].angle / 180 * Math.PI;
                break;
            case 'blue':
                var dif_x = this.blue_team[this.main_drone_number].x - this.blue_starts[this.main_drone_number].x;
                var dif_y = this.blue_team[this.main_drone_number].y - this.blue_starts[this.main_drone_number].y;
                var angle = Math.atan2(dif_x, dif_y) + this.blue_team[this.main_drone_number].angle / 180 * Math.PI;
                break;
        }


        // createjs.Tween.get(arrow).to({
        //     regX: this.canvas_center * Math.sin(angle),
        //     regY: this.canvas_center * Math.cos(angle)
        // }, 500);
        arrow.regY = this.canvas_center * Math.cos(angle)
        arrow.regX = this.canvas_center * Math.sin(angle)
        this.stage.addChild(arrow);
    }
    add_mask(color = 'grey') {
        var mask = new createjs.Shape();
        mask.graphics.beginFill(color)
            .moveTo(0 , 0)
            .lineTo(0, this.canvas_center)
            .arc(this.canvas_center, this.canvas_center, this.canvas_center, 3.14, -1.57, false)
            .lineTo(0 , 0)
            .endFill();
        mask.graphics.beginFill(color)
            .moveTo(0, this.canvas_center * 2)
            .lineTo(this.canvas_center, this.canvas_center * 2)
            .arc(this.canvas_center, this.canvas_center, this.canvas_center, 1.57, 3.14, false)
            .endFill();
        mask.graphics.beginFill(color)
            .moveTo(this.canvas_center * 2, this.canvas_center * 2)
            .lineTo(this.canvas_center * 2, this.canvas_center)
            .arc(this.canvas_center, this.canvas_center, this.canvas_center, 0, 1.57, false)
            .endFill();
        mask.graphics.beginFill(color)
            .moveTo(this.canvas_center * 2, 0)
            .lineTo(this.canvas_center, 0)
            .arc(this.canvas_center, this.canvas_center, this.canvas_center, -1.57, 0, false)
            .endFill();
        mask.alpha = 0.5;
        this.stage.addChild(mask);
    }
}


class Map_Object {
    constructor(locus_x, locus_y, type, map_scale, scale_koef) {
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.map_center_x = locus_x;
        this.map_center_y = locus_y;
        this.type = type;

        this.map_scale = map_scale;
        this.scale_koef = scale_koef;
        this.object_bitmap = get_scaled_bitmap(type, map_scale, scale_koef);

    }
    draw() {
        createjs.Tween.get(this.object_bitmap).to({
            x: (this.map_center_x + this.x) * this.map_scale,
            y: (this.map_center_y + this.y) * this.map_scale,
            rotation: this.angle
        }, 200);
        // this.object_bitmap.x = (this.map_center_x + this.x) * this.map_scale;
        // this.object_bitmap.y = (this.map_center_y + this.y) * this.map_scale;
        // this.object_bitmap.rotation = this.angle;
    }
}


class Drone extends Map_Object {
    constructor(locus_x, locus_y, type, blocked_type, map_scale, scale_koef = 0.7) {
        super(locus_x, locus_y, type, map_scale, scale_koef);
        this.is_blocking = false;
        this.is_cargo = false;
        this.is_connected = false;
        this.is_shooting = false;

        this.blocked_drone_bitmap = get_scaled_bitmap(blocked_type, map_scale, scale_koef, 0);
        this.cargo_bitmap = get_scaled_bitmap('box', map_scale, scale_koef, 1000, 0.25, 0.25);
        this.cargo_bitmap_height = document.getElementById('box').naturalHeight;
    }
    draw() {
        if (this.is_blocking) {this.blocked_drone_bitmap.alpha = 1000;}
        else {this.blocked_drone_bitmap.alpha = 0;}
        if (this.is_cargo) {createjs.Tween.get(this.cargo_bitmap).to({
            scaleX: this.map_scale * this.scale_koef * 0.75 / this.cargo_bitmap_height,
            scaleY: this.map_scale * this.scale_koef * 0.75 / this.cargo_bitmap_height,
        }, 200);}
        else {createjs.Tween.get(this.cargo_bitmap).to({
            scaleX: 0,
            scaleY: 0,
        }, 200);}

        createjs.Tween.get(this.object_bitmap).to({
            x: (this.map_center_x + this.x) * this.map_scale,
            y: (this.map_center_y + this.y) * this.map_scale,
            rotation: this.angle
        }, 200);
        createjs.Tween.get(this.blocked_drone_bitmap).to({
            x: (this.map_center_x + this.x) * this.map_scale,
            y: (this.map_center_y + this.y) * this.map_scale,
            rotation: this.angle
        }, 200);
        createjs.Tween.get(this.cargo_bitmap).to({
            x: (this.map_center_x + this.x) * this.map_scale,
            y: (this.map_center_y + this.y) * this.map_scale,
            rotation: this.angle
        }, 200);
    }
    get_data(player_data) {
        super.x = player_data.current_pos[1];
        super.y = player_data.current_pos[0];
        super.angle = player_data.current_pos[3] / Math.PI * 180 + 90;

        this.is_blocking = player_data.is_blocking;
        this.is_cargo = player_data.is_cargo;
        this.is_shooting = player_data.is_shooting;
        this.is_connected = player_data.is_connected;
    }

}

class Start_Charger_Place extends Map_Object{
    constructor(locus_x, locus_y, type, map_scale, angle = 0, scale_koef = 0.8,) {
        super(locus_x, locus_y, type, map_scale, scale_koef);
        super.angle = angle;
    }
    get_data(place_data) {
        this.x = place_data.current_pos[1];
        this.y = place_data.current_pos[0];
    }
}

class Factory_Place extends Map_Object{
    constructor(locus_x, locus_y, type, map_scale, color = 'grey', angle = 0, scale_koef = 1, place_koef = 1.2) {
        super(locus_x, locus_y, type, map_scale, scale_koef);
        super.angle = angle;
        this.place_koef = place_koef;
        this.place = new createjs.Shape();
        this.is_cargo = false;
        this.color = color;
        this.place.x = (this.map_center_x + this.x) * this.map_scale;
        this.place.y = (this.map_center_y + this.y) * this.map_scale;

        this.cargo_bitmap = get_scaled_bitmap('box', map_scale, scale_koef);
        this.cargo_bitmap_height = document.getElementById('box').naturalHeight;

    }
    draw() {
        this.place.graphics.beginFill(this.color)
            .drawRect(0, 0, this.map_scale * this.scale_koef * this.place_koef, this.map_scale * this.scale_koef * this.place_koef);
        this.place.regX = this.place.regY = this.map_scale * this.scale_koef * this.place_koef * 0.5;
        createjs.Tween.get(this.object_bitmap).to({
            x: (this.map_center_x + this.x) * this.map_scale,
            y: (this.map_center_y + this.y) * this.map_scale,
            rotation: this.angle
        }, 200);
        createjs.Tween.get(this.place).to({
            x: (this.map_center_x + this.x) * this.map_scale,
            y: (this.map_center_y + this.y) * this.map_scale,
            rotation: this.angle
        }, 200);
        createjs.Tween.get(this.cargo_bitmap).to({
            x: (this.map_center_x + this.x) * this.map_scale,
            y: (this.map_center_y + this.y) * this.map_scale,
            rotation: this.angle
        }, 200);
    }
    get_data(place_data) {
        this.x = place_data.current_pos[1];
        this.y = place_data.current_pos[0];

        this.is_cargo = place_data.role_data.is_cargo;
        if (place_data.role_data.current_cargo_color[0] > 0) {
            this.color = 'blue';
            // this.cargo_bitmap = get_scaled_bitmap('blue_box', this.map_scale, this.scale_koef);
            // this.cargo_bitmap_height = document.getElementById('blue_box').naturalHeight;
        }
        else if (place_data.role_data.current_cargo_color[1] > 0) {
            this.color = 'green';
            // this.cargo_bitmap = get_scaled_bitmap('green_box', this.map_scale, this.scale_koef);
            // this.cargo_bitmap_height = document.getElementById('green_box').naturalHeight;
        }
        else if (place_data.role_data.current_cargo_color[2] > 0) {
            this.color = 'red';
            // this.cargo_bitmap = get_scaled_bitmap('red_box', this.map_scale, this.scale_koef);
            // this.cargo_bitmap_height = document.getElementById('red_box').naturalHeight;
        }
    }
}

function get_scaled_bitmap(type, map_scale, scale_koef, alpha = 1000, regX_scale = 1, regY_scale = 1) {
    var bitmap = new createjs.Bitmap(document.getElementById(type));
    var natural_height = document.getElementById(type).naturalHeight;
    var natural_width = document.getElementById(type).naturalWidth;

    bitmap.regX = natural_width / 2 * regX_scale;
    bitmap.regY = natural_height / 2 * regY_scale;
    bitmap.scaleX = map_scale * scale_koef / natural_width;
    bitmap.scaleY = map_scale * scale_koef / natural_height;
    bitmap.alpha = alpha;
    return bitmap;
}

function add_ticker(framerate = 3000, stage) {
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate = framerate;
    createjs.Ticker.addEventListener("tick", stage);
}


function add_keyboard(map) {
    var main_drone;
    switch (map.main_drone_color) {
        case 'blue':
            main_drone = map.blue_team[map.main_drone_number];
            break;
        case 'red':
            main_drone = map.red_team[map.main_drone_number];
            break;
    }
    window.onkeydown = function (e) {
        switch (e.code) {
            case 'KeyW':
                main_drone.y -= 0.3 * Math.cos(main_drone.angle / 180 * Math.PI);
                main_drone.x += 0.3 * Math.sin(main_drone.angle / 180 * Math.PI);
                map.draw_all_objects();
                break;
            case 'KeyS':
                main_drone.y += 0.1;
                map.draw_all_objects();
                break;
            case 'KeyA':
                main_drone.x -= 0.1;
                map.draw_all_objects();
                break;
            case 'KeyD':
                main_drone.x += 0.1;
                map.draw_all_objects();
                break;
            case 'KeyQ':
                main_drone.angle -= 5;
                map.draw_all_objects();
                break;
            case 'KeyE':
                main_drone.angle += 5;
                map.draw_all_objects();
                break;
            case 'KeyT':
                main_drone.is_blocking = true;
                map.draw_all_objects();
                break;
            case 'KeyY':
                main_drone.is_blocking = false;
                map.draw_all_objects();
                break;
            case 'KeyG':
                main_drone.is_cargo = true;
                map.draw_all_objects();
                break;
            case 'KeyH':
                main_drone.is_cargo = false;
                map.draw_all_objects();
                break;
        }
    }}

