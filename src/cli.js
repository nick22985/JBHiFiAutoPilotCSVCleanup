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
				'--force': Boolean,
				'-p': '--path',
				'-o': '--out',
				'-f': '--force',
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
			force: args['--force'] || false,
			version: args['--version'] || false,
			help: args['--help'] || false,
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
	if (options.help) {
		console.log(`
Usage:
	jb [options]

	Description:
		This is a tool that makes the JB CSV files able to be easily uploaded to microsoft.

	Default:
		If no options are passed, the tool will look for all CSV files that have autopilot in there names this can be overridden with --force in the current directory and convert them to JB CSV files and make new files in /out in the current directory.

Options:
	-p, --path <path> [String] [Default: {Current Directory}] The path to the directory / file you want to convert.
	-o, --out <path> [String] [Default: {Current Directory}/out] The path to the directory you want to put the converted files in.
	-f, --force [Boolean] [Default: false] If true, the tool will convert all CSV files in the current directory.
	-h, --help [Boolean] [Default: false] If true, the tool will print this help message.
	-v, --version [Boolean] [Default: false] If true, the tool will print the version number.
		`);
		process.exit(1);
	}
	await main(options);
}
