import Bar from "./Bar.js"
import Claw from "./Claw.js"
import Arm from "./Arm.js"
import Fireball from "./Fireball.js"
import Explosion from "./Explosion.js"

class Kraid extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.kraid.texture)

		this.anchor.set(.5)
		this.scale.set(3)

		this.x = app.screen.width + this.width / 2
		this.y = app.screen.height - this.height / 2

		this.timers = {
			claw: setInterval(this.claw.bind(this), 2000)
		}

		this.weapons = [this.fire, this.arm]
		this.threshold = .66

		this.life = 300
		this.maxLife = this.life

		this.health = new Bar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)

		this.animate = this.walk
	}

	walk() {
		if(this.x > app.screen.width - 200) this.x -= 1
	}

	fall() {
		if(this.y - this.height / 2 < app.screen.height) {
			this.y += .5
		}
		else {
			clearInterval(this.timers.explosions)
			this.destroy()
		}
	}

	claw() {
		this.parent.addChild(new Claw(this))
	}

	arm() {
		let count = 0

		this.timers.arm = setInterval(() => {
			let arm = new Arm
			arm.position.set(this.x - 300, this.y + count * 100)
			this.parent.addChild(arm)

			count++

			if(count == 3) {
				clearInterval(this.timers.arm)
				this.timers.arm = setTimeout(this.arm.bind(this), 5000)
			}
		}, 1000)
	}

	fire() {
		let count = 0

		this.timers.fire = setInterval(() => {
			this.parent.addChild(new Fireball(this))

			count++

			if(count == 10) {
				clearInterval(this.timers.fire)
				this.timers.fire = setTimeout(this.fire.bind(this), 10000)
			}
		}, 1000)
	}

	hurt({ damage }) {
		if(this.life > 0) {
			this.life -= damage

			if(this.life <= 0) this.defeated()
			else if(this.life / this.maxLife <= this.threshold) {
				this.threshold -= .33
				this.weapons.shift().call(this)
			}

			this.health.update(this.life, this.maxLife)
		}
	}

	defeated() {
		this.animate = this.fall

		clearInterval(this.timers.claw)
		clearInterval(this.timers.arm)
		clearInterval(this.timers.fire)

		clearTimeout(this.timers.arm)
		clearTimeout(this.timers.fire)

		this.timers.explosions = setInterval(() => {
			let explosion = new Explosion()
			explosion.x = this.x + Math.random() * this.width - this.width / 2
			explosion.y = this.y + Math.random() * this.height - this.height / 2
			this.parent.addChild(explosion)
		}, 100)
	}

	destroy() {
		super.destroy()
		enemies.splice(enemies.indexOf(this), 1)
	}
}

export default Kraid