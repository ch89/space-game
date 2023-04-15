import Bar from "./Bar.js"
import Laser from "./Laser.js"
import Bomb from "./Bomb.js"
import SuperMissile from "./SuperMissile.js"
import Explosion from "./Explosion.js"

class Nightmare extends PIXI.Sprite {
    constructor() {
        super(app.loader.resources.nightmare.texture)

        this.anchor.set(.5)
        this.scale.set(2)

        this.x = app.screen.width
        this.y = app.screen.height / 2

        this.vx = 0
        this.vy = 0

        this.bounce = -.7
		this.friction = .97
		this.threshold = .5

		this.force = .025
		this.limit = 3

        this.intervals = {}
		this.timeouts = {}

        this.life = 50
        this.maxLife = this.life

        this.health = new Bar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)

		this.defense = new PIXI.filters.GlowFilter({ color: 0x5C98EF })
		this.filters = [this.defense]

        this.laser()
		// this.bombs()
		this.missile()

		this.animate = this.chase
    }

    chase() {
		let dx = ship.x - this.x,
			dy = ship.y - this.y,
			angle = Math.atan2(dy, dx)

		this.vx += Math.cos(angle) * this.force
		this.vy += Math.sin(angle) * this.force

		let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)

		if(speed > this.limit) {
			this.vx *= this.limit / speed
			this.vy *= this.limit / speed
		}

		this.x += this.vx
		this.y += this.vy

		this.border()
	}

	stop() {
		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy

		this.border()
	}

    border() {
		if(this.x - this.width / 2 < 0) {
			this.x = this.width / 2
			this.vx *= this.bounce
		}
		else if(this.x + this.width / 2 > app.screen.width) {
			this.x = app.screen.width - this.width / 2
			this.vx *= this.bounce
		}
		if(this.y - this.height / 2 < 0) {
			this.y = this.height / 2
			this.vy *= this.bounce
		}
		else if(this.y + this.height / 2 > app.screen.height) {
			this.y = app.screen.height - this.height / 2
			this.vy *= this.bounce
		}
	}

	missile() {
		this.timeouts.missile = setTimeout(() => this.parent.addChild(new SuperMissile(this)), 10000)
	}

    laser() {
		this.timeouts.laser = setTimeout(() => {
			this.intervals.laser = setInterval(() => {
				this.parent.addChild(new Laser(this))
			}, 750)

			this.timeouts.laser = setTimeout(() => {
				clearInterval(this.intervals.laser)
				this.laser()
			}, 5000)
		}, 5000)
	}

	bombs() {
		let count = 3

		this.intervals.bombs = setInterval(() => {
			this.parent.addChild(new Bomb(this))

			count--

			if(count == 0) {
				clearInterval(this.intervals.bombs)
				this.timeouts.bombs = setTimeout(this.bombs.bind(this), 10000)
			}
		}, 2000)
	}

    hurt({ damage }) {
		if(this.life > 0 && ! this.defense.enabled) {
			this.life -= damage

        	if(this.life <= 0) {
				this.defeated()
			}
			else if(this.life / this.maxLife <= this.threshold) {
				this.threshold = 0
				this.bombs()
			}

        	this.health.update(this.life, this.maxLife)
		}
    }

	fall() {
		this.vx *= this.friction
		this.vy += .02

		this.x += this.vx
		this.y += this.vy

		this.angle += .2

		if(this.y > app.screen.height) {
			let explosion = new Explosion()
			explosion.position.set(this.x, this.y)
			explosion.scale.set(10)
			this.parent.addChild(explosion)

			this.destroy()
		}
	}

	defeated() {
		this.life = 0

		clearTimeout(this.timeouts.laser)
		clearTimeout(this.timeouts.bombs)
		clearTimeout(this.timeouts.missile)

		clearInterval(this.intervals.laser)
		clearInterval(this.intervals.bombs)

		this.animate = this.fall
		this.explosions()
	}

	explosions() {
		this.intervals.explosions = setInterval(() => {
			let explosion = new Explosion()
			explosion.x = this.x + Math.random() * 200 - 100
			explosion.y = this.y + Math.random() * 200 - 100
			this.parent.addChild(explosion)
		}, 250)
	}

	destroy() {
		super.destroy()
		enemies.splice(enemies.indexOf(this), 1)
		clearInterval(this.intervals.explosions)
	}
}

export default Nightmare