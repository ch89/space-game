import Explosion from "./Explosion.js"

class Claw extends PIXI.Sprite {
	constructor(kraid) {
		super(app.loader.resources.claw.texture)

		this.kraid = kraid
		this.vr = .1
		this.force = .1
		this.ready = true

		this.anchor.set(.5)
		this.scale.set(3)
		this.position.set(kraid.x, kraid.y)

		let speed = 18,
			angle = Math.atan2(ship.y - this.y, ship.x - this.x)

		this.vx = Math.cos(angle) * speed
		this.vy = Math.sin(angle) * speed
	}

	animate() {
		this.rotation -= this.vr

		let angle = Math.atan2(this.kraid.y - this.y, this.kraid.x - this.x)

		this.vx += Math.cos(angle) * this.force
		this.vy += Math.sin(angle) * this.force

		this.x += this.vx
		this.y += this.vy

		if(this.x > app.screen.width) {
			this.destroy()
			return
		}

		if(this.hit(ship) && this.ready) {
			ship.hurt(1)
			this.explosion()
			this.ready = false
			setTimeout(() => this.ready = true, 1000)
		}
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}
}

export default Claw