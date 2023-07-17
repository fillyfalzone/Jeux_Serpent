// fct° pour charger un élément à l'ouverture de la page
window.onload = function()
{
    // pour utiliser les variables dans toute les fct° on va les déclarer ici 
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var delay = 100;
    var ctx;
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth / blockSize;
    var heightInBlocks = canvasHeight / blockSize;
    var score;
    var timeOut;
    var highScore;


    //appel de la fct° init()
    init();
    // créattion de la fct° d'initialisation 
    function init(){
        // Création du canvas 
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;  //parametre du canvas
        canvas.height = canvasHeight;
        canvas.style.border = "20px solid gray"; 
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas); //Déssiner le canvas dans le body
        //création du contexte dans le canvas
        ctx = canvas.getContext('2d'); //le contexte sera en 2 dimensions
        snakee = new Snake([[6,4],[5,4],[4,4]],"right"); //corps du serpent et sa direction
        applee = new Apple([10,10]); // la pomme
        score = 0; 
        highScore = score;
        //appel de la fct° refresh
        refreshCanvas();
    }
  
    // on va mettre du mouvement avec la fct° refresh
    function refreshCanvas(){   
        snakee.advance(); //fct° pour avancer le snake
             if(snakee.checkCollision()){
                gameOver();
            }
            else{
            if(snakee.isEatingApple(applee)){
                score++;
                while(score > highScore){
                    highScore = score;
                }
                snakee.ateApple = true;
                do{
                    applee.setNewposition();
                }
                while(applee.isOnSnake(snakee));
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight) // effacer le rectangle apres chaque mouvement.
            drawScore();
            snakee.draw();
            applee.draw();
            timeOut = setTimeout(refreshCanvas, delay); //fct° qui appel le refresh pour le delay donné
            }
               
    }
    //Création de la fonction Game Over
    function gameOver(){
        ctx.save();
        var centreX = canvasWidth / 2;
        var centerY = canvasHeight / 2;

        ctx.font = "bold 100px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidht = 5;

        ctx.fillText("Game Over", centreX, centerY - 100);
        ctx.strokeText("Game Over", centreX, centerY - 100);

        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche espace pour Rejouer",centreX, centerY - 50);
        ctx.fillText("Appuyer sur la touche espace pour Rejouer",centreX, centerY - 50);
        ctx.restore();
    }

    // Créer la fct° restart
    function restart(){
        snakee = new Snake([[6,4],[5,4],[4,4]],"right");
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeOut);
        refreshCanvas();
    }
    //Afficher le Score.
    function drawScore(){
        ctx.save();
        ctx.font = "bold 30px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle"
        var centreX = canvasWidth / 2;
        var centerY = canvasHeight / 2;

        ctx.fillText("High Score : " + highScore, canvasWidth - 170, 15)
        ctx.fillText('Score: ' + score.toString(), centreX, centerY);
        ctx.restore();
    }


        
    //on va creer le corps du serpent
    function drawBlock(ctx, position){
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);
    }
    
    function Snake(body, direction){
        this.body = body;  //le corps
        this.direction = direction; //la direction 
        this.ateApple = false; // le serpent à manger une pomme

        this.draw = function() //fct° qui va dessiner le snake
        {
           ctx.save(); //save le contenu precedent du canvas
           ctx.fillStyle = "#f00";
           for(var i = 0; i < this.body.length; i++ )
           {
                drawBlock(ctx, this.body[i]);
           }
           ctx.restore(); //remettre le ctx à sont état après dessin
        };
        this.advance = function(){
            var nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -=1;
                    break;
                case "right":
                    nextPosition[0] +=1;
                    break;
                case "down":
                    nextPosition[1] +=1;
                    break;
                case "up":
                    nextPosition[1] -=1;
                    break;
                default: 
                    throw("Invalid direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple){
                this.body.pop();
            }
            else{
                this.ateApple = false;
            }
           
        };

        this.setDirection = function(newDirection){
            //transferer les direction défini, dans la fct° plus bas
            var allowedDirections;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":                    
                case "up":
                    allowedDirections = ["left","right"];
                   break;
                default: 
                    throw("Invalid direction");
            }
            if(allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };

        // Si le snake fait une collision avec le reste du corp ou un mur 
        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;
            var maxY = heightInBlocks -1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            };

            for(var i = 0; i < rest.length ; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                   snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision;
        };
        // methode pour savoir si la pomme a été manger
        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
            {
                return true;
            }
            else
            {
                return false;
            };
        }

    }
    
    //Création de la pomme verte
    function Apple(position){
        this.position = position;
        this.draw = function(){
                ctx.save();
                ctx.fillStyle = "#33cc33";
                ctx.beginPath();
                var raduis = blockSize / 2;
                var x = this.position[0] * blockSize + raduis;
                var y = this.position[1] * blockSize + raduis;
                ctx.arc(x, y, raduis, 0, Math.PI*2, true);
                ctx.fill();
                ctx.restore();
            };
            //Donner un nevelle position aléatoire à la pomme
            this.setNewposition = function(){
                var newX = Math.round(Math.random() * (widthInBlocks - 1));
                var newY = Math.round(Math.random() * (heightInBlocks - 1));
                this.position = [newX, newY];
            };
            //Verifier si la pomme n'apparait pas sur le serpent
            this.isOnSnake = function(snakeToCheck){
                var isOnSnake = false;

                for(var i = 0; i < snakeToCheck.body.length; i++){
                    if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1])
                    {
                        isOnSnake = true;
                    }
                }
                return isOnSnake;
            };

    }

    // fct° pour modifier un élément lors de la pression d(une touche)
    document.onkeydown = function handleKeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }

}