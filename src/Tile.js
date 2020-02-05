function setTextures ( tile, tileSet ) {
	let textures = []
	if ( tile.animations.length ) {
		tile.animations.forEach ( function ( frame ) {
			textures.push ( tileSet.textures[ frame.tileId ] )
		}, this )
	} else {
		textures.push ( tileSet.textures[ tile.gid - tileSet.firstGid ] )
	}
	return textures
}

class Tile {
	
	/**
	 * Tile Ctor
	 * @param {Number} id
	 * @param {TileSet} tileSet
	 * @param {Boolean} horizontalFlip
	 * @param {Boolean} verticalFlip
	 * @param {Boolean} diagonalFlip
	 */
	constructor ( id, tileSet ) {
		this.id = id;
		this.gid = id + tileSet.firstGid;
		this.tileSet = tileSet;
		this.terrain = [];
		this.probability = null;
		this.animations = [];
		this.objectGroups = [];
		// this.data = tileData;
		// this.setupTileProperties ( tileData );
		// this.setupFlips ( horizontalFlip, verticalFlip, diagonalFlip );
	}

	setupTileProperties ( tile ) {
		this.properties = {};
		for ( let property in tile ) {
			if ( tile.hasOwnProperty ( property ) ) {
				this.properties[ property ] = tile[ property ];
			}
		}
	}

	setupFlips ( horizontalFlip, verticalFlip, diagonalFlip ) {
		
		this.horizontalFlip = horizontalFlip;
		this.verticalFlip = verticalFlip;
		this.diagonalFlip = diagonalFlip;
		
		// if ( horizontalFlip ) {
		// 	this.anchor.x = 1;
		// 	this.scale.x = -1;
		// }
		//
		// if ( verticalFlip ) {
		// 	this.anchor.y = 1;
		// 	this.scale.y = -1;
		// }
		//
		// if ( diagonalFlip ) {
		// 	if ( horizontalFlip ) {
		// 		this.anchor.x = 0;
		// 		this.scale.x = 1;
		// 		this.anchor.y = 1;
		// 		this.scale.y = 1;
		//
		// 		this.rotation = PIXI.DEG_TO_RAD * 90;
		// 	}
		// 	if ( verticalFlip ) {
		// 		this.anchor.x = 1;
		// 		this.scale.x = 1;
		// 		this.anchor.y = 0;
		// 		this.scale.y = 1;
		//
		// 		this.rotation = PIXI.DEG_TO_RAD * -90;
		// 	}
		// }
	}
}

module.exports = Tile;
