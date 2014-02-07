package models

import (
    "encoding/json"
    "fmt"
    "github.com/astaxie/beego"
)

const (
    _                  = iota
    EVENT_PlayerMove   = 1
    EVENT_PlayerJoined = 2
    EVENT_PlayerId     = 3
    EVENT_PlayerDead   = 4
    EVENT_PlayerShoot  = 5
    EVENT_PlayerKey    = 6
    EVENT_PlayerLeave  = 7
    EVENT_NewBullet    = 8
)

const (
    _             = iota
    KEY_Up        = 1
    KEY_Down      = 2
    KEY_Left      = 3
    KEY_Right     = 4
    KEY_RightUp   = 5
    KEY_RightDown = 6
    KEY_LeftUp    = 7
    KEY_LeftDown  = 8
    KEY_Space     = 9
)

type Event struct {
    Type int
    Id   int
    X    int
    Y    int
    Key  int
}

func CreateEvent(event int, id int, posX int, posY int) (e Event) {
    e.Type = event
    e.Id = id
    e.X = posX
    e.Y = posY
    return
}

func NewEvent(jsonData string) (e Event, err error) {

    err = json.Unmarshal([]byte(jsonData), &e)

    if err != nil {
        beego.Error("Cannot unmarshal received data:", jsonData)
    }
    return
}

func (event *Event) Json() (jsonEvent string) {

    b, err := json.Marshal(event)
    if err != nil {
        beego.Error("Cannot marshal event")
        return
    }

    return string(b)
}

func (event Event) String() string {
    return fmt.Sprintf("Event of type %d about player %d", event.Type, event.Id)
}
