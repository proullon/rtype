var EVENT = {
    "PLAYER_MOVE"  : 1,
    "PLAYER_JOINED" : 2,
    "PLAYER_ID" : 3,
    "PLAYER_DEAD" : 4,
    "PLAYER_SHOOT" : 5,
    "PLAYER_KEY" : 6,
    "PLAYER_LEAVE" : 7,
    "NEW_BULLET" : 8,
    "NEW_PEON" : 9,
}

var KEY = {
    "UP" : 1,
    "DOWN" : 2,
    "LEFT" : 3,
    "RIGHT" : 4,
    // Diagonales
    "RIGHTUP" : 5,
    "RIGHTDOWN" : 6,
    "LEFTUP" : 7,
    "LEFTDOWN" : 8,
    // Others
    "SPACE" : 9
}

function Room(context) {
    console.log("Room instanciation");

    this.context = context;
    this.entities = new Array();
    this.playerId = -1;

    this.shootTimeout = false;
}

Room.prototype.Connect = function(uname, rname) {
    console.log("Room.prototype.Connect");

    this.uname = uname;
    this.rname = rname;

    room = this;
    // Create a socket
    this.socket = new WebSocket('ws://' + window.location.host + '/ws/join?uname=' + uname + '&room=' + rname);
    this.socket.onmessage = function (event) {
        // console.log("socket.onmessage : " + event)
        room.ParseEvent(event);
    }
    this.socket.onclose = function() {
        console.log("socket.onclose");
    }
}

Room.prototype.ParseEvent = function(event) {
    // console.log("Room.prototype.ParseEvent");

    var data = JSON.parse(event.data);

    switch (data.Type) {
        case EVENT.PLAYER_MOVE:
            this.PlayerMove(data.Id, data.X, data.Y);
            break;
        case EVENT.PLAYER_JOINED:
            console.log("Room.prototype.ParseEvent: Player Joined : ", data);
            this.PlayerJoined(data.Id, data.X, data.Y);
            break;
        case EVENT.PLAYER_DEAD:
            if (data.X > 0)
                console.log("Room.prototype.ParseEvent : PleyerDead : ", data);
            this.PlayerDead(data.Id);
            break;
        case EVENT.PLAYER_ID:
            console.log("Room.prototype.ParseEvent : PlayerID : ", data);
            this.PlayerId(data.Id, data.X, data.Y);
            break;
        case EVENT.PLAYER_LEAVE:
            console.log("Room.prototype.ParseEvent : Player Leaved : ", data);
            this.PlayerLeave(data.Id);
            break;
        case EVENT.NEW_BULLET:
            this.NewBullet(data.Id, data.X, data.Y)
            break;
        case EVENT.NEW_PEON:
            this.NewPeon(data.Id, data.X, data.Y)
            break;
        break;
    }
}

Room.prototype.SendMessage = function(eventType, key) {
    // console.log("Room.prototype.SendMessage");

    var content = "{\"Type\":"+eventType+", \"Id\":"+this.playerId+", \"Key\":"+key+"}";
    this.socket.send(content);
}

Room.prototype.ResetShootTimeout = function() {
    this.shootTimeout = false;
}

