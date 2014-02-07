/**
** Script moving the background sky
**/
function StartMove() {
    var cssBGImage = new Image();
    cssBGImage.onload = function() {
        console.log("background.Loading night sky");
        if(!this.complete) 
            throw "Erreur de chargement du sprite nommé \"" + url + "\".";

        window.cssMaxWidth = cssBGImage.width;
        console.log("background.cssMaxWidth = ", window.cssMaxWidth)

        setInterval("MoveBackGround()",40);
    }
    
    cssBGImage.src="/static/img/night-sky.jpg";
    window.cssXPos = 0;

}

function MoveBackGround () {
    window.cssXPos = window.cssXPos-1;
    if (window.cssXPos <= 0) {
        window.cssXPos= window.cssMaxWidth;
    }

    toMove=document.getElementById("scroller");
    while (toMove == null)
        toMove=document.getElementById("scroller");

    toMove.style.backgroundPosition=window.cssXPos+"px 0px";
}

