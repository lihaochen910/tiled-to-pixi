const zlib = require ( 'zlib' );
const Tile = require ( './Tile' );

class TileLayer extends PIXI.tilemap.CompositeRectTileLayer {

	static FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
	static FLIPPED_VERTICALLY_FLAG = 0x40000000;
	static FLIPPED_DIAGONALLY_FLAG = 0x20000000;

	/**
	 * X coordinate where layer content starts (for infinite maps)
	 *
	 * @property startX
	 * @type Number
	 */
	get startX () { return this.data.startx || 0; }

	/**
	 * Y coordinate where layer content starts (for infinite maps)
	 *
	 * @property startY
	 * @type Number
	 */
	get startY () { return this.data.starty || 0; }

	/**
	 * Cache for images, audio, or any other kind of resource
	 * @param {Object} layerData
	 * @param {TileMap} map
	 */
	constructor ( layerData, map ) {
		super ();

		this.tileSets = map.tileSets;
		this.mapWidth = map.data.width;
		this.mapHeight = map.data.height;
		this.tileWidth = map.data.tilewidth;
		this.tileHeight = map.data.tileheight;
		this.infinite = map.data.infinite;
		this.data = layerData;
		this.map = map;
		this.tiles = new Array ( this.mapWidth * this.mapHeight );
		this.setupLayerProperties ( layerData );
		this.alpha = parseFloat ( layerData.opacity );
		this.setupLayerData ( layerData, layerData.encoding, layerData.compression );
		this.setupLayerTiles ( layerData, this.tileSets );
	}

	setupLayerProperties ( layer ) {
		this.properties = {};
		for ( let property in layer ) {
			if ( layer.hasOwnProperty ( property ) ) {
				this.properties[ property ] = layer[ property ];
			}
		}
	}

	setupLayerData ( layer, encoding, compression ) {

		let tileIndex = 0;
		let tileCount = layer.width * layer.height;
		let tileSets = this.tileSets;
		let mapWidth = this.mapWidth;
		let mapHeight = this.mapHeight;
		let infinite = this.infinite;

		let tilesGid = this.tilesGid = [];
		let chunks = this.chunks = ( !infinite ? null : new Array ( layer.chunks.length ) );
		let chunkIdx = ( !infinite ? null : 0 );

		let horizontalFlips = this.horizontalFlips = new Array ( tileCount );
		let verticalFlips = this.verticalFlips = new Array ( tileCount );
		let diagonalFlips = this.diagonalFlips = new Array ( tileCount );

		let saveTile = function ( gid ) {
			horizontalFlips[ tileIndex ] = !!( gid & TileLayer.FLIPPED_HORIZONTALLY_FLAG );
			verticalFlips[ tileIndex ] = !!( gid & TileLayer.FLIPPED_VERTICALLY_FLAG );
			diagonalFlips[ tileIndex ] = !!( gid & TileLayer.FLIPPED_DIAGONALLY_FLAG );

			gid &= ~( TileLayer.FLIPPED_HORIZONTALLY_FLAG |
				TileLayer.FLIPPED_VERTICALLY_FLAG |
				TileLayer.FLIPPED_DIAGONALLY_FLAG );

			tilesGid[ tileIndex ] = gid;
			
			if ( infinite ) {
				chunks[ chunkIdx ].tiles[ tileIndex - chunks[ chunkIdx ].startIndex ] = findTileSet ( gid, tileSets ).getTileByGid ( gid ) ;
			}

			tileIndex += 1;
		};

		let unpackTileBytes = function ( buf ) {
			let expectedCount = mapWidth * mapHeight * 4;
			if ( !infinite && buf.length !== expectedCount ) {
				console.error ( new Error ( "Expected " + expectedCount +
					" bytes of tile data; received " + buf.length ) );
				return;
			}

			// tileIndex = 0;
			for ( let i = 0; i < ( !infinite ? expectedCount : buf.length ); i += 4 ) {
				saveTile ( buf.readUInt32LE ( i ) );
			}
		};

		switch ( encoding ) {
			case 'xml':
				console.error ( 'xml not support.' );
				break;
			case 'base64':
				switch ( compression ) {
					case '':
						if ( !infinite ) {
							unpackTileBytes ( new Buffer ( layer.data.trim (), encoding ) );
						} else {
							for ( let i = 0; i < layer.chunks.length; i++ ) {

								chunkIdx = i;
								chunks[ chunkIdx ] = {
									x: layer.chunks[ i ].x,
									y: layer.chunks[ i ].y,
									startIndex: tileIndex,
									tiles: new Array ( layer.chunks[ chunkIdx ].data.length )
								};

								unpackTileBytes ( new Buffer ( layer.chunks[ i ].data.trim (), encoding ) );
							}
						}
						break;
					case 'gzip':

						let gunzip = function ( data ) {
							var zipped = new Buffer ( data.trim (), encoding );
							unpackTileBytes ( zlib.gunzipSync ( zipped ) );
						};

						if ( !infinite ) {
							gunzip ( layer.data );
						} else {
							for ( let i = 0; i < layer.chunks.length; i++ ) {

								chunkIdx = i;
								chunks[ chunkIdx ] = {
									x: layer.chunks[ i ].x,
									y: layer.chunks[ i ].y,
									startIndex: tileIndex,
									tiles: new Array ( layer.chunks[ chunkIdx ].data.length )
								};

								gunzip ( layer.chunks[ i ].data );
							}
						}
						break;
					case 'zlib':

						let inflate = function ( data ) {
							var zipped = new Buffer ( data.trim (), encoding );
							unpackTileBytes ( zlib.inflateSync ( zipped ) );
						};

						if ( !infinite ) {
							inflate ( layer.data );
						} else {
							for ( let i = 0; i < layer.chunks.length; i++ ) {

								chunkIdx = i;
								chunks[ chunkIdx ] = {
									x: layer.chunks[ i ].x,
									y: layer.chunks[ i ].y,
									startIndex: tileIndex,
									tiles: new Array ( layer.chunks[ chunkIdx ].data.length )
								};

								inflate ( layer.chunks[ i ].data );
							}
						}
						break;
					case 'zstd':
						// TODO:

						break;
				}
				break;
			case undefined:
			case 'csv':
				if ( !infinite ) {
					layer.data.forEach ( function ( gid ) {
						saveTile ( gid );
					} );
				} else {
					for ( let i = 0; i < layer.chunks.length; i++ ) {

						chunkIdx = i;
						chunks[ chunkIdx ] = {
							x: layer.chunks[ i ].x,
							y: layer.chunks[ i ].y,
							startIndex: tileIndex,
							tiles: new Array ( layer.chunks[ chunkIdx ].data.length )
						};
						
						layer.chunks[ i ].data.forEach ( function ( gid ) {
							saveTile ( gid );
						} );
					}
				}
				break;
		}

		// post resolve tile gid
		for ( let i = 0; i < tilesGid.length; i += 1 ) {
			
			const globalTileId = tilesGid[ i ];
			for ( let tileSetIndex = this.tileSets.length - 1; tileSetIndex >= 0; tileSetIndex -= 1 ) {

				const tileSet = this.tileSets[ tileSetIndex ];
				if ( tileSet.firstGid <= globalTileId ) {

					const tileId = globalTileId - tileSet.firstGid;
					let tile = tileSet.tiles[ tileId ];
					
					if ( !tile ) {
						// implicit tile
						tile = new Tile ( tileId, tileSet );
						tileSet.tiles[ tileId ] = tile;

						console.log ( `tile id: ${tileId}` );

					}
					// tile.gid = globalTileId;
					this.tiles[ i ] = tile;
					break;
				}
			}
		}
	}

