import fs from 'fs';
import path from 'path';
import * as csv from 'csv';

function formatCSV(file, options) {
	console.log(file);
	fs.createReadStream(`${file}`)
		.pipe(csv.parse({ delimiter: ',', columns: true }))
		.pipe(
			csv.transform((input) =>
				Object.assign({
					'Device Serial Number': input['Device Serial Number'],
					'Windows Product ID': input['Windows Product ID'],
					'Hardware Hash': input['Hardware Hash'],
				})
			)
		)
		.pipe(csv.stringify({ header: true }))
		.pipe(fs.createWriteStream(`${options.out}/${file}`))
		.on('finish', () => {
			console.log('Done 🍻 ');
		});
}

export async function main(options) {
	fs.mkdir(options.out, { recursive: true }, function (err) {
		if (err) {
			return console.log('Unable to create directory: ' + err);
		}
	});
	if (path.extname(options.path) == '') {
		fs.readdir(options.path, function (err, files) {
			if (err) {
				return console.log('Unable to scan directory: ' + err);
			}
			files.forEach(async function (file) {
				if (path.extname(file) === '.csv') {
					if (file.match(/(AutoPilot)/g) || options.force) {
						formatCSV(file, options);
					}
				}
			});
		});
	} else {
		formatCSV(options.path, options);
	}
}
