var gulp = require('gulp');
var fs = require('fs');
var glob = require('glob');
const srcDest = '../../src/scss/palettes/*.scss';
const releaseDest = '../../dist/css/';

function clear() {
	console.log('\x1Bc');
}

function parseFile (f , onReadSuccess) {
	fs.readFile(f, 'utf8', (err, data) => {
		if (err) throw err;
		onReadSuccess (data.toString().split("\n"));
	  });
}

function parseLine (line) {
	var keyValuePair = line.split('$')[1].split(':');
	var key = keyValuePair[0];
	var value = keyValuePair[1].replace(';','');
	return {
		key: key,
		value:value
	};
}

let d = [];

gulp.task('default', function() {
	clear();
	return glob(srcDest, function (e, files ) {

		files.forEach ( f => {

			parseFile ( f , function ( data) {
				data.forEach ( d => {
					var s = parseLine( d );
					d.push(s);
					console.log (d.length);
				})

			});

		});

	});
});
