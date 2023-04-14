class Laser extends PIXI.Sprite {
    constructor(sprite) {
        super(app.loader.resources.beam.texture)

        this.anchor.set(.5)

        // this.scale.set(2)
        // this.x = sprite.x
        // this.y = sprite.y
        // this.vx = 5

        // Temp for boss nightmare
		this.position.set(sprite.x, sprite.y + 50)
		// this.scale.set(4)
		this.scale.set(3)
		this.vx = 10
    }

    animate() {
        this.x -= this.vx

        for(let player of players) {
			if(this.hit(player)) {
				player.hurt(1)
				this.destroy()
				break
			}
		}
    }
}

export default Laser