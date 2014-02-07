package controllers

import (
    "net/http"

    "github.com/astaxie/beego"
    "github.com/gorilla/websocket"

    "r-type/models"
)

// WebSocketController handles WebSocket requests.
type WebSocketController struct {
    baseController
}

// Join method handles WebSocket requests for WebSocketController.
func (this *WebSocketController) Join() {
    beego.Info("WebSocketControler.Join")

    // Get username and roomname
    uname := this.GetString("uname")
    room := this.GetString("room")
    if len(uname) == 0 || len(room) == 0 {
        this.Redirect("/", 302)
        return
    }

    // Upgrade from http request to WebSocket.
    ws, err := websocket.Upgrade(this.Ctx.ResponseWriter, this.Ctx.Request, nil, 1024, 1024)
    if _, ok := err.(websocket.HandshakeError); ok {
        http.Error(this.Ctx.ResponseWriter, "Not a websocket handshake", 400)
        return
    } else if err != nil {
        beego.Error("Cannot setup WebSocket connection:", err)
        return
    }

    // Create new player
    player := models.NewPlayer(uname)

    // Join room.
    inChannel, outPlayer := models.JoinRoom(room, player)

    go broadcastWebSocket(player.OutChannel, ws)
    go receiveRoutine(inChannel, ws, player, outPlayer)
}

func receiveRoutine(inChannel chan string, ws *websocket.Conn, player *models.Player, outPlayer chan *models.Player) {
    beego.Info("Starting receive routine")

    for {
        _, p, err := ws.ReadMessage()
        if err != nil {
            // Time to quit
            break
        }

        inChannel <- string(p)
    }

    outPlayer <- player
}

// broadcastWebSocket broadcasts messages to WebSocket users.
func broadcastWebSocket(outChannel chan string, ws *websocket.Conn) {

    for {
        select {
        case data := <-outChannel:
            ws.WriteMessage(websocket.TextMessage, []byte(data))
            break
        }
    }
}