	setupLayerTiles ( layer, tileSets ) {
		
		if ( !this.infinite ) {
			for ( let y = 0; y < layer.height; y++ ) {
				for ( let x = 0; x < layer.width; x++ ) {
					let i = x + ( y * layer.width );

					if ( this.tiles[ i ] && this.tiles[ i ].gid && this.tiles[ i ].gid !== 0 ) {

						let tileSet = this.tiles[ i ].tileSet;
						let texture = tileSet.getTileTexture ( this.tiles[ i ] );

						let coodX = x * tileSet.tileWidth + tileSet.tileOffset.x;
						let coodY = y * tileSet.tileHeight + ( tileSet.tileHeight - tileSet.baseTexture.height ) + tileSet.tileOffset.y;

						this.addFrame ( texture, x * tileSet.tileWidth + tileSet.tileOffset.x + this.startX, y * tileSet.tileHeight + tileSet.tileOffset.y + this.startY );
					}
				}
			}
		}
		else {

			let chunkWidth = this.map.properties.editorsettings.chunksize.width;
			let chunkHeight = this.map.properties.editorsettings.chunksize.height;

			for ( let chunkIndex = 0; chunkIndex < this.chunks.length; chunkIndex++ ) {
				
				let chunk = this.chunks[ chunkIndex ];
				for ( let y = 0; y < chunkHeight; y++ ) {
					for ( let x = 0; x < chunkWidth; x++ ) {
						let i = x + ( y * chunkWidth );

						if ( chunk.tiles[ i ] && chunk.tiles[ i ].gid && chunk.tiles[ i ].gid !== 0 ) {

							let tileSet = chunk.tiles[ i ].tileSet;
							let texture = tileSet.getTileTexture ( chunk.tiles[ i ] );

							// let coodX = ( x + chunk.x + this.startX ) * tileSet.tileWidth + tileSet.tileOffset.x;
							let coodX = ( x + chunk.x ) * tileSet.tileWidth + tileSet.tileOffset.x;
							// let coodY = ( y + chunk.y + this.startY ) * tileSet.tileHeight + tileSet.tileOffset.y;
							let coodY = ( y + chunk.y ) * tileSet.tileHeight + tileSet.tileOffset.y;
							
							this.addFrame ( texture, coodX, coodY );
						}
					}
				}
			}
			
		}
	}
	
	findChunk ( tileIndex ) {
		let chunk;
		for ( let i = this.chunks.length - 1; i >= 0; i-- ) {
			chunk = this.chunks[ i ];
			if ( this.chunks.startIndex <= tileIndex ) {
				break;
			}
		}
		return chunk;
	}

	addTile ( tile ) {
		this.addChild ( tile );
	}

	tileAt ( x, y ) {
		return this.tiles[ y * this.mapWidth + x ];
	}

	setTileAt ( x, y, tile ) {
		this.tiles[ y * this.map.width + x ] = tile;
	}
}

function findTileSet ( gid, tileSets ) {
	let tileSet;
	for ( let i = tileSets.length - 1; i >= 0; i-- ) {
		tileSet = tileSets[ i ];
		if ( tileSet.firstGid <= gid ) {
			break;
		}
	}
	return tileSet;
}

module.exports = TileLayer;
