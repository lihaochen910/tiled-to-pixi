const express = require ( 'express' );
const path = require ( 'path' );
const app = express ();

const PORT = process.env.PORT || 3000;

app.use ( express.static ( 'test' ) );
app.get ( '/', function ( req, res ) {
	res.sendFile ( path.join ( __dirname, '../test/', 'index.html' ) );
	console.log ( __dirname )
} );

app.listen ( PORT, function () {
	console.log ( 'Game online! Open localhost:' + PORT )
} );
