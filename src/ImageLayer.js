class ImageLayer extends PIXI.Container {

	constructor ( layerData, route ) {
		super ();

		Object.assign ( this, layerData );

		this.alpha = layerData.opacity;

		if ( layerData.image && layerData.image.source ) {
			this.addChild ( PIXI.Sprite.fromImage ( `${ route }/${ layerData.image.source }` ) );
		}
	}
}

module.exports = ImageLayer;
