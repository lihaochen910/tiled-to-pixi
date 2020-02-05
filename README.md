# Tiled to Pixi
Transforms a Tiled tmx map to a Pixi container work in progress.

## How to use Tiled to Pixi
Load your .json file and the necessary assets to render the maps using PIXI.Loader, and let the module do the rest!

### Features:
* support infinite map.
* support csv/zlib/gzip format.

```javascript
const PIXI = require ( 'pixi.js' );
require ( 'pixi-tilemap.js' );
require ( 'tiled-to-pixi' );

const app = new PIXI.Application ();
document.body.appendChild ( app.view );

PIXI.loader
    .add ( [
        'assets/maps/map001.json',
        'assets/img/tilesets/mm1_gnd_world.png',
        'assets/img/tilesets/mm1_locate_general.png'
    ] )
    .load ( function () {
        /**
         *   PIXI.tilemap.TiledMap() is an extended PIXI.Container()
         *   so you can render it right away
         */
        let tileMap = new PIXI.tilemap.TiledMap ( 'assets/maps/map001.json' );

        renderer.render ( tileMap );
    } );
```

How to test this example:
> npm install  
> npm run-script test  

After that, you will find the html file in *tiled-to-pixi/test* directory

You can also find a simple example in the test folder, or a more complete example at https://lihaochen910.github.io/RPGMakerProject/

## License
MIT © [Kanbaru](http://twitter.com/kanbaru_chen/)
