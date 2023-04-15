import Beam from "./Beam.js"
import Bar from "./Bar.js"
import Explosion from "./Explosion"
import Missile from "./Missile.js"

const key = {
    keysDown: {},
    pressed(key) {
        return key in this.keysDown
    }
}

// Add keyboard listeners for arrow key presses
window.addEventListener('keydown', e => key.keysDown[e.key] = true)
window.addEventListener('keyup', e => delete key.keysDown[e.key])

class Ship extends PIXI.Sprite {
    constructor() {
      super(app.loader.resources.ship.texture)
  
      // Set the anchor point to the center of the sprite
      this.anchor.set(0.5)
      this.scale.set(2)
  
      // Set the initial position of the sprite to the center of the screen
      this.x = app.screen.width / 2
      this.y = app.screen.height / 2

      this.speed = 5
      this.ready = true
      this.life = 100
      this.maxLife = this.life

      this.on("added", () => {
        this.health = new Bar(this.life, this.maxLife)
        this.health.position.set(25)
        app.stage.addChild(this.health)
      })

      this.animate = this.move
    }

    reset() {
      this.vx = 0
      this.vy = 0
    }
  
    // Update function, called every frame
    move() {
      // Move the sprite based on the movement variables
        if (key.pressed("ArrowUp")) this.y -= this.speed
        if (key.pressed("ArrowDown")) this.y += this.speed
        if (key.pressed("ArrowLeft")) this.x -= this.speed
        if (key.pressed("ArrowRight")) this.x += this.speed
        if (key.pressed("a") && this.ready) this.shoot()
        if (key.pressed("s") && this.ready) this.shootMissle()

        this.boundaries()
    }

    disabled() {}

    boundaries() {
      if(this.x - this.width / 2 < 0) {
        this.x = this.width / 2
        this.vx = 0
      }
      else if(this.x + this.width / 2 > app.screen.width) {
        this.x = app.screen.width - this.width / 2
        this.vx = 0
      }
      if(this.y - this.height / 2 < 0) {
        this.y = this.height / 2
        this.vy = 0
      }
      else if(this.y + this.height / 2 > app.screen.height) {
        this.y = app.screen.height - this.height / 2
        this.vy = 0
      }
    }

    shoot() {
        let beam = new Beam
        beam.x = this.x + this.width / 2
        beam.y = this.y
        this.parent.addChild(beam)

        this.ready = false
        setTimeout(() => this.ready = true, 300)
    }

    // Temp
    shootMissle() {
      let missile = new Missile(this)
      missile.x = this.x + this.width / 2
      missile.y = this.y
      this.parent.addChild(missile)

      this.ready = false
      setTimeout(() => this.ready = true, 300)
  }

    heal(energy) {
      this.life += energy

      if(this.life > this.maxLife) this.life = this.maxLife

      this.health.update(this.life, this.maxLife)
    }

    hurt(damage) {
      this.life -= damage

      if(this.life <= 0) {
        this.life = 0
        this.destroy()
      }

      this.health.update(this.life, this.maxLife)
    }

    explosion() {
      let explosion = new Explosion()
      explosion.position.set(this.x, this.y)
      this.parent.addChild(explosion)
    }

    destroy() {
      super.destroy()
      players.splice(players.indexOf(this), 1)
    }
}

export default Ship