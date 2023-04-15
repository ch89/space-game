import Fire from "./Fire.js"
import Bar from "./Bar.js"
import Explosion from "./Explosion"
import Missile from "./Missile.js"

class Ridley extends PIXI.AnimatedSprite {
	constructor() {
		super(app.loader.resources.ridley2.spritesheet.animations.fly)

		// this.anchor.set(.5)
		this.scale.set(2)
		
		this.x = app.screen.width
		this.y = app.screen.height / 2

		this.vx = 0
		this.vy = 0
		this.force = .1
		this.limit = 7
		this.friction = .98
		this.bounce = -.5
		this.intervals = {}
		this.timeouts = {}
		this.ready = true

		this.animationSpeed = .167
		this.play()

		this.life = 100
		this.maxLife = this.life

		this.health = new Bar(this.life, this.maxLife)
		this.health.position.set(app.screen.width - this.health.width - 25, 25)
		app.stage.addChild(this.health)

		this.init()
	}

	init() {
		this.animate = this.chase

		this.timeouts.chase = setTimeout(() => {
			this.animate = this.stop
			this.shoot()
		}, 10000)
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

		this.boundaries()

		if(this.hit(ship)) {
			this.parent.swapChildren(this, ship)
			clearTimeout(this.timeouts.chase)
			this.animate = this.grab
			ship.animate = ship.disabled
			ship.reset()
		}
	}

	boundaries() {
		if(this.x < 0) {
			this.x = 0
			this.vx *= this.bounce
		}
		else if(this.x + this.width > app.screen.width) {
			this.x = app.screen.width - this.width
			this.vx *= this.bounce
		}
		if(this.y - 196 < 0) {
			this.y = 196
			this.vy *= this.bounce
		}
		if(this.y > app.screen.height) {
			this.y = app.screen.height
			this.vy *= this.bounce
		}
	}

	grab() {
		if(this.y > app.screen.height) {
			this.y = app.screen.height
			this.vy = 0

			this.intervals.drag = setInterval(() => {
				ship.hurt(1)
				ship.explosion()
			}, 500)

			this.animate = this.drag
		}
		else {
			this.vx *= this.friction
			this.vy += this.force

			this.x += this.vx
			this.y += this.vy
		}

		ship.x = this.x
		ship.y = this.y - ship.height / 2
	}

	drag() {
		this.vx += this.force

		if(this.vx > this.limit) this.vx = this.limit

		this.x += this.vx

		if(this.x > app.screen.width - 300) {
			ship.animate = ship.move
			// ship.vx = this.vx
			clearInterval(this.intervals.drag)
			this.animate = this.drop
		}
		else {
			ship.x = this.x
			ship.y = this.y - ship.height / 2
		}
	}

	drop() {
		let dx = app.screen.width / 2 - this.x,
			dy = app.screen.height / 2 - this.y,
			angle = Math.atan2(dy, dx),
			distance = Math.sqrt(dx * dx + dy * dy)

		this.vx += Math.cos(angle) * this.force
		this.vy += Math.sin(angle) * this.force

		let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)

		if(speed > this.limit) {
			this.vx *= this.limit / speed
			this.vy *= this.limit / speed
		}

		this.x += this.vx
		this.y += this.vy

		if(distance < 300) {
			this.animate = this.stop
			this.shoot()
		}
	}

	stop() {
		this.vx *= this.friction
		this.vy *= this.friction

		this.x += this.vx
		this.y += this.vy

		this.boundaries()
	}

	shoot() {
		let count = 10

		this.textures = app.loader.resources.ridley2.spritesheet.animations.attack
		this.play()

		this.parent.addChild(new Fire(this))

		this.intervals.shoot = setInterval(() => {
			this.parent.addChild(new Fire(this))

			count--

			if(count == 0) {
				this.textures = app.loader.resources.ridley2.spritesheet.animations.fly
				this.play()
				clearInterval(this.intervals.shoot)
				this.init()
			}
		}, 500)
	}

	explode() {
		let count = 20
		
		let timer = setInterval(() => {
			let explosion = new Explosion()

			explosion.x = (this.x + this.width / 2) + Math.random() * 200 - 100
			explosion.y = (this.y - this.height / 2) + Math.random() * 200 - 100

			this.parent.addChild(explosion)

			app.loader.resources.explode.sound.play()

			count--

			if(count == 0) {
				app.loader.resources.scream.sound.play()
				let explosion = new Explosion()
				explosion.scale.set(10)
				explosion.position.set(this.x + this.width / 2, this.y - this.height / 2)
				this.parent.addChild(explosion)
				
				clearInterval(timer)
				this.destroy()
			}
		}, 250)
	}

	hurt(projectile) {
		if(this.life > 0 && projectile instanceof Missile) {
			this.life -= projectile.damage

			if(this.ready) {
				app.loader.resources.scream.sound.play()

				this.ready = false
				setTimeout(() => this.ready = true, 10000)
			}

			if(this.life <= 0) this.defeated()

			this.health.update(this.life, this.maxLife)
		}
	}

	defeated() {
		this.life = 0
		this.animate = this.stop
		ship.animate = ship.move
		this.explode()
		clearTimeout(this.timeouts.chase)
		clearInterval(this.intervals.drag)
		clearInterval(this.intervals.shoot)
	}

	destroy() {
		super.destroy()
        enemies.splice(enemies.indexOf(this), 1)
	}
}

export default Ridley