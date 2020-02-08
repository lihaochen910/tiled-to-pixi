const path = require ( 'path' );

const Tile = require ( './Tile' );
const TileSet = require ( './TileSet' );
const TileLayer = require ( './TileLayer' );
const ImageLayer = require ( './ImageLayer' );
const ObjectLayer = require ( './ObjectLayer' );
const GroupLayer = require ( './GroupLayer' );
const CollisionLayer = require ( './CollisionLayer' );

// configure constants to switch it off and use 16 textures directly, without re-uploading
PIXI.tilemap.Constant.boundCountPerBuffer = 1;
PIXI.tilemap.Constant.maxTextures = 16;

class TiledMap extends PIXI.Container {

	constructor ( resourceId ) {
		super ();

		let resource = PIXI.loader.resources[ resourceId ];
		let route = path.dirname ( resource.url );

		this.data = resource.data;

		// map properties
		this.setupDataProperties ( resource.data );

		// map background
		this.backgroundLayer = this.createBackgroundLayer ();
		this.addLayer ( this.backgroundLayer );
		
		// map tilesets
		this.setupDataTileSets ( resource.data, route );
		
		// map layers
		this.setupDataLayers ( resource.data, route );
	}

	setupDataProperties ( data ) {
		this.properties = {};
		for ( let property in data ) {
			if ( data.hasOwnProperty ( property ) ) {
				this.properties[ property ] = data[ property ];
			}
		}
	}

	createBackgroundLayer () {
		let background = new PIXI.Graphics ();
		background.beginFill ( 0x000000, 0 );
		background.drawRect ( 0, 0, this.data.width * this.data.tileWidth, this.data.height * this.data.tileHeight );
		background.endFill ();
		return background;
	}

	setupDataTileSets ( data, route ) {
		this.tileSets = [];
		data.tilesets.forEach ( function ( tileSetData ) {
			this.tileSets.push ( new TileSet ( route, tileSetData ) );
		}, this );
	}

	setupDataLayers ( data, route ) {
		
		let layerIndex = 0;
		
		this.layers = {};
		data.layers.forEach ( function ( layerData ) {
			switch ( layerData.type ) {
				case 'tilelayer':
					let tileLayer = new TileLayer ( layerData, this );
					this.layers[ layerData.name ] = tileLayer;
					this.addLayer ( tileLayer, layerIndex );
					break;
				case 'imagelayer':
					let imageLayer = new ImageLayer ( layerData, route );
					this.layers[ layerData.name ] = imageLayer;
					this.addLayer ( imageLayer, layerIndex );
					break;
				case 'objectgroup':
					let objLayer = new ObjectLayer ( layerData );
					this.layers[ layerData.name ] = objLayer;
					break;
				case 'group':
					let groupLayer = new GroupLayer ( layerData );
					this.layers[ layerData.name ] = groupLayer;
					break;
				default:
					this.layers[ layerData.name ] = layerData
			}
			
			layerIndex++;
		}, this );
	}

	addLayer ( layer, layerIndex ) {
		// let zLayer = new PIXI.tilemap.ZLayer ( this, layerIndex );
		// zLayer.addChild ( layer );
		this.addChild ( layer );
	}
	
}

Object.assign ( PIXI.tilemap, { TiledMap } );

module.exports = TiledMap;
