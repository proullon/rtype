package models

import (
    "github.com/astaxie/beego"
    "math"
)

type Collision struct {
    Entities map[int]Entity
    Test     chan Entity
}

func NewCollisionCenter() (collision *Collision) {
    c := Collision{}

    c.Entities = make(map[int]Entity)
    c.Test = make(chan Entity)
    return &c
}

func hasCollision(rhs Entity, lhs Entity) (yup bool) {

    if math.Abs(float64(rhs.PosX()-lhs.PosX())) > 5 {
        return false
    }

    if math.Abs(float64(rhs.PosY()-lhs.PosY())) > 5 {
        return false
    }

    return true
}

func (c *Collision) checkCollision(e Entity) (yup bool) {

    // Nobody can see you anymore
    if e.PosX() < -100 || e.PosX() > MAP_SIZE_X {
        go e.Kill()
        delete(c.Entities, e.Id())
        return true
    }

    // Check entity with all entities available
    for i := range c.Entities {
        if e.Id() == c.Entities[i].Id() {
            continue
        }

        if hasCollision(e, c.Entities[i]) == true {
            beego.Info("Killing", e.Id(), "[x=", e.PosX(), ",y=", e.PosY(), "] and", c.Entities[i].Id(), "[x=", c.Entities[i].PosX(), ",y=", c.Entities[i].PosY(), "]")
            go e.Kill()
            go c.Entities[i].Kill()
            delete(c.Entities, c.Entities[i].Id())
            delete(c.Entities, e.Id())
            return true
        }
    }

    return false
}

func (c *Collision) CollisionRoutine() {
    beego.Info("Starting collision routine")

    for {
        select {
        case test := <-c.Test:

            // When a new entity comes by, test if it's collision, if not, add it to the list
            if c.checkCollision(test) == false {
                c.Entities[test.Id()] = test
            }
            break
        }
    }
}
