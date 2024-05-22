
//Editar
let objetivo = 50;
let TextoPuntaje = "Tóxicas Eliminadas: ";
let TextoVictoria = "¡VICTORIA!";
let TextoDerrota = "GAME OVER";
//
    
//Youtube: https://www.youtube.com/watch?v=Oat0bMq5NGc

const heart = document.getElementById("heart-icon");
const arrowLeft = document.getElementById("arrow-left");
const arrowRight = document.getElementById("arrow-right");
const toxicasEliminadas = document.getElementById("toxicas-eliminadas");
const textScore = document.getElementById("text-score");
const title = document.getElementById("title");
const objt = document.getElementById("objetivo");
const menu = document.querySelector(".menu");
const btnPlay = document.getElementById("btn-play");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const background = new Image();
background.src = '/background.jpg';
let backgroundOnload = false;
background.onload = ()=>{
    backgroundOnload = true;
};

let play = true;
let death = false;
let score = 0;
objt.textContent = objetivo;
textScore.textContent = TextoPuntaje;

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

function resize(){
    if(innerWidth<600){
      
        canvas.width = 400;
        canvas.height = 480;
        if(innerWidth<400){
            canvas.width = 300;
            canvas.height = 400;
        }
    }else{
        canvas.width = 550;
        canvas.height = 600;

    }
}
window.addEventListener("resize",()=>{
    resize();
});

class Projectile{
    constructor(position){
        this.velocity = 4;
        this.scale = 0.2; 
        this.position = position;
        const image = new Image();
        image.src = '/heart.png';
        image.onload = ()=>{
             this.image = image;
             this.width = image.width*this.scale;
             this.height = image.height*this.scale;
        } 
    }
    draw(){
        ctx.drawImage(this.image,this.position.x,this.position.y,
            this.width,this.height);
    }
    update(){
        if(this.image){
            this.draw();
            this.position.y -= this.velocity;
        }
    }
    collisions(object){
        if(this.position.y < 0 ){
            return 1;
        }
        
        if(this.position.x < object.position.x + object.width &&
            this.position.x + this.width > object.position.x &&
            this.position.y < object.position.y + object.height &&
            this.position.y + this.height > object.position.y
            ){
                return 2;
        }

        return false;
    }
}
class Enemy{
    constructor(){
        this.velocity = 3;
        if(innerWidth<600){
            this.velocity = 2.2;
        }
        this.scale = 0.2; 
        this.position = {};
        const image = new Image();
        image.src = '/enemy.png';
        image.onload = ()=>{
             this.image = image;
             this.width = image.width*this.scale;
             this.height = image.height*this.scale;
             this.init();
        } 
    }
    init(){
        this.position = {
            x:Math.floor(Math.random() * ((canvas.width-this.width) + 1)),
            y: -this.height
        }
    }
    draw(){
        ctx.drawImage(this.image,this.position.x,this.position.y,
            this.width,this.height);
    }
    update(){
        if(this.image){
            this.draw();
            this.position.y += this.velocity;
          
        }
       
    }
    
