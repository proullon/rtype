package controllers

import (
    "github.com/astaxie/beego"
)

type PlayController struct {
    baseController
}

type Form struct {
    Room string `form:"room"`
    Name string `form:"name"`
}

func (this *PlayController) Get() {
    this.TplNames = "play.tpl"
}

func (this *PlayController) Post() {
    this.TplNames = "play.tpl"

    form := Form{}
    if err := this.ParseForm(&form); err != nil {
        this.Ctx.WriteString("Shit")
        return
    }

    // Get room name
    beego.Info("Room name is", form.Room)

    // Get player name
    beego.Info("Player name is", form.Name)

    // Redirect
    this.Redirect("/game?room="+form.Room+"&uname="+form.Name, 301)
}
