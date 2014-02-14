package controllers

import (
// "github.com/astaxie/beego"
)

type GameController struct {
    baseController
}

func (this *GameController) Get() {
    this.Layout = "layout.tpl"
    this.TplNames = "game.tpl"
}
