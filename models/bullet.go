package models

import (
    // "github.com/astaxie/beego"
    "time"
)

type Bullet struct {
    baseEntity
}

func NewBullet(x int, y int) (bullet *Bullet) {
    bullet = &Bullet{}

    bullet.id = id
    id++

    bullet.x = x
    bullet.y = y

    bullet.stop = make(chan bool)
    return
}

func (b *Bullet) Live(eventChannel chan Event, collisionChannel chan Entity) {
    ticker := time.NewTicker(time.Millisecond * 50)

    // Warn the world you're alive !
    eventChannel <- CreateEvent(EVENT_NewBullet, b.id, b.x, b.y)

    // Then GO RIGHT !
    for {
        select {
        // When kill function is called
        case _ = <-b.stop:
            eventChannel <- CreateEvent(EVENT_PlayerDead, b.id, b.x, b.y)
            return
            break
        // Each 50ms
        case <-ticker.C:
            // Make your move
            b.x += 4

            // Check if there is no collision
            // beego.Info("Bullet checking for collision")
            collisionChannel <- b
            // beego.Info("Bullet check done")

            // Tell the world
            eventChannel <- CreateEvent(EVENT_PlayerMove, b.id, b.x, b.y)
            break
        }
    }
}
