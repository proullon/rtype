var DIRECTION = {
    "DOWN" : 0,
    "LEFT" : 1,
    "RIGHT": 2,
    "UP"   : 3
}

var ANIMATION_DELAY = 4;
var MOVEMENT_DELAY = 15;

function Spaceship(id, x, y, direction) {
    this.id = id;
    this.x = x; // (en cases)
    this.y = y; // (en cases)
    this.direction = direction;
    this.animationState = -1;
    
    // Chargement de l'image dans l'attribut image
    this.image = new Image();
    this.image.spaceshipRef = this;
    this.image.onload = function() {
        if(!this.complete) 
            throw "Erreur de chargement du sprite";
        
        // Taille du personnage
        this.spaceshipRef.Width = this.width / 3;
        this.spaceshipRef.Height = this.height / 3;
        console.log("spacehip.Sprite loaded")
    }
    this.image.src = "/static/img/spaceship.png";
}

Spaceship.prototype.Draw = function(context) {
    var frame = 0; // Numéro de l'image à prendre pour l'animation
    var decalageX = 0, decalageY = 0; // Décalage à appliquer à la position du personnage
    if(this.ani >= MOVEMENT_DELAY) {
        // Si le déplacement a atteint ou dépassé le temps nécéssaire pour s'effectuer, on le termine
        this.animationState = -1;
    } else if(this.animationState >= 0) {
        // On calcule l'image (frame) de l'animation à afficher
        frame = Math.floor(this.animationState / ANIMATION_DELAY);
        if(frame > 3) {
            frame %= 4;
        }
        
        // Nombre de pixels restant à parcourir entre les deux cases
        var pixelsAParcourir = 32 - (32 * (this.animationState / ANIMATION_DELAY));
        
        // À partir de ce nombre, on définit le décalage en x et y.
        if(this.direction == DIRECTION.UP) {
            decalageY = pixelsAParcourir;
        } else if(this.direction == DIRECTION.DOWN) {
            decalageY = -pixelsAParcourir;
        } else if(this.direction == DIRECTION.LEFT) {
            decalageX = pixelsAParcourir;
        } else if(this.direction == DIRECTION.RIGHT) {
            decalageX = -pixelsAParcourir;
        }
        
        // On incrémente d'une frame
        this.animationState++;
    }
    /*
     * Si aucune des deux conditions n'est vraie, c'est qu'on est immobile, 
     * donc il nous suffit de garder les valeurs 0 pour les variables 
     * frame, decalageX et decalageY
     */
    

     var sx = this.Width * frame; // The x coordinate where to start clipping
     var sy = this.direction * this.Height; // The y coordinate where to start clipping
     var swidth = this.Width; // The width of the clipped image
     var sheight = this.Height; // The height of the clipped image
     var x = (this.x)// - (this.Width / 2) + 16 + decalageX; // The x coordinate where to place the image on the canvas
     var y = (this.y)// - this.Height + 24 + decalageY; // The y coordinate where to place the image on the canvas
     var width = this.Width; // The width of the image to use (stretch or reduce the image)
     var height = this.Height; // The height of the image to use (stretch or reduce the image)
    context.drawImage(this.image, sx, sy, swidth, sheight, x, y, width, height);
    // context.drawImage(
    //     this.image,
    //     this.Width * frame, this.direction * this.Height, // Point d'origine du rectangle source à prendre dans notre image
    //     this.Width, this.Height, // Taille du rectangle source (c'est la taille du personnage)
    //     // Point de destination (dépend de la taille du personnage)
    //     (this.x * 32) - (this.Width / 2) + 16 + decalageX, (this.y * 32) - this.Height + 24 + decalageY,
    //     this.Width, this.Height // Taille du rectangle destination (c'est la taille du personnage)
    // );
}

Spaceship.prototype.getCoordonneesAdjacentes = function(direction) {
    var coord = {'x' : this.x, 'y' : this.y};
    switch(direction) {
        case DIRECTION.DOWN : 
            coord.y++;
            break;
        case DIRECTION.LEFT : 
            coord.x--;
            break;
        case DIRECTION.RIGHT : 
            coord.x++;
            break;
        case DIRECTION.UP : 
            coord.y--;
            break;
    }
    return coord;
}

Spaceship.prototype.Move = function(x, y) {
    this.x = x;
    this.y = y;
}

Spaceship.prototype.deplacer = function(direction, map) {
    // On ne peut pas se déplacer si un mouvement est déjà en cours !
    if(this.animationState >= 0) {
        return false;
    }

    // On change la direction du personnage
    this.direction = direction;
        
    // On vérifie que la case demandée est bien située dans la carte
    var prochaineCase = this.getCoordonneesAdjacentes(direction);
    if(prochaineCase.x < 0 || prochaineCase.y < 0 || prochaineCase.x >= map.getLargeur() || prochaineCase.y >= map.getHauteur()) {
        // On retourne un booléen indiquant que le déplacement ne s'est pas fait, 
        // Ça ne coute pas cher et ca peut toujours servir
        return false;
    }
    
    // On commence l'animation
    this.animationState = 1;
        
    // On effectue le déplacement
    this.x = prochaineCase.x;
    this.y = prochaineCase.y;
        
    return true;
}