Room.prototype.ParseKey = function() {
    // console.log("Room.prototype.ParseKey");

    // Check for space !
    if (IsKeyPressed(32) && this.shootTimeout == false) {
        this.SendMessage(EVENT.PLAYER_SHOOT, KEY.SPACE);
        this.shootTimeout = true;
        setTimeout("room.ResetShootTimeout()", 400);
    }

    var up = false;
    var down = false;
    var left = false;
    var right = false;

    if (IsKeyPressed(38) || IsKeyPressed(122) || IsKeyPressed(119) || IsKeyPressed(90) || IsKeyPressed(87))
        up = true; // Up arrow, z, w, Z, W

    if (IsKeyPressed(40) || IsKeyPressed(115) || IsKeyPressed(83))
        down = true; // Down arrow, s, S

    if (IsKeyPressed(37) || IsKeyPressed(113) || IsKeyPressed(97) || IsKeyPressed(81) || IsKeyPressed(65))
        left = true; // Left arrow, q, a, Q, A

    if (IsKeyPressed(39) || IsKeyPressed(100) || IsKeyPressed(68))
        right = true; // Down arrow, s, S

    if (left && up)
        this.SendMessage(EVENT.PLAYER_KEY, KEY.LEFTUP)
    else if (left && down)
        this.SendMessage(EVENT.PLAYER_KEY, KEY.LEFTDOWN)
    else if (right && up)
        this.SendMessage(EVENT.PLAYER_KEY, KEY.RIGHTUP)
    else if (right && down)
        this.SendMessage(EVENT.PLAYER_KEY, KEY.RIGHTDOWN)
    else if (up)
        this.SendMessage(EVENT.PLAYER_KEY, KEY.UP)
    else if (down)
        this.SendMessage(EVENT.PLAYER_KEY, KEY.DOWN)
    else if (right)
        this.SendMessage(EVENT.PLAYER_KEY, KEY.RIGHT)
    else if (left)
        this.SendMessage(EVENT.PLAYER_KEY, KEY.LEFT)

    // return false;
}

Room.prototype.Draw = function() {
    var i = 0;

    // Clean screen
    var x = 0;
    var y = 0;
    var canvas = document.getElementById('scroller');
    this.context.clearRect(x, y, canvas.width, canvas.height);

    while (i < this.entities.length) {
        if (this.entities[i] != null) {
            this.entities[i].Draw(this.context);
        }
        i++;
    }
}

Room.prototype.PlayerMove = function(playerId, x, y) {
    // console.log("Room.prototype.PlayerMove");

    var i = 0;

    // Search player
    while (i < this.entities.length) {

        // Once player found, update position
        if (this.entities[i] != null && this.entities[i].id == playerId) {
            this.entities[i].Move(x, y);
            return;
        }
        i++;
    }
}

Room.prototype.PlayerJoined = function(playerId, x, y) {
    console.log("Room.prototype.PlayerJoined");

    var entity = new Spaceship(playerId, x, y, DIRECTION.RIGHT);

    // If there is empty slot in array, fill it
    var i = 0;
    while (i < this.entities.length) {
        if (this.entities[i] == null) {
            this.entities[i] = entity
            return
        }
        i++;
    }

    // Set new entity in the end
    this.entities[this.entities.length] = entity
}

Room.prototype.NewBullet = function(id, x, y) {

    var bullet = new Bullet(id, x, y);

    // If there is empty slot in array, fill it
    var i = 0;
    while (i < this.entities.length) {
        if (this.entities[i] == null) {
            this.entities[i] = bullet;
            return
        }
        i++;
    }

    // Set new entity in the end
    this.entities[this.entities.length] = bullet;
}

Room.prototype.NewPeon = function(id, x, y) {

    var peon = new Peon(id, x, y);

    // If there is empty slot in array, fill it
    var i = 0;
    while (i < this.entities.length) {
        if (this.entities[i] == null) {
            this.entities[i] = peon;
            return
        }
        i++;
    }

    // Set new entity in the end
    this.entities[this.entities.length] = peon;
}

Room.prototype.PlayerId = function(playerId, x, y) {
    // if (this.playerId >= 0 && this.playerId <= 4)
    //     return
    console.log("Room.prototype.PlayerId");

    this.playerId = playerId;
    this.entities[this.entities.length] = new Spaceship(playerId, x, y, DIRECTION.RIGHT);
}

Room.prototype.PlayerLeave = function(playerId) {

    var i = 0;

    // Search player
    while (i < this.entities.length) {

        // Once player found, update position
        if (this.entities[i] != null && this.entities[i].id == playerId) {
            this.entities[i] = null;
            return;
        }
        i++;
    }

}

Room.prototype.PlayerDead = function(playerId) {

    var i = 0;

    // Search player
    while (i < this.entities.length) {

        // Once player found, update position
        if (this.entities[i] != null && this.entities[i].id == playerId) {
            this.entities[i] = null;
            return;
        }
        i++;
    }
}