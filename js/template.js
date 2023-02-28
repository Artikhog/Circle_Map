function start() {
    var canvas = document.getElementById('map');
    var stage = new createjs.Stage(canvas);
    add_ticker(6000, stage);
    var map = new Map('red', 0, stage, canvas.width / 2, 550*1.3);

    map.draw_all();
    add_keyboard(map);
    getUserInfo(map);
    map.draw_all();
    // setInterval(function () {
    //     getUserInfo(map);
    //     map.draw_all();
    // }, 200);
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

