var state = true;
var counter = 0;

var pressed = [1024];

function IsKeyPressed(key) {
    if (pressed[key] == 1)
        return true;
    return false;
}

function Down(e) {
    cxc = e.keyCode;
    pressed[cxc] = 1;
    if (cxc == 27) {
        state = false;
    } //escape
}

function Up(e) {
    cxc = e.keyCode;
    pressed[cxc] = 0;
}

document.onkeydown = function(event) {
    Down(event);
    return false;
};
document.onkeyup = function(event) {
    Up(event);
};


// //------------------------
// var Loop = function() {
//     var s = "";
//     if (state) {
//         for (var j = 37; j < 41; j++) {
//             s = s + " " + parseInt(pressed[j], 10);
//         }
//         // document.getElementById('counter').innerHTML = parseInt(counter);
//         document.getElementById('keys').innerHTML = s;
//         counter = counter + 1;

//         gLoop = setTimeout(Loop, 1000 / 50);
//     }
// };

// Loop();
