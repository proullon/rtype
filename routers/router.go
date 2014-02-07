package routers

import (
    "github.com/astaxie/beego"
    "r-type/controllers"
)

func init() {
    beego.Router("/", &controllers.MainController{})

    // WebSocket.
    beego.Router("/ws/join", &controllers.WebSocketController{}, "get:Join")
}
