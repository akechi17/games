const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

class Player {
    constructor(x, y, bulletController) {
        this.x = x;
        this.y = y
        this.bulletController = bulletController
        this.width = 50
        this.height = 50
        this.speed = 4

        document.addEventListener('keydown',this.keydown);
        document.addEventListener('keyup',this.keyup);
    }

    draw(ctx) {
        this.move()
        ctx.strokeStyle = "yellow"
        ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = "black"
        ctx.fillRect(this.x, this.y, this.width, this.height)

        this.shoot()
    }

    shoot() {
        if(this.shootPressed) {
            const speed = 5;
            const delay = 7;
            const damage = 1;
            const bulletX = this.x + this.width / 2;
            const bulletY = this.y;
            this.bulletController.shoot(bulletX, bulletY, speed, damage, delay)
        }
    }

     move() {
        if(this.downPressed) {
            this.y += this.speed;
        }
        if(this.upPressed) {
            this.y -= this.speed;
        }
        if(this.rightPressed) {
            this.x += this.speed;
        }
        if(this.leftPressed) {
            this.x -= this.speed;
        }
     }

    keydown = (e) => {
        if(e.code === "ArrowUp") {
            this.upPressed = true;
        }
        if(e.code === "ArrowDown") {
            this.downPressed = true;
        }
        if(e.code === "ArrowLeft") {
            this.leftPressed = true;
        }
        if(e.code === "ArrowRight") {
            this.rightPressed = true;
        }
        if(e.code === "Space") {
            this.shootPressed = true
        }
    };

    keyup = (e) => {
        if(e.code === "ArrowUp") {
            this.upPressed = false;
        }
        if(e.code === "ArrowDown") {
            this.downPressed = false;
        }
        if(e.code === "ArrowLeft") {
            this.leftPressed = false;
        }
        if(e.code === "ArrowRight") {
            this.rightPressed = false;
        }
        if(e.code === "Space") {
            this.shootPressed = false
        }
    }
}

class BulletController{
    bullets = [];
    timerTillNextBullet = 0;

    constructor(canvas){
        this.canvas = canvas
    }

    shoot(x,y,speed,damage,delay) {
        if(this.timerTillNextBullet <= 0) {
            if(this.bullets.length < 3){
                this.bullets.push(new Bullet(x,y,speed,damage))
            }
            this.bullets.push(new Bullet(x,y,speed,damage))
            this.timerTillNextBullet = delay
        }

        this.timerTillNextBullet--
    }
    draw(ctx) {
        this.bullets.forEach((bullet) => {
            if(this.isBulletOffScreen(bullet)){
                const index = this.bullets.indexOf(bullet);
                this.bullets.splice(index,1)
            }
            bullet.draw(ctx)
        })
    }

    collideWith(sprite){
        return this.bullets.some(bullet=>{
            if(bullet.collideWith(sprite)){
                this.bullets.splice(this.bullets.indexOf(bullet), 1)
                return true
            }
            return false
        })
    }

    isBulletOffScreen(bullet) {
        return bullet.y <= -bullet.height
    }
}

class Bullet {
    constructor(x,y,speed,damage) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.damage = damage

        this.width = 5;
        this.height = 15;
        this.color = "red"
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        this.y -= this.speed;
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    collideWith(sprite){
        if(this.x < sprite.x + sprite.width && 
            this.x + this.width > sprite.x && 
            this.y < sprite.y + sprite.height &&
            this.y + this.height > sprite.y
        ) {
            sprite.takeDamage(this.damage);
            return true;
        }
        return false;
    }
}

class Enemy {
    constructor(x, y, color, health) {
        this.x = x,
        this.y = y,
        this.color = color,
        this.health = health,
        this.width = 50,
        this.height = 50
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        if(this.health > 1) {
            ctx.strokeStyle = "white"
        } else {
            ctx.strokeStyle = this.color
        }

        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.strokeRect(this.x, this.y, this.width, this.height)

        ctx.fillStyle = "black"
        ctx.font = "25px arial"
        ctx.fillText(this.health, this.x + this.width / 3.5, this.y + this.height / 1.5)
    }

    takeDamage (damage) {
        this.health -= damage
    }
}

canvas.width = 550
canvas.height = 600

const bulletController = new BulletController(canvas);
const player = new Player(canvas.width/2.2, canvas.height/1.3, bulletController);
const enemies = [
    new Enemy(50,20,'green',5),
    new Enemy(150,20,'red',5),
    new Enemy(250,20,'gold',2),
    new Enemy(350,20,'green',2),
    new Enemy(450,20,'gold',10),
    new Enemy(50,100,'green',5),
    new Enemy(150,100,'red',5),
    new Enemy(250,100,'gold',2),
    new Enemy(350,100,'green',2),
    new Enemy(450,100,'gold',20),
]

function gameLoop() {
    setCommonStyle();
    ctx.fillStyle = "black"
    ctx.fillRect(0,0, canvas.width, canvas.height);
    bulletController.draw(ctx)
    player.draw(ctx)
    enemies.forEach((enemy) => {
        if(bulletController.collideWith(enemy)) {
            if(enemy.health <= 0) {
                const index = enemies.indexOf(enemy);
                enemies.splice(index, 1)
            } else {
                enemy.draw(ctx)
            }
        }
        enemy.draw(ctx)
    })
}

function setCommonStyle() {
    ctx.shadowColor = '#d53'
    ctx.shadowBlur = 20;
    ctx.lineJoin = 'bevel';
    ctx.lineWidth = 20
}

setInterval(gameLoop, 1000 / 60)