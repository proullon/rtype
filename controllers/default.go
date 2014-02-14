package controllers

import (
    "github.com/astaxie/beego"
)

type MainController struct {
    beego.Controller
}

func (this *MainController) Get() {
    // this.Layout = "layout.tpl"
    this.TplNames = "index.tpl"
}
