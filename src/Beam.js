class Beam extends PIXI.Sprite {
    constructor() {
        super(app.loader.resources.beam.texture)

        this.anchor.set(.5)
        this.scale.set(2)

        this.damage = 1
    }

    animate() {
        this.x += 10

        if(this.x > app.screen.width) {
            this.destroy()
            return
        }

        for(let enemy of enemies) {
            if(this.hit(enemy)) {
                this.destroy()
                enemy.hurt(this)
                break
            }
        }
    }
}

export default Beam