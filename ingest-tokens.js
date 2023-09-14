#!/usr/bin/env node

const commander = require( 'commander' );
const fs = require( 'fs' ).promises;
const path = require( 'path' );
const cp = require( 'child_process' );
const chalk = require( 'chalk' );
const styleDictionary = require( './src/style-dictionary/main' );
const utility = require( './src/utility' );

const transformerFilePath = 'src/build/transformed-tokens.json';
const generatedThemeFileName = 'theme.generated.json';
const themeFileName = 'theme.json';

commander
	.version( '1.0.0', '-v, --version' )
	.description( 'Inject the tokens from the provided Design System export into theme.json. Providing a JSON file or directory automatically assumes Figma is the source for the Design System export.' )
	.usage( '[OPTIONS]...' )
	.requiredOption( '--tokenPath <path>', 'path to token JSON/CSS file or directory' )
	.requiredOption( '--themePath <path>', 'path to a WordPress theme' )
	.option( '--sourceSet <theme-name>', '(FIGMA ONLY) NON-PRO PLUGIN OPTION: source set in the token JSON' )
	.option(
		'--layerSets <theme-name>',
		'(FIGMA ONLY) NON-PRO PLUGIN OPTION: layers built using the source set in token JSON'
	)
	.option( '--theme <theme-name>', '(FIGMA ONLY) PRO PLUGIN OPTION: selected $themes set in token JSON' )
	.option(
		'--themeJsonSection <prefix>',
		'section to insert tokens into theme.json->settings->custom',
		''
	)
	.option( '--overwrite', 'overwrite existing theme.json', false )
	.parse( process.argv );

ingestTokens( commander.opts() );

async function ingestTokens( options ) {
	const tokenPath = utility.resolvePath( options.tokenPath );
	utility.throwErrorForFileNotExisting( tokenPath, 'No core tokens found for path:' );

	const tokenJson = await utility.getTokensFromPath( tokenPath );
	const { enabledSets, sourceSets } = utility.getThemeSets(
		tokenJson,
		options.sourceSet,
		options.layerSets,
		options.theme
	);

	const themeDirectory = utility.resolvePath( options.themePath );
	const themeJsonPath = path.join( themeDirectory, themeFileName );
	utility.throwErrorForFileNotExisting( themeJsonPath, 'No theme.json found for path:' );
	utility.throwErrorForFileNotExisting( tokenPath, 'No core tokens found for path:' );

	const themeJsonBuffer = await fs.readFile( themeJsonPath );
	const themeJson = JSON.parse( themeJsonBuffer.toString() );

	const tokenTransformerArgs = [
		'token-transformer',
		`${ tokenPath }`,
		`${ transformerFilePath }`,
		'--throwErrorWhenNotResolved',
		'--expandTypography=true',
	];

	// Just the source sets are present
	if ( enabledSets && enabledSets.length === 0 ) {
		tokenTransformerArgs.push( sourceSets );
	} else {
		const selectedSets = [
			// Order the source token sets first for use with token-transformer
			...sourceSets,
			...enabledSets,
		];

		tokenTransformerArgs.push( selectedSets, sourceSets );
	}

	const transformResult = cp.spawnSync( 'npx', tokenTransformerArgs );

	if ( transformResult.status > 0 ) {
		console.log( [ 'npx', ...tokenTransformerArgs ].join( ' ' ) );

		let errorString = transformResult.stderr.toString();
		console.error( '\n' );
		// Assumption is that the massive minified code is dumped first, followed by the actual error
		errorString = errorString.substring( errorString.indexOf( 'Error:' ) );
		console.error( errorString );
		utility.throwError(
			'Unable to process the token file provided. Please review any errors logged above, verify that it is valid.'
		);
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
