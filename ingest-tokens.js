#!/usr/bin/env node

const commander = require( 'commander' );
const fs = require( 'fs' ).promises;
const path = require( 'path' );
const cp = require( 'child_process' );
const chalk = require( 'chalk' );
const styleDictionary = require( './style-dictionary/main' );
const utility = require( './utility' );

const transformerFilePath = 'build/transformed-tokens.json';
const generatedThemeFileName = 'theme.generated.json';
const themeFileName = 'theme.json';

commander
	.version( '0.5.0', '-v, --version' )
	.description( 'Inject the tokens from the provided Figma export into theme.json' )
	.usage( '[OPTIONS]...' )
	.requiredOption( '--tokenPath <path>', 'path to token JSON file or directory' )
	.requiredOption( '--theme <theme-name>', 'selected $themes set in token JSON' )
	.requiredOption( '--themePath <path>', 'path to a WordPress theme' )
	.option( '--themeJsonSection <prefix>', 'section to insert tokens into theme.json->settings->custom', '' )
	.option( '--overwrite', 'overwrite existing theme.json', false )
	.parse( process.argv );

ingestTokens( commander.opts() );

async function ingestTokens( options ) {
	const tokenPath = utility.resolvePath( options.tokenPath );
	utility.throwErrorForFileNotExisting( tokenPath, 'No core tokens found for path:' );

	const tokenJson = await utility.getTokensFromPath( tokenPath );
	const { selectedSets, sourceSets } = utility.getThemeSets( tokenJson, options.theme );

	const themeDirectory = utility.resolvePath( options.themePath );
	const themeJsonPath = path.join( themeDirectory, themeFileName );
	utility.throwErrorForFileNotExisting( themeJsonPath, 'No theme.json found for path:' );
	utility.throwErrorForFileNotExisting( tokenPath, 'No core tokens found for path:' );

	const themeJsonBuffer = await fs.readFile( themeJsonPath );
	const themeJson = JSON.parse( themeJsonBuffer.toString() );

	const tokenTransformerArgs = [ 'token-transformer', `${ tokenPath }`, `${ transformerFilePath }`, '--throwErrorWhenNotResolved', '--expandTypography=true', selectedSets, sourceSets ];

	const transformResult = cp.spawnSync( 'npx', tokenTransformerArgs );

	if ( transformResult.status > 0 ) {
		console.log( [ 'npx', ...tokenTransformerArgs ].join( ' ' ) );

		let errorString = transformResult.stderr.toString();
		console.error( '\n' );
		// Assumption is that the massive minified code is dumped first, followed by the actual error
		errorString = errorString.substring( errorString.indexOf( 'Error:' ) );
		console.error( errorString );
		utility.throwError( 'Unable to process the token file provided. Please review any errors logged above, verify that it is valid.' );
	} else {
		console.log( chalk.green( '✔︎ Processed with token-transformer' ) );
	}

	const builtTokens = await styleDictionary.getProcessedTokens( transformerFilePath );

	console.log( '\n' + chalk.green( '✔︎ Processed with Style Dictionary' ) );

	if ( options.themeJsonSection ) {
		themeJson.settings.custom[ options.themeJsonSection ] = {
			...builtTokens,
		};
	} else {
		themeJson.settings.custom = {
			...themeJson.settings.custom,
			...builtTokens,
		};
	}

	const outputThemeFile = options.overwrite ? themeFileName : generatedThemeFileName;
	const generatedThemeJsonPath = path.join( themeDirectory, outputThemeFile );

	await utility.outputThemeJson( themeJson, generatedThemeJsonPath );

	console.log( chalk.green( `✔︎ Wrote theme file: ${ generatedThemeJsonPath }` ) );
}