    collisions(object){
        if(this.position.y + this.height > canvas.height ){
            return 1;
        }
        
        if(this.position.x < object.position.x + object.width &&
            this.position.x + this.width > object.position.x &&
            this.position.y < object.position.y + object.height &&
            this.position.y + this.height > object.position.y
            ){
                return 2;
        }
         
        return false;
    }
}
class Player{
    constructor(){
        this.velocity = 5;
        if(innerWidth<600){
            this.velocity = 3;
        }
      
       this.scale = 0.2; 
       this.projectiles = [];
       const image = new Image();
       image.src = '/player.png';
       image.onload = ()=>{
            this.image = image;
            this.width = image.width*this.scale;
            this.height = image.height*this.scale;
            this.position = {x:50,y:canvas.height-this.height}
       } 
       this.keys = {
            A:false,
            D:false,
            shoot:false
       }
       this.keyboard();
    }
    draw(){
       
        ctx.drawImage(this.image,this.position.x,this.position.y,
            this.width,this.height);
    }
    update(){
        if(this.image){
            this.draw();
            if(this.keys.D){
                this.position.x += this.velocity;
                if(this.position.x + this.width> canvas.width){
                    this.position.x = canvas.width - this.width;
                }
            }
            if(this.keys.A){
                this.position.x -= this.velocity;
                if(this.position.x < 0 ){
                    this.position.x = 0;
                }
            }
        }
    
    }
    keyboard(){
        document.addEventListener("keydown",(evt)=>{
            if(evt.key == "a" || evt.key == "A"){
                this.keys.A = true;
            }
            if(evt.key == "d" || evt.key == "D"){
                this.keys.D = true;
            }
            if(evt.key == "ArrowUp" && this.keys.shoot && !this.keys.A && !this.keys.D){
                this.projectiles.push(
                    new Projectile({
                        x:this.position.x+(this.width/2)-5,
                        y:this.position.y-15
                    })
                );
                this.keys.shoot = false;
            }
        });
        document.addEventListener("keyup",(evt)=>{
            if(evt.key == "a" || evt.key == "A"){
                this.keys.A = false;
            }
            if(evt.key == "d" || evt.key == "D"){
                this.keys.D = false;
            }
            if(evt.key == "ArrowUp" ){

                this.keys.shoot = true  ;
            }
        });
        heart.addEventListener("touchstart",()=>{
          
            if(!this.keys.D && !this.keys.A){
                this.projectiles.push(
                    new Projectile({
                        x:this.position.x+(this.width/2)-5,
                        y:this.position.y-15
                    })
                );
                heart.style.fontSize = "75px";
                setTimeout(()=>{
                    heart.style.fontSize = "60px";
                }, 100);
            }
           
        });
        arrowLeft.addEventListener("touchstart",()=>{
            arrowLeft.style.color = "white";
            this.keys.A = true;
            heart.style.color = "rgb(255, 255, 255,0.3)";
        });
        arrowLeft.addEventListener("touchend",()=>{
            this.keys.A = false;
            arrowLeft.style.color = "rgb(255, 255, 255,0.6)";
            heart.style.color = "red";
        });
        arrowRight.addEventListener("touchstart",()=>{
            arrowRight.style.color = "white";
            this.keys.D = true;
            heart.style.color = "rgb(255, 255, 255,0.3)";
        });
        arrowRight.addEventListener("touchend",()=>{
            this.keys.D = false;
            arrowRight.style.color = "rgb(255, 255, 255,0.6)";
            heart.style.color = "red";
        });
    }
  
}
const player = new Player();
const enemys = [];

function init(){
    update();
    resize();
    setInterval(()=>{
        if(play){
            enemys.push(
                new Enemy()
            );
        }
    }, 800);  
}
btnPlay.addEventListener("click",()=>{
    play = true;
    score = 0;
    death = false;
    toxicasEliminadas.textContent = 0;
    menu.style.display = "none";
});
function updateObjects(){
    player.update();
    for (let j = 0; j < player.projectiles.length; j++) {
        const p = player.projectiles[j];
        p.update();
    
        for (let i = 0; i < enemys.length; i++) {
            const e = enemys[i];
            const collisionResult = p.collisions(e);
    
            if (collisionResult === 1) {
                player.projectiles.splice(j, 1);
                j--; 
                break; 
            } else if (collisionResult === 2) {
                player.projectiles.splice(j, 1);
                enemys.splice(i, 1);
                score++;
                toxicasEliminadas.textContent = score;
                j--; 
                break; 
            }
        }
    }
    for (var i = enemys.length - 1; i >= 0; i--) {
        var e = enemys[i];
        e.update();
      
        if (e.collisions(player) === 1) {
          enemys.splice(i, 1);
          death = true;
        } else if (e.collisions(player) === 2) {
          enemys.splice(i, 1);
          death = true;
        }
      }
   
    
}

function update(){
    if(backgroundOnload){
        ctx.drawImage(background,0,0,canvas.width,canvas.height);
    }
    
    if(play){
       updateObjects();
    }

    if(score==objetivo || death){
        player.projectiles.length = 0;
        enemys.length = 0;
        play = false;
        menu.style.display = "flex";
        title.textContent = death ? TextoDerrota : TextoVictoria;
    }
    requestAnimationFrame(update);
}

init();
