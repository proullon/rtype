var image;

function LoadBulletSprite() {
    image = new Image();

    image.onload = function() {
        if (!this.complete)
            throw "Erreur de chargement du sprite bullet";
        console.log("bullet.Sprite loaded")
    }

    image.src = "/static/img/bullet.png";
}

function Bullet(id, x, y, direction) {
    this.id = id;
    this.x = x; // (en cases)
    this.y = y; // (en cases)
    
    // Chargement de l'image dans l'attribut image
    this.image = image;
    this.Width = image.width / 8;
    this.Height = image.height / 8;
}

Bullet.prototype.Draw = function(context) {

    var sx = this.Width * 7; // The x coordinate where to start clipping
    var sy = this.Height * 3; // The y coordinate where to start clipping
    var swidth = this.Width; // The width of the clipped image
    var sheight = this.Height; // The height of the clipped image
    var x = (this.x)// - (this.Width / 2); // The x coordinate where to place the image on the canvas
    var y = (this.y)// - this.Height; // The y coordinate where to place the image on the canvas
    var width = this.Width; // The width of the image to use (stretch or reduce the image)
    var height = this.Height; // The height of the image to use (stretch or reduce the image)
    context.drawImage(this.image, sx, sy, swidth, sheight, x, y, width, height);
}

Bullet.prototype.Move = function(x, y) {
    this.x = x;
    this.y = y;
}
