import DisplayText from "./DisplayText.js"

class Energy extends PIXI.Sprite {
	constructor() {
		super(app.loader.resources.energy.texture)

		this.anchor.set(.5)
		this.scale.set(2)
		
		this.x = app.screen.width
		this.y = app.screen.height * Math.random()

		this.vr = .01
		this.vx = 1
		this.energy = 3
	}

	animate() {
		this.rotation -= this.vr
		this.x -= this.vx

		if(this.x < 0) {
			this.destroy()
			return
		}

		for(let player of players) {
			if(this.hit(player)) {
				player.heal(this.energy)
				this.showEnergy()
				this.destroy()
				break
			}
		}
	}

	showEnergy() {
		let text = new DisplayText(`+${this.energy}hp`)
		text.position.set(this.x, this.y)
		this.parent.addChild(text)
	}
}

export default Energy