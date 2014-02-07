package models

type Entity interface {
    Live(entityChan chan Event)
}
