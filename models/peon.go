package models

import (
    // "github.com/astaxie/beego"
    "time"
)

type Peon struct {
    baseEntity
}

func NewPeon(x int, y int) (peon *Peon) {
    p := Peon{}

    p.id = id
    id++

    p.x = x
    p.y = y

    p.stop = make(chan bool)
    return &p
}

func (p *Peon) Live(eventChannel chan Event, collisionChannel chan Entity) {
    ticker := time.NewTicker(time.Millisecond * 50)

    // Warn the world you're alive !
    eventChannel <- CreateEvent(EVENT_NewPeon, p.id, p.x, p.y)

    // Then GO LEFT !
    for {
        select {
        case _ = <-p.stop:
            eventChannel <- CreateEvent(EVENT_PlayerDead, p.id, p.x, p.y)
            return
            break
        case <-ticker.C:
            // Make your move
            p.x -= 2

            // Check if there is no collision
            // beego.Info("Peon checking for collision")
            collisionChannel <- p
            // beego.Info("Peon check done ")

            // Send event to the world
            eventChannel <- CreateEvent(EVENT_PlayerMove, p.id, p.x, p.y)
            break
        }
    }
}
