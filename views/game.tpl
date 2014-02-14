<!DOCTYPE html>

<html>
    <head>
        <title>R-Type</title>
        <link rel="stylesheet" type="text/css" href="/static/css/game.css" />

        <script type="text/javascript" src="static/js/third/jquery-1.10.1.min.js"></script>
        <script type="text/javascript" src="static/js/third/json2.js"></script>
        <script type="text/javascript" src="static/js/third/oXHR.js"></script>

        <script type="text/javascript" src="static/js/keyboard.js"></script>
        <script type="text/javascript" src="static/js/bullet.js"></script>
        <script type="text/javascript" src="static/js/spaceship.js"></script>
        <script type="text/javascript" src="static/js/room.js"></script>
        <script type="text/javascript" src="static/js/background.js"></script>
        <script type="text/javascript" src="static/js/client.js"></script>
    </head>
    
    <body>
        <h1>R-Type</h1>
        <p>Use WSAD or arrows keys to mode, and space to shoot !</p>
        <canvas id="scroller" onload="StartMove()"></canvas>
    </body>
</html>
