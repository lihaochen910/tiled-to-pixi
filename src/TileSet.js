const Tile = require ( './Tile' );

class TileSet {

	/**
	 * Maximum width of tiles in this set
	 *
	 * @property tileWidth
	 * @type Number
	 */
	get tileWidth () { return this.data.tilewidth; }

	/**
	 * Maximum height of tiles in this set
	 *
	 * @property tileWidth
	 * @type Number
	 */
	get tileHeight () { return this.data.tileheight; }

	/**
	 * GID corresponding to the first tile in the set
	 *
	 * @property firstGid
	 * @type Number
	 */
	get firstGid () { return this.data.firstgid; }

	/**
	 * TileSet Ctor
	 * @param {String} route
	 * @param {Object} tileSet
	 */
	constructor ( route, tileSet ) {
		this.data = tileSet;
		this.tiles = new Array ( tileSet.tilecount );
		this.tileOffset = tileSet.tileoffset || { x: 0, y: 0 };
		this.setupTileSetProperties ( tileSet );
		this.baseTexture = PIXI.Texture.fromImage ( route + '/' + tileSet.image, false, PIXI.SCALE_MODES.NEAREST );
		this.setupTileTextures ();
		
		for ( let i = 0; i < tileSet.tilecount; ++i ) {
			this.tiles[ i ] = new Tile ( i, this );
		}
	}

	setupTileSetProperties ( tileSet ) {
		this.properties = {};
		for ( let property in tileSet ) {
			if ( tileSet.hasOwnProperty ( property ) ) {
				this.properties[ property ] = tileSet[ property ];
			}
		}
	}

	setupTileTextures () {
		this.textures = [];
		for ( let y = this.data.margin; y < this.data.imageheight; y += this.tileHeight + this.data.spacing ) {
			for ( let x = this.data.margin; x < this.data.imagewidth; x += this.tileWidth + this.data.spacing ) {
				this.textures.push ( new PIXI.Texture ( this.baseTexture, new PIXI.Rectangle ( x, y, this.tileWidth, this.tileHeight ) ) );
			}
		}
	}

	/**
	 * find Tile By GlobalTileIndex
	 * @param {Number} gid
	 */
	getTileByGid ( gid ) {
		return this.tiles[ this.gidToLocalIndex ( gid ) ];
	}

	/**
	 * find Tile's Texture
	 * @param {Tile} tile
	 */
	getTileTexture ( tile ) {
		return this.textures[ tile.id ];
	}

	/**
	 * find Tile's Texture by GlobalTileIndex
	 * @param {Number} gid
	 */
	getTileTextureByGid ( gid ) {
		return this.textures[ this.gidToLocalIndex ( gid ) ];
	}
	
	gidToLocalIndex ( gid ) {
		return gid - this.firstGid;
	}
	
	localIndexToGid ( localIndex ) {
		return localIndex + this.firstGid;
	}
}

module.exports = TileSet;
