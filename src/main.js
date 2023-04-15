import { initializeApp } from "firebase/app"
import World from "./World.js"
import Ship from "./Ship.js"
import Enemy from "./Enemy.js"
import Spacepirate from "./Spacepirate.js"
import Energy from "./Energy.js"
import Nightmare from "./Nightmare.js"
import Ridley from "./Ridley.js"

initializeApp({
    apiKey: "AIzaSyDRSspX_QPOt-R868sZRFo-8UgGRvsPj4E",
    authDomain: "space-game-b2b9a.firebaseapp.com",
    projectId: "space-game-b2b9a",
    storageBucket: "space-game-b2b9a.appspot.com",
    messagingSenderId: "732955926076",
    appId: "1:732955926076:web:64cb57fa874e227f44ed39"
})

PIXI.DisplayObject.prototype.hit = function(obj) {
	let a = this.getBounds(),
		b = obj.getBounds()

	return a.x + a.width > b.x && a.x < b.x + b.width && a.y + a.height > b.y && a.y < b.y + b.height
}

// Create a Pixi.js application
window.app = new PIXI.Application({ resizeTo: window })

// Add the canvas element to the DOM
document.body.appendChild(app.view)

// Preload the texture
app.loader
    .add("world", "images/world.png")
    .add("ship", "images/ship.png")
    .add("enemy", "images/enemy.png")
    .add("beam", "images/beam.png")
    .add("explosion", "images/explosion.json")
    .add("spacepirate", "images/spacepirate.json")
    .add("wavebeam", "images/wavebeam.png")
    .add("energy", "images/energy.png")
    .add("nightmare", "images/nightmare.png")
    .add("bomb", "images/bomb.png")
    .add("missile", "images/missile.png")
    .add("supermissile", "images/supermissile.png")
    .add("fire", "images/fire.png")
    .add("ridley", "images/ridley.json")
    .add("ridley2", "images/ridley2.json")
    .add("smoke", "images/smoke.png")
    .add("scream", "sounds/scream.mp3")
    .add("shoot", "sounds/shoot.wav")
    .add("explode", "sounds/explode.wav")
    .load(setup)

let game, world

function setup() {
    // Create the sprite from the loaded texture using the custom class
    game = new PIXI.Container()
    world = new World
    window.ship = new Ship
    window.players = [ship]
    window.enemies = []
    window.particles = new PIXI.ParticleContainer(1000, {
		scale: true,
		position: true,
		rotation: true,
		uvs: true,
		alpha: true
	})
			
    app.stage.addChild(game, particles)
    game.addChild(world, ship)
  
    // Create a ticker to update the sprite
    app.ticker.add(() => {
        game.children.forEach(sprite => sprite.animate())
        particles.children.forEach(particle => particle.animate())   
    })

    // Create an interval to spawn enemies every 3 seconds
    // setInterval(spawnEnemy, 5000, Spacepirate)
    // setInterval(spawnEnemy, 4000, Enemy)
    // setInterval(() => game.addChild(new Energy), 7000)
    // setTimeout(spawnEnemy, 2000, Nightmare)
    setTimeout(spawnEnemy, 2000, Ridley)
}

function spawnEnemy(type) {
    // Create the enemy sprite from the loaded texture using the custom class
    const enemy = new type

    // Add the enemy sprite to the stage
    game.addChild(enemy)
    enemies.push(enemy)
}