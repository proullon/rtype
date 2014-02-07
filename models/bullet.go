package models

import (
    "time"
)

type Bullet struct {
    Id   int
    PosX int
    PosY int
}

func NewBullet(x int, y int) (bullet *Bullet) {
    bullet = &Bullet{}

    bullet.Id = id
    id++

    bullet.PosX = x
    bullet.PosY = y
    return
}

func (b *Bullet) Live(eventChannel chan Event) {
    ticker := time.NewTicker(time.Millisecond * 50)

    // Warn the world you're alive !
    eventChannel <- CreateEvent(EVENT_NewBullet, b.Id, b.PosX, b.PosY)

    // Then GO RIGHT !
    for {
        select {
        case <-ticker.C:
            // Nobody can see you anymore
            if b.PosX > MAP_SIZE_X {
                return
            }

            b.PosX += 4
            eventChannel <- CreateEvent(EVENT_PlayerMove, b.Id, b.PosX, b.PosY)
            break
        }
    }
}
