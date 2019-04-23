let gulp = require("gulp"),
	fs = require("fs"),
	glob = require("glob"),
	path = require("path"),
	cleanCSS = require("gulp-clean-css");

const srcDest = "../../src/scss/palettes/*.scss";
const releaseDest = "../../dist/css";

function clear() {
	console.log("\x1Bc");
}

function parseFile(f, onReadSuccess) {
	fs.readFile(f, "utf8", (err, data) => {
		if (err) throw err;
		onReadSuccess(data.toString().split("\n"));
	});
}

function parseLine(line) {
	var res = line.replace("$", "").replace(";", "");
	let itemArray = res.split(":");
	let key = itemArray[0];
	let value = itemArray[1];

	return {
		key: key,
		value: value
	};
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
	`.replace("\r", "");
}

gulp.task("create", () => {
	clear();
	var palettes = [];

	return glob(srcDest, function(e, files) {
		// each files
		files.forEach(f => {
			// get data from file
			parseFile(f, function(dataArray) {
				let distFilePath = "";
				let fileName = "";
				let rules = [];
				let dataSrc = [];
				let dataItem = {
					name: "",
					items: []
				};

				dataArray.forEach(data => {
					if (data.length === 0) {
						return;
					}
					let parsedObject = parseLine(data);
					console.log(data);
					fileName = path.basename(f).replace("scss", "css");
					distFilePath = `${releaseDest}/${fileName}`;
					rules.push(genCssRule(parsedObject));
					dataItem.name = fileName.split(".")[0].trim();
					if (parsedObject.key.length > 0) {
						let obj = {
							key: parsedObject.key,
							value: parsedObject.value.replace("\r", "")
						};
						dataSrc.push({ obj });
					}
				});

				dataItem.items = dataSrc;
				var p = {
					name: dataItem.name,
					data: dataItem.items
				};
				palettes.push(p);

				let fileContent = rules.join("").replace(/[\r\t]/g, "");

				fs.writeFile(
					`../../dist/data/${dataItem.name}.json`,
					JSON.stringify(dataItem),
					err => {
						if (err) throw err;
					}
				);

				fs.writeFile(distFilePath, fileContent, err => {
					if (err) throw err;
					gulp
						.src(distFilePath)
						.pipe(cleanCSS())
						.pipe(gulp.dest(`${releaseDest}/min`));
				});

				fs.writeFile(
					`../../dist/data/palettes.json`,
					JSON.stringify(palettes),
					err => {
						if (err) throw err;
					}
				);
			});
		});
	});
});

gulp.task("default", gulp.series(["create"]));
