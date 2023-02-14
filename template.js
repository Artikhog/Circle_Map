function start() {
    var circle_map_canvas = document.getElementById('circle_map');
    var circle_stage = new createjs.Stage(document.getElementById('circle_map'));
    add_ticker(6000, circle_stage);
    var main_drone_circle = new Drone(2, 9, 'red');
    var circle_map = new Map(main_drone_circle, circle_stage, circle_map_canvas.width / 2, 700);
    circle_map.draw_all();
    add_keyboard(main_drone_circle, circle_map);
    getMapInfo(circle_map)
    setInterval(function () {
        getUserInfo(circle_map);
        circle_map.draw_all();

    }, 100);
}
//10.10.0.162:31222/user?user=all
//http://127.0.0.1:5555/?target=get&type_command=player&command=visualization&param=0
function getUserInfo(map) {
    var userDataUrl = "http://10.10.0.162:31222/user?user=all";
    fetch(userDataUrl).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            for (let i = 0; i < 3; i++) {
                map.drones[i].drone.x = res.data.team_info.Blue.players[i].current_pos[0] * map.scale;
                map.drones[i].drone.y = res.data.team_info.Blue.players[i].current_pos[1] * map.scale;
                map.drones[i+4].drone.x = res.data.team_info.Red.players[i+4].current_pos[0] * map.scale;
                map.drones[i+4].drone.y = res.data.team_info.Red.players[i+4].current_pos[1] * map.scale;
            }
            map.drones[3].drone.x = res.data.team_info.Blue.players[3].current_pos[0] * map.scale;
            map.drones[3].drone.y = res.data.team_info.Blue.players[3].current_pos[1] * map.scale;
            map.main_drone.x = res.data.team_info.Red.players[7].current_pos[0] + 5.5;
            map.main_drone.y = res.data.team_info.Red.players[7].current_pos[1] + 5.5;
            map.map_container.updateCache();
            map.angle = res.data.team_info.Red.players[7].current_pos[3] * 180;
            // console.log()
        }).catch(function (e) {
            console.log(e)
        }));
}

function getMapInfo(map) {
    var userDataUrl = "http://10.10.0.162:31222/user?user=all";
    fetch(userDataUrl).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            for (let i = 0; i < 4; i++) {
                map.starts[i].start.y = res.data.polygon_info[i+4].current_pos[0] * map.scale;
                map.starts[i].start.x = res.data.polygon_info[i+4].current_pos[1] * map.scale;
                map.starts[i+4].start.y = res.data.polygon_info[i+10].current_pos[0] * map.scale;
                map.starts[i+4].start.x = res.data.polygon_info[i+10].current_pos[1] * map.scale;
                console.log(map.starts[i].x, map.starts[i].y, map.starts[i+4].x, map.starts[i+4].y);
            }
            map.map_container.updateCache()

        }).catch(function (e) {
            console.log(e)
        }));
}