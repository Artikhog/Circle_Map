class Map {
    constructor(main_drone_color, main_drone_number, stage, center, size, locus_x = 5.5, locus_y = 5.5, meter_size = 11, angle = 0) {
        this.main_drone_color = main_drone_color;
        this.main_drone_number = main_drone_number;
        this.stage = stage;
        this.center = center;
        this.size = size;
        this.meter_size = meter_size;
        this.scale = size / meter_size;
        this.locus_x = locus_x;
        this.locus_y = locus_y;
        this.angle = angle;
        this.map_container = new createjs.Container();
        this.map_container.x = center;
        this.map_container.y = center;
        this.stage.addChild(this.map_container);
        this.blue_starts = [];
        this.blue_starts.length = 4;
        this.red_starts = [];
        this.red_starts.length = 4;
        this.blue_drones = []
        this.blue_drones.length = 4;
        this.red_drones = []
        this.red_drones.length = 4;
        this.chargers = []
        this.chargers.length = 2;
        this.factories = [];
        this.factories.length = 4;
        this.add_objects();
    }
    draw_all() {
        this.map_container.removeAllChildren();
        this.draw_map();
        this.draw_polygon_objects();
        this.update();
        this.rotate();
        this.draw_drones();
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
    draw_polygon_objects() {
        this.chargers[0].draw();
        this.chargers[1].draw();
        this.map_container.addChild(this.chargers[0].place, this.chargers[0].bitmap);
        this.map_container.addChild(this.chargers[1].place, this.chargers[1].bitmap);

        for (let i = 0; i < 4; i++) {
            this.factories[i].draw();
            this.blue_starts[i].draw();
            this.red_starts[i].draw();
            this.map_container.addChild(this.factories[i].place, this.factories[i].bitmap);
            this.map_container.addChild(this.blue_starts[i].place, this.blue_starts[i].bitmap);
            this.map_container.addChild(this.red_starts[i].place, this.red_starts[i].bitmap);
        }
    }
    draw_drones() {
        for (let i = 0; i < 4; i++) {
            this.blue_drones[i].draw();
            this.red_drones[i].draw();
            this.map_container.addChild(this.blue_drones[i].drone);
            this.map_container.addChild(this.red_drones[i].drone);
        }
    }
    add_objects() {
        for (let i = 0; i < 4; i++) {
            this.blue_drones[i] = new Drone(this.locus_x, this.locus_y, 'blue', this.scale);
            this.red_drones[i] = new Drone(this.locus_x, this.locus_y, 'red', this.scale);
            this.blue_starts[i] = new Place(this.locus_x, this.locus_y, 'blue', this.scale, 'start');
            this.red_starts[i] = new Place(this.locus_x, this.locus_y, 'red', this.scale, 'start');
            this.factories[i] = new Place(this.locus_x, this.locus_y, 'grey', this.scale, 'factory', 1.6);
        }
        this.chargers[0] = new Place(this.locus_x, this.locus_y,'green', this.scale, 'charger', 0.6);
        this.chargers[1] = new Place(this.locus_x, this.locus_y, 'green', this.scale, 'charger', 0.6);
    }
    parse_json(data) {

        for (let i = 0; i < 4; i++) {
            this.factories[i].update(data.polygon_info[i]);
            this.blue_starts[i].update(data.polygon_info[i + 4]);
            this.red_starts[i].update(data.polygon_info[i + 10]);
        }
        this.chargers[0].update(data.polygon_info[8]);
        this.chargers[1].update(data.polygon_info[9]);

        const team_value = Object.values(data.team_info)
        let team_red_value = Object.values(team_value[0])
        let team_blue_value = Object.values(team_value[1])
        let red_players = Object.values(team_red_value[2])
        let blue_players = Object.values(team_blue_value[2])

        for (let i = 0; i < 4; i++) {
            this.blue_drones[i].update(blue_players[i]);
            this.red_drones[i].update(red_players[i]);
        }
    }
    rotate() {
        createjs.Tween.get(this.map_container).to({
            rotation: this.angle
        }, 300);
    }
    update() {
        switch (this.main_drone_color) {
            case 'blue':
                this.map_container.regX = this.blue_drones[this.main_drone_number].map_center_x + this.blue_drones[this.main_drone_number].drone.x;
                this.map_container.regY = this.blue_drones[this.main_drone_number].map_center_y + this.blue_drones[this.main_drone_number].drone.y;
                this.angle = this.blue_drones[this.main_drone_number].drone.angle;
            case 'red':
                this.map_container.regX = this.red_drones[this.main_drone_number].map_center_x + this.red_drones[this.main_drone_number].drone.x;
                this.map_container.regY = this.red_drones[this.main_drone_number].map_center_y + this.red_drones[this.main_drone_number].drone.y;
                this.angle = this.red_drones[this.main_drone_number].angle;
        }
    }
    add_mask(color = 'grey') {
        var mask = new createjs.Shape();
        mask.graphics.beginFill(color)
            .moveTo(0 , 0)
            .lineTo(0, this.center)
            .arc(this.center, this.center, this.center, 3.14, -1.57, false)
            .lineTo(0 , 0)
            .endFill();
        mask.graphics.beginFill(color)
            .moveTo(0, this.center * 2)
            .lineTo(this.center, this.center * 2)
            .arc(this.center, this.center, this.center, 1.57, 3.14, false)
            .endFill();
        mask.graphics.beginFill(color)
            .moveTo(this.center * 2, this.center * 2)
            .lineTo(this.center * 2, this.center)
            .arc(this.center, this.center, this.center, 0, 1.57, false)
            .endFill();
        mask.graphics.beginFill(color)
            .moveTo(this.center * 2, 0)
            .lineTo(this.center, 0)
            .arc(this.center, this.center, this.center, -1.57, 0, false)
            .endFill();
        mask.alpha = 0.5;
        this.stage.addChild(mask);
    }
}
class Drone {
    constructor(locus_x, locus_y, color, scale, scale_koeff = 0.2) {
        this.x = locus_y * scale;
        this.y = locus_x * scale;
        this.map_center_x = locus_x * scale;
        this.map_center_y = locus_y * scale;
        this.color = color;
        this.map_scale = scale;
        this.scale_koeff = scale_koeff;
        this.drone = new createjs.Shape();
        this.is_bloking = false;
        this.is_cargo = false;
        this.is_connected = false;
        this.is_shooting = false;
    }
    draw() {
        this.drone.graphics.beginFill(this.color)
            .drawCircle(this.map_center_x, this.map_center_y, this.map_scale * this.scale_koeff);
    }
    animation() {
        createjs.Tween.get(this.drone).to({
            x:  this.x * this.map_scale,
            y:  this.y * this.map_scale,
        }, 600);
    }
    update(player_data) {
        this.drone.y = player_data.current_pos[0] * this.map_scale;
        this.drone.x = player_data.current_pos[1] * this.map_scale;
        this.y = player_data.current_pos[0];
        this.x = player_data.current_pos[1];

        this.drone.angle = player_data.current_pos[3] * 180 / 3.14;
        console.log(this.drone.angle)
        this.is_bloking = player_data.is_bloking;
        this.is_cargo = player_data.is_cargo;
        this.is_shooting = player_data.is_shooting;
        this.is_connected = player_data.is_connected;
    }

}

class Place{
    constructor(locus_x, locus_y, color, scale, path, scale_koeff = 0.8) {
        this.map_center_x = locus_x * scale;
        this.map_center_y = locus_y * scale;
        this.color = color;
        this.map_scale = scale;
        this.scale_koeff = scale_koeff;
        this.place = new createjs.Shape();
        this.bitmap = new createjs.Bitmap(document.getElementById(path));
        this.is_cargo = false;
    }
    draw() {
        this.place.graphics.beginFill(this.color)
            .drawRect(this.map_center_x, this.map_center_y, this.map_scale * this.scale_koeff, this.map_scale * this.scale_koeff);
        this.bitmap.x = this.map_center_x + this.place.x + this.map_scale * this.scale_koeff * 0.1;
        this.bitmap.y = this.map_center_y + this.place.y + this.map_scale * this.scale_koeff * 0.1;
        this.bitmap.scaleX = this.bitmap.scaleY = this.map_scale * this.scale_koeff * 0.8 / 176;
    }
    update(place_data) {
        this.place.y = place_data.current_pos[0] * this.map_scale;
        this.place.x = place_data.current_pos[1] * this.map_scale;
        if (place_data.name_role == "Fabric_RolePolygon") {
            this.is_cargo = place_data.role_data.is_cargo;
            if (this.is_cargo) {
                if (place_data.role_data.current_cargo_color[0] > 0) {
                    this.color = 'blue';
                }
                else if (place_data.role_data.current_cargo_color[1] > 0) {
                    this.color = 'green';
                }
                else if (place_data.role_data.current_cargo_color[2] > 0) {
                    this.color = 'red';
                }
            } else {
                this.color = 'grey';
            }
        }
    }
}

function add_ticker(framerate = 3000, stage) {
    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.framerate = framerate;
    createjs.Ticker.addEventListener("tick", stage);
}

function add_keyboard(map) {
    switch (map.main_drone_color) {
        case 'blue':
            main_drone = map.blue_drones[map.main_drone_number];
        case 'red':
            main_drone = map.red_drones[map.main_drone_number];
    }
    window.onkeydown = function (e) {
        switch (e.code) {
            case 'KeyW':
                main_drone.y -= 1;
                main_drone.animation();
                map.draw_all();
                break;
            case 'KeyS':
                main_drone.drone.y += 0.1 * map.scale;
                map.draw_all();
                break;
            case 'KeyA':
                main_drone.x -= 1;
                main_drone.animation();
                map.draw_all();
                break;
            case 'KeyD':
                main_drone.drone.x += 0.1 * map.scale;
                map.draw_all();
                break;
        }
    }}
