let 
	gulp = require('gulp'),
	fs = require('fs'),
	glob = require('glob'),
	path = require('path'),
	cleanCSS = require('gulp-clean-css')
;

const srcDest = '../../src/scss/palettes/*.scss';
const releaseDest = '../../dist/css';

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
	var res = line
		.replace('$','')
		.replace(';','');
	let itemArray = res.split(":");
	let key = itemArray[0];
	let value = itemArray[1];

	return {
		key: key,
		value: value
	}

}

function genCssRule( obj ) {
	return `
		.${obj.key}-bg {
			background-color:${obj.value};
		}
		.${obj.key}-clr {
			color:${obj.value};
		}
		.${obj.key}-brd {
			border-color:${obj.value};
		}
	`.replace('\r','');
}

gulp.task('createcss', () => {
	clear();
	return glob(srcDest, function (e, files ) {

		files.forEach ( f => {

			parseFile ( f , function ( dataArray ) {
				var distFilePath = '';
				var fileName = '';
				var rules = [];

				dataArray.forEach ( data => {
					var s = parseLine( data );
					fileName = path.basename(f).replace('scss','css');
					distFilePath = `${releaseDest}/${fileName}`;
					rules.push(genCssRule(s));
				})

				fs.writeFile(distFilePath, rules.join('').replace(/[\r\t]/g,''), (err) => {
					if (err) throw err;
					gulp.src(distFilePath)
							.pipe(cleanCSS())
							.pipe(gulp.dest(`${releaseDest}/min`));
				});

			});
		});
	});
});



gulp.task('default', 
	gulp.series(
		[ 
			'createcss'
		]
	)
);