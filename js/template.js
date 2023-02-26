function start() {
    var canvas = document.getElementById('map');
    var stage = new createjs.Stage(canvas);
    add_ticker(6000, stage);
    var map = new Map('red', 3, stage, canvas.width / 2, 550);

    map.draw_all();
    add_keyboard(map);
    getUserInfo(map);
    map.draw_all();
    // setInterval(function () {
    //     getUserInfo(map);
    //     map.draw_objects();
    // }, 1000);
}

//10.10.0.162:31222/user?user=all
//http://127.0.0.1:5555/?target=get&type_command=player&command=visualization&param=0
function getUserInfo(map) {
    var userDataUrl = "http://127.0.0.1:5555/?target=get&type_command=player&command=visualization&param=0";
    fetch(userDataUrl).then(response =>
        response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(res => {
            map.parse_json(res.data);

        }).catch(function (e) {
            console.log(e)
        }));
}

// function getUserInfo(map) {
//     var userDataUrl = "http://127.0.0.1:5555/?target=get&type_command=player&command=visualization&param=0";
//     fetch(userDataUrl).then(response =>
//         response.json().then(data => ({
//                 data: data,
//                 status: response.status
//             })
//         ).then(res => {
//             for (let i = 0; i < 3; i++) {
//                 map.drones[i].drone.x = res.data.team_info.Blue.players[i].current_pos[0] * map.scale;
//                 map.drones[i].drone.y = res.data.team_info.Blue.players[i].current_pos[1] * map.scale;
//                 map.drones[i+4].drone.x = res.data.team_info.Red.players[i+4].current_pos[0] * map.scale;
//                 map.drones[i+4].drone.y = res.data.team_info.Red.players[i+4].current_pos[1] * map.scale;
//             }
//             map.drones[3].drone.x = res.data.team_info.Blue.players[3].current_pos[0] * map.scale;
//             map.drones[3].drone.y = res.data.team_info.Blue.players[3].current_pos[1] * map.scale;
//             map.main_drone.x = res.data.team_info.Red.players[7].current_pos[0] + 5.5;
//             map.main_drone.y = res.data.team_info.Red.players[7].current_pos[1] + 5.5;
//             map.map_container.updateCache();
//             map.angle = res.data.team_info.Red.players[7].current_pos[3] * 180;
//             // console.log()
//         }).catch(function (e) {
//             console.log(e)
//         }));
// }
//
// function getMapInfo(map) {
//     var userDataUrl = "http://127.0.0.1:5555/?target=get&type_command=player&command=visualization&param=0";
//     fetch(userDataUrl).then(response =>
//         response.json().then(data => ({
//                 data: data,
//                 status: response.status
//             })
//         ).then(res => {
//             for (let i = 0; i < 4; i++) {
//                 map.starts[i].start.y = res.data.polygon_info[i+4].current_pos[0] * map.scale;
//                 map.starts[i].start.x = res.data.polygon_info[i+4].current_pos[1] * map.scale;
//                 map.starts[i+4].start.y = res.data.polygon_info[i+10].current_pos[0] * map.scale;
//                 map.starts[i+4].start.x = res.data.polygon_info[i+10].current_pos[1] * map.scale;
//                 console.log(map.starts[i].x, map.starts[i].y, map.starts[i+4].x, map.starts[i+4].y);
//             }
//             map.map_container.updateCache()
//
//         }).catch(function (e) {
//             console.log(e)
//         }));
// }
