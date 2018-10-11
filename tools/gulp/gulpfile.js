let
	gulp = require('gulp'),
	fs = require('fs'),
	glob = require('glob'),
	path = require('path'),
	cleanCSS = require('gulp-clean-css');

const srcDest = '../../src/scss/palettes/*.scss';
const releaseDest = '../../dist/css';

function clear() {
	console.log('\x1Bc');
}

function parseFile(f, onReadSuccess) {
	fs.readFile(f, 'utf8', (err, data) => {
		if (err) throw err;
		onReadSuccess(data.toString().split("\n"));
	});
}

function parseLine(line) {
	var res = line
		.replace('$', '')
		.replace(';', '');
	let itemArray = res.split(":");
	let key = itemArray[0];
	let value = itemArray[1];

	return {
		key: key,
		value: value
	}

}

function genCssRule(obj) {
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
	`.replace('\r', '');
}

gulp.task('create', () => {
	clear();
	// search filesn in destination dir
	return glob(srcDest, function (e, files) {
		// each files
		files.forEach(f => {
			// get data from file
			parseFile(f, function (dataArray) {
				let distFilePath = '';
				let fileName = '';
				let rules = [];
				let dataSrc = [];
				let dataItem = {
					name: '',
					items: []
				};

				dataArray.forEach(data => {
					let parsedObject = parseLine(data);
					fileName = path.basename(f).replace('scss', 'css');
					distFilePath = `${releaseDest}/${fileName}`;
					rules.push(genCssRule(parsedObject));
					dataItem.name = fileName
					dataSrc.push({
						key: parsedObject.key,
						value: parsedObject.value.replace('\r', '')
					});
				})

				dataItem.items = dataSrc;

				let fileContent = rules.join('').replace(/[\r\t]/g, '');

				fs.writeFile(`../../dist/data/${dataItem.name.replace('.css','.json')}`, JSON.stringify(dataItem), (err) => {
					if (err) throw err;
				});

				fs.writeFile(distFilePath, fileContent, (err) => {
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
			'create'
		]
	)
);
