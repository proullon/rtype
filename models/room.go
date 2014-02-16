package models

import (
    "github.com/astaxie/beego"
)

var id int = 0

type Room struct {
    Name       string
    Map        Map
    players    []*Player
    collisionM *Collision

    InChannel  chan string
    OutChannel chan string
    InPlayer   chan *Player
    OutPlayer  chan *Player
    EntityChan chan Event
}

var rooms map[string]Room = make(map[string]Room)

func JoinRoom(roomName string, player *Player) (inChannel chan string, outPlayer chan *Player) {
    beego.Info("Room.Join:", player.Name, "is joining", roomName)

    room, exist := rooms[roomName]
    if exist == false {
        room = CreateRoom(roomName)
    }

    if room.Full() == true {
        return nil, nil
    }

    room.AddPlayer(player)
    return room.InChannel, room.OutPlayer
}

func CreateRoom(roomName string) (room Room) {
    beego.Info("Creating room", roomName)
    room = Room{}
    room.Name = roomName
    room.players = make([]*Player, 4)

    room.InChannel = make(chan string)
    room.OutChannel = make(chan string)
    room.InPlayer = make(chan *Player)
    room.OutPlayer = make(chan *Player)
    room.EntityChan = make(chan Event)

    rooms[roomName] = room
    go room.roomRoutine()
    return
}

func (room *Room) AddPlayer(player *Player) {

    player.Id = id
    id++

    // Join the room
    room.InPlayer <- player
    return
}

func (room *Room) RemovePlayer(player *Player) {

    // Join the room
    for i := range room.players {
        if room.players[i] != nil && player.Id == room.players[i].Id {
            room.players[i] = nil
        }
    }
}

func (room *Room) Full() (full bool) {
    if room.NbPlayers() == 4 {
        return true
    }

    return false
}

func (room *Room) NbPlayers() (nbPlayers int) {

    for i := range room.players {
        if room.players[i] != nil {
            nbPlayers++
        }
    }

    return
}

func (room *Room) FindPlayer(id int) (player *Player) {

    for i := range room.players {
        if room.players[i] != nil && room.players[i].Id == id {
            return room.players[i]
        }
    }

    return nil
}

func (room *Room) processEvent(e Event) {

    switch {
    case e.Type == EVENT_PlayerKey:
        p := room.FindPlayer(e.Id)
        toDispatch := p.Move(e.Key)
        go room.dispatchEvent(toDispatch.Json())
        break
    case e.Type == EVENT_PlayerShoot:
        p := room.FindPlayer(e.Id)
        b := NewBullet(p.PosX, p.PosY)
        go b.Live(room.EntityChan, room.collisionM.Test)
        break
    }

}

func (room *Room) dispatchEvent(data string) {

    for i := range room.players {
        if room.players[i] != nil {
            room.players[i].OutChannel <- data
        }
    }
}

func (room *Room) roomRoutine() {

    // Get a collision manager
    beego.Info("Starting collision manager")
    room.collisionM = NewCollisionCenter()
    go room.collisionM.CollisionRoutine()

    // Start level
    beego.Info("Starting level routine")
    go LevelRoutine(room.EntityChan, room.collisionM.Test)

    for {
        select {
        // Process data coming from clients
        case data := <-room.InChannel:
            if event, err := NewEvent(data); err == nil {
                go room.processEvent(event)
            }
            break
        // case data := <-room.OutChannel:
        //     go room.dispatchEvent(data)
        //     break
        // Handle player leaving the room
        case player := <-room.OutPlayer:
            beego.Info(player.Name, "left the room")

            // Remove player from room list
            room.RemovePlayer(player)

            // Dispatch event
            event := CreateEvent(EVENT_PlayerLeave, player.Id, 0, 0)
            room.dispatchEvent(event.Json())
            break
        // Handle new player in the room
        case player := <-room.InPlayer:

            // Send information to other player
            event := CreateEvent(EVENT_PlayerJoined, player.Id, 0, 0)
            room.dispatchEvent(event.Json())

            // Send information to new player
            event = CreateEvent(EVENT_PlayerId, player.Id, 0, 0)
            go player.Send(event)

            // Send information about other player to new player
            for i := range room.players {
                if room.players[i] != nil {
                    event = CreateEvent(EVENT_PlayerJoined, room.players[i].Id, room.players[i].PosX, room.players[i].PosY)
                    go player.Send(event)
                }
            }

            // Add player in the room
            room.players = append(room.players, player)

            beego.Info("Room", room.Name, "has now", room.NbPlayers(), "players")
            break
        // Dispatch all events comming from entities (bullet, mob, walls)
        case event := <-room.EntityChan:
            room.dispatchEvent(event.Json())
            break
        }
    }
}
