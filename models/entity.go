package models

import (
    "github.com/astaxie/beego"
)

type Entity interface {
    Id() int
    Live(eventChannel chan Event, collisionChannel chan Entity)
    Kill()
    PosX() int
    PosY() int
}

type baseEntity struct {
    id   int
    x    int
    y    int
    stop chan bool
}

func (b *baseEntity) Id() int {
    return b.id
}

func (b *baseEntity) PosX() int {
    return b.x
}

func (b *baseEntity) PosY() int {
    return b.y
}

func (b *baseEntity) Kill() {

    if b.x > 0 {
        beego.Info("baseEntity.Kill id=", b.id)
    }

    b.stop <- true

    if b.x > 0 {
        beego.Info("baseEntity.Kill id=", b.id, "DONE")
    }
}
