import Wavebeam from "./Wavebeam.js"

class Spacepirate extends PIXI.AnimatedSprite {
	constructor() {
		super(app.loader.resources.spacepirate.spritesheet.animations.walk)

		this.scale.set(2)

		this.x = 0
		this.y = app.screen.height

		this.vx = 2
        this.life = 5

		this.animationSpeed = .167
		this.play()

		this.attack()
	}

	animate() {
		this.x += this.vx

		if(this.x > app.screen.width) {
			this.destroy()
			return
		}
	}

	attack() {
		this.onFrameChange = null
		
		this.timer = setTimeout(() => {
			this.textures = app.loader.resources.spacepirate.spritesheet.animations.attack
			this.play()
			this.vx = 0
			this.onFrameChange = frame => {
				if(frame == 7) {
					const wavebeam = new Wavebeam(this)
					wavebeam.x = this.x
					wavebeam.y = this.y - this.height / 2
					this.parent.addChild(wavebeam)
				}
				else if(frame == 14) {
					this.textures = app.loader.resources.spacepirate.spritesheet.animations.walk
					this.play()
					this.vx = 2
					this.attack()
				}
			}
		}, Math.floor(Math.random() * 5000) + 1000)
	}

	hurt(damage) {
		this.life -= damage

		if(this.life <= 0 && this.loop) {
			clearTimeout(this.timer)
			this.loop = false
			this.vx = 0
			this.textures = app.loader.resources.spacepirate.spritesheet.animations.die
			this.play()
			setTimeout(this.destroy.bind(this), 5000)
		}
	}

    destroy() {
        super.destroy()
        enemies.splice(enemies.indexOf(this), 1)
		clearTimeout(this.timer)
    }
}

export default Spacepirate