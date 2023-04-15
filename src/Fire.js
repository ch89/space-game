import Explosion from "./Explosion.js"

class Fire extends PIXI.Sprite {
	constructor(ridley) {
		super(app.loader.resources.fire.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		this.position.set(ridley.x + ridley.width / 4, ridley.y - ridley.height / 2 - 25)

		this.rotation = Math.atan2(ship.y - this.y, ship.x - this.x)

		let speed = 10
		this.gravity = .05

		this.vx = Math.cos(this.rotation) * speed
		this.vy = Math.sin(this.rotation) * speed	
	}

	animate() {
		// this.vy += this.gravity
		this.rotation += .1

		this.x += this.vx
		this.y += this.vy

		if(this.x < 0 || this.x > app.screen.width) {
			this.destroy()
		}
		else if(this.y > app.screen.height) {
			this.explosion()
			this.destroy()
		}
		else if(this.hit(ship)) {
			ship.hurt(1)
			this.explosion()
			this.destroy()
		}
	}

	explosion() {
		let explosion = new Explosion()
		explosion.scale.set(2)
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}
}

export default Fire