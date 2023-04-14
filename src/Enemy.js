import Explosion from "./Explosion"
import Laser from "./Laser"

class Enemy extends PIXI.Sprite {
    constructor() {
        super(app.loader.resources.enemy.texture)

        this.anchor.set(.5)
        this.scale.set(2)

        // Set the initial position of the enemy sprite to the right of the screen
        this.x = app.screen.width
        this.y = Math.random() * app.screen.height

        this.life = 3
        this.center = this.y
        this.radians = 0
        this.range = 25

        this.timer = setInterval(this.shoot.bind(this), 5000)
    }

    animate() {
        this.x -= 2
        this.y = this.center + Math.sin(this.radians) * this.range
        this.radians += .03

        if(this.x < 0) {
            this.destroy()
            return
        }

        for(let player of players) {
			if(this.hit(player)) {
				player.hurt(2)
                this.explosion()
				this.destroy()
				break
			}
		}
    }

    hurt(damage) {
        this.life -= damage

        if(this.life <= 0) {
            this.explosion()
            this.destroy()
        }
    }

    shoot() {
        this.parent.addChild(new Laser(this))
    }

    explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}

    destroy() {
        super.destroy()
        enemies.splice(enemies.indexOf(this), 1)
        clearInterval(this.timer)
    }
}

export default Enemy