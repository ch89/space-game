class World extends PIXI.TilingSprite {
	constructor() {
		super(app.loader.resources.world.texture, app.screen.width, app.screen.height)		
	}

	animate() {
		this.tilePosition.x -= .5
	}
}

export default World