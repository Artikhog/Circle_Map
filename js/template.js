function start() {
    var canvas = document.getElementById('map');
    var stage = new createjs.Stage(canvas);
    add_ticker(60, stage);
    var map = new Map('blue', 1, stage, canvas.width/2, 550);
    add_keyboard(map);
    map.draw_all_objects();
    add_keyboard(map);
    getUserInfo(map);
    map.draw_all_objects();
    // setInterval(function () {
    //     map.red_team[0].x += 0.5;
    //     map.draw_all_objects();
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

