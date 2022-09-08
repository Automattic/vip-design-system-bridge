const fs = require( 'fs' ).promises;
const os = require( 'os' );
const path = require( 'path' );
const chalk = require( 'chalk' );

async function getJsonFromPath( filePath ) {
	const tokenJson = await fs.readFile( filePath, 'utf8' );
	return JSON.parse( tokenJson );
}

/*
 * Handle loading tokens from an individual token file, or an
 * exported directory of token files.
 */
async function getTokensFromPath( tokenJsonPath ) {
	const pathStat = await fs.lstat( tokenJsonPath );

	if ( pathStat.isFile() ) {
		return getJsonFromPath( tokenJsonPath );
	} else if ( pathStat.isDirectory() ) {
		const filesInPath = await fs.readdir( tokenJsonPath, { withFileTypes: true } );
		const jsonTokenFileEntries = filesInPath.filter( dirent => dirent.isFile() && dirent.name.endsWith( '.json' ) );

		if ( jsonTokenFileEntries.length === 0 ) {
			throwError( `No .json files found in token directory ${ tokenJsonPath }` );
		}

		const combinedTokens = {};
		for ( const dirent of jsonTokenFileEntries ) {
			const tokenSetName = path.parse( dirent.name ).name;
			const tokenFilePath = path.join( tokenJsonPath, dirent.name );

			combinedTokens[ tokenSetName ] = await getJsonFromPath( tokenFilePath );
		}

		return combinedTokens;
	}
}

async function outputThemeJson( themeJson, outputPath ) {
	const themeJsonString = JSON.stringify( themeJson, null, '\t' );
	await fs.writeFile( outputPath, themeJsonString );
}

async function fileExists( filePath ) {
	const pathStat = await fs.stat( filePath ).catch( () => false );

	return !! pathStat;
}

function resolvePath( filePath ) {
	let resolvedPath = filePath;

	if ( typeof ( filePath ) === 'string' && filePath.startsWith( '~/' ) || filePath === '~' ) {
		resolvedPath = filePath.replace( '~', os.homedir() );
	}

	return path.resolve( resolvedPath );
}

function toKebabCase( string ) {
	return string
		.replace( /([a-z])([A-Z])/g, '$1-$2' )
		.replace( /[\s_]+/g, '-' )
		.toLowerCase();
}

async function throwErrorForFileNotExisting( filePath, message ) {
	if ( ! await fileExists( filePath ) ) {
		throwError( `${ message } ${ filePath }` );
	}
}

function throwError( message ) {
	console.error( chalk.red( `Error: ${ message } ` ) );
	process.exit( 1 );
}

function getThemeSets( tokenJson, themeName ) {
	const themes = tokenJson?.$themes;

	if ( ! themes ) {
		throwError( `Required key $themes not found in token JSON, cannot use theme ${ themeName }` );
	}

	const selectedThemes = themes.filter( theme => theme.name === themeName );

	if ( selectedThemes.length === 0 ) {
		const allThemes = themes.map( theme => theme.name );

		throwError( `Theme '${ themeName }' not found in tokens, theme must be one of ${ allThemes.join( ', ' ) }` );
	}

	const allTokenSets = selectedThemes[ 0 ].selectedTokenSets;

	// Get names of token sets with type 'source'
	const sourceSets = Object.entries( allTokenSets ).filter(
		( [ tokenSetName, tokenSetType ] ) => tokenSetType === 'source'
	).map(
		( [ tokenSetName, tokenSetType ] ) => tokenSetName
	);

	// Get names of token sets with type 'enabled'
	const enabledSets = Object.entries( allTokenSets ).filter(
		( [ tokenSetName, tokenSetType ] ) => tokenSetType === 'enabled'
	).map(
		( [ tokenSetName, tokenSetType ] ) => tokenSetName
	);

	const selectedSets = [
		// Order any token sets marked 'source' first for use with token-transformer
		...sourceSets,
		...enabledSets,
	];

	return {
		sourceSets,
		selectedSets,
	};
}

module.exports = {
	getJsonFromPath,
	getTokensFromPath,
	outputThemeJson,
	fileExists,
	resolvePath,
	toKebabCase,
	throwError,
	throwErrorForFileNotExisting,
	getThemeSets,
};
