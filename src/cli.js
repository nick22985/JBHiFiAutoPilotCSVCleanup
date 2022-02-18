import arg from 'arg';
import inquirer from 'inquirer';
import { main } from './main';
import pjson from '../package.json';

export function parseArgumentsOptions(argv) {
	try {
		const args = arg(
			{
				'--path': String,
				'--out': String,
				'--help': Boolean,
				'--version': Boolean,
				'-p': '--path',
				'-o': '--out',
				'-h': '--help',
				'-v': '--version',
			},
			{
				argv: argv.slice(2),
			}
		);
		return {
			path: args['--path'] || process.cwd(),
			out: args['--out'] || `${process.cwd()}/out`,
			version: args['--version'] || false,
		};
	} catch (e) {
		console.log(e);
		process.exit(1);
	}
}

export async function cli(args) {
	let options = parseArgumentsOptions(args);
	if (options.version) {
		console.log(`v${version}`);
		process.exit(1);
	}
	await main(options);
}
