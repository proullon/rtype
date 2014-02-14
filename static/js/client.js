var ctx;
var room;

function extractUrlParams () {
    var t = location.search.substring(1).split('&');
    var f = [];
    for (var i=0; i<t.length; i++) {
        var x = t[i].split('=');
        f[x[0]]=x[1];
    }
    return f;
}

window.onload = function() {
    console.log("background.Start moving background");
    StartMove();

    // Get url params
    params = extractUrlParams()

    // Get canvas element and instantiate room
    var canvas = document.getElementById('scroller');
    ctx = canvas.getContext('2d');
    room = new Room(ctx);

    // Load sprites
    LoadBulletSprite();

    // Connect to server
    room.Connect(params["uname"], params["room"]);

    // Set interval to refresh screen
    setInterval("room.Draw()", 100);

    // Activate keyboard listening
    setInterval("room.ParseKey()", 30);
}
