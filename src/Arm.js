import Explosion from "./Explosion.js"

class Arm extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.arm.texture)

		this.anchor.set(.5)
		this.scale.set(2)

		this.ax = -.1
		this.vx = 0

		this.players = players.slice()
	}

	animate() {
		this.vx += this.ax
		this.x += this.vx

		if(this.x < 0) {
			this.destroy()
			return
		}

		for(let player of this.players) {
			if(this.hit(player)) {
				this.players.splice(this.players.indexOf(player), 1)
				player.hurt(1)
				player.vx += this.vx
				this.explosion()
			}
		}
	}

	explosion() {
		let explosion = new Explosion()
		explosion.position.set(this.x, this.y)
		this.parent.addChild(explosion)
	}
}

export default Arm