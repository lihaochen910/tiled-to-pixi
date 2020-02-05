const path = require ( 'path' );
const zlib = require ( 'zlib' );

//-----------------------------------------------------------------------------
/**
 * Tiled json parser.
 *
 * @class TiledJsonParser
 */
class TiledJsonParser {
	
	/**
	 * Cache for images, audio, or any other kind of resource
	 * @param {String} jsonContent
	 * @return {Map}
	 */
	static parse ( jsonContent ) {
		let jsonObj = JSON.parse ( jsonContent );
		let map = new Map ( jsonObj );
		return map;
	}
}

//-----------------------------------------------------------------------------
/**
 * This is a class
 *
 * @class Map
 */
class Map {

	/**
	 * The TMX format version. Was “1.0” so far, and will be incremented to match minor Tiled releases.
	 * 
	 * @property version
	 * @type Number
	 */
	get version () { return this._version; }

	/**
	 * The Tiled version used to save the file (since Tiled 1.0.1). May be a date (for snapshot builds).
	 *
	 * @property tiledVersion
	 * @type String
	 */
	get tiledVersion () { return this._tiledVersion; }

	/**
	 * Map orientation. Tiled supports “orthogonal”, “isometric”, “staggered” and “hexagonal” (since 0.11).
	 *
	 * @property orientation
	 * @type String
	 */
	get orientation () { return this._orientation; }

	/**
	 * The order in which tiles on tile layers are rendered. Valid values are right-down (the default), right-up, left-down and left-up. In all cases, the map is drawn row-by-row. (only supported for orthogonal maps at the moment)
	 *
	 * @property renderOrder
	 * @type String
	 */
	get renderOrder () { return this._renderOrder; }

	/**
	 * ???
	 *
	 * @property compressionLevel
	 * @type Number
	 */
	get compressionLevel () { return this._compressionLevel; }

	/**
	 * The map width in tiles.
	 *
	 * @property width
	 * @type Number
	 */
	get width () { return this._width; }

	/**
	 * The map height in tiles.
	 *
	 * @property height
	 * @type Number
	 */
	get height () { return this._height; }

	/**
	 * The width of a tile.
	 *
	 * @property tileWidth
	 * @type Number
	 */
	get tileWidth () { return this._tileWidth; }

	/**
	 * The height of a tile.
	 *
	 * @property tileHeight
	 * @type Number
	 */
	get tileHeight () { return this._tileHeight; }

	/**
	 * Whether the map has infinite dimensions
	 *
	 * @property infinite
	 * @type Boolean
	 */
	get infinite () { return this._infinite; }

	/**
	 * Hex-formatted color (#RRGGBB or #AARRGGBB) (optional)
	 *
	 * @property backgroundColor
	 * @type String
	 */
	get backgroundColor () { return this._backgroundColor; }

	/**
	 * Auto-increments for each layer
	 *
	 * @property nextLayerId
	 * @type Number
	 */
	get nextLayerId () { return this._nextLayerId; }

	/**
	 * Auto-increments for each placed object
	 *
	 * @property nextObjectId
	 * @type Number
	 */
	get nextObjectId () { return this._nextObjectId; }

	/**
	 * map (since 1.0)
	 *
	 * @property type
	 * @type String
	 */
	get type () { return this._type; }

	/**
	 * Cache for images, audio, or any other kind of resource
	 * @param {Object} jsonObj
	 */
	constructor ( jsonObj ) {
		this._data = jsonObj;
		this._version = jsonObj.version;
		this._tiledVersion = jsonObj.tiledversion;
		this._orientation = jsonObj.orientation;
		this._renderOrder = jsonObj.renderorder;
		this._compressionLevel = jsonObj.compressionlevel;
		this._width = jsonObj.width;
		this._height = jsonObj.height;
		this._tileWidth = jsonObj.tilewidth;
		this._tileHeight = jsonObj.tileheight;
		this._infinite = jsonObj.infinite !== 0;
		this._backgroundColor = jsonObj.backgroundcolor;
		this._nextLayerId = jsonObj.nextlayerid;
		this._nextObjectId = jsonObj.nextobjectid;
		this._type = jsonObj.type;

		for ( const layer of jsonObj.layers ) {
			
		}
	}
}

//-----------------------------------------------------------------------------
/**
 * This is a class
 *
 * @class Layer
 */
class Layer {
	
}

//-----------------------------------------------------------------------------
/**
 * This is a class
 *
 * @class TileLayer
 */
class TileLayer {

	/**
	 * Array of chunks (optional). tilelayer only.
	 *
	 * @property chunks
	 * @type Array
	 */
	get chunks () { return this._version; }
	
	/**
	 * map (since 1.0)
	 *
	 * @property type
	 * @type String
	 */
	get type () { return this._type; }

	/**
	 * Cache for images, audio, or any other kind of resource
	 * @param {Object} jsonObj
	 */
	constructor ( jsonObj ) {
		this._data = jsonObj.layers;
		this._version = jsonObj.version;
		this._tiledVersion = jsonObj.tiledversion;
		this._orientation = jsonObj.orientation;
		this._renderOrder = jsonObj.renderorder;
		this._compressionLevel = jsonObj.compressionlevel;
		this._width = jsonObj.width;
		this._height = jsonObj.height;
		this._tileWidth = jsonObj.tilewidth;
		this._tileHeight = jsonObj.tileheight;
		this._infinite = jsonObj.infinite !== 0;
		this._backgroundColor = jsonObj.backgroundcolor;
		this._nextLayerId = jsonObj.nextlayerid;
		this._nextObjectId = jsonObj.nextobjectid;
		this._type = jsonObj.type;

	}
}

module.exports = {
	TiledJsonParser: TiledJsonParser,
	Map: Map,
};
