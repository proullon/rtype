var ctx;
var room;

window.onload = function() {
    console.log("background.Start moving background");
    StartMove();

    // Get canvas element and instantiate room
    var canvas = document.getElementById('scroller');
    ctx = canvas.getContext('2d');
    room = new Room(ctx);

    // Load sprites
    LoadBulletSprite();

    // Connect to server
    room.Connect("Chouchou", "toto");

    // Set interval to refresh screen
    setInterval("room.Draw()", 100);

    // Activate keyboard listening
    setInterval("room.ParseKey()", 30);
}
