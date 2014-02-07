package models

import ()

type Player struct {
    Id         int
    Name       string
    PosX       int
    PosY       int
    OutChannel chan string
}

func NewPlayer(name string) (player *Player) {
    player = &Player{}

    player.Name = name
    player.OutChannel = make(chan string)
    return
}

func (player *Player) Send(e Event) {
    player.OutChannel <- e.Json()
}

func (player *Player) Move(key int) (e Event) {

    switch {
    case key == KEY_Down:
        player.PosY += 2
        break
    case key == KEY_Up:
        player.PosY -= 2
        break
    case key == KEY_Left:
        player.PosX -= 2
        break
    case key == KEY_Right:
        player.PosX += 2
        break
    case key == KEY_RightUp:
        player.PosX += 2
        player.PosY -= 2
        break
    case key == KEY_RightDown:
        player.PosX += 2
        player.PosY += 2
        break
    case key == KEY_LeftUp:
        player.PosX -= 2
        player.PosY -= 2
        break
    case key == KEY_LeftDown:
        player.PosX -= 2
        player.PosY += 2
        break
    }

    return CreateEvent(EVENT_PlayerMove, player.Id, player.PosX, player.PosY)
}
