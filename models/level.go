package models

import (
    // "github.com/astaxie/beego"
    "math/rand"
    "time"
)

type Level struct {
    Id   int
    Name string
}

func LevelRoutine(eventChannel chan Event, collisionChannel chan Entity) {
    pop := time.NewTicker(time.Millisecond * 1000)

    rand.Seed(time.Now().Unix())

    for {
        select {
        case <-pop.C:
            // Pop a new mob !
            peon := NewPeon(350, rand.Int()%150)
            go peon.Live(eventChannel, collisionChannel)
            break
        }
    }
}
