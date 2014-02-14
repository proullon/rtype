package routers

import (
    "github.com/astaxie/beego"
    "r-type/controllers"
)

func init() {
    beego.Router("/", &controllers.MainController{})
    beego.Router("/play", &controllers.PlayController{})
    beego.Router("/game", &controllers.GameController{})

    // WebSocket.
    beego.Router("/ws/join", &controllers.WebSocketController{}, "get:Join")
}
