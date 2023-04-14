class Wavebeam extends PIXI.Sprite {
    constructor() {
        super(app.loader.resources.wavebeam.texture)

        this.anchor.set(.5)

        this.angle = -45
        this.speed = 10

        this.vx = Math.cos(this.angle) * this.speed
		this.vy = Math.sin(this.angle) * this.speed
    }

    animate() {
        this.x += this.vx
        this.y += this.vy

        if(this.x > app.screen.width || this.y < 0) {
            this.destroy()
            return
        }

        for(let player of players) {
			if(this.hit(player)) {
				player.hurt(1)
				this.destroy()
				break
			}
		}
    }
}

export default Wavebeam