const StyleDictionary = require( 'style-dictionary' );

const transforms = require( './transforms' );
const filters = require( './filters' );
const formats = require( './formats' );
const utility = require( '../utility' );

async function getProcessedTokens( tokenPath ) {
	const styleDictionary = StyleDictionary.extend( {
		source: [ tokenPath ],
		platforms: {
			'wordpress-theme-json': {
				transformGroup: 'wpvip/transform-group/theme-json',
				buildPath: 'src/build/',
				files: [ {
					filter: 'wpvip/filter/other',
					format: 'wpvip/format/theme-json',
					destination: 'tokens.json',
				} ],
			},
		},
	} );

	registerFilters( styleDictionary );
	registerTransforms( styleDictionary );
	registerFormats( styleDictionary );

	styleDictionary.registerTransformGroup( {
		name: 'wpvip/transform-group/theme-json',
		transforms: [
			/* Add token category, type, item, subitem, and state attribute metadata for other transforms */
			'attribute/cti',

			/* Transform unicode characters to CSS-friendly hex entities */
			'content/icon',

			// See ./transforms.js for documentation of wpvip/ transforms
			'wpvip/name',
			'wpvip/size/px',
			'wpvip/size/rem',
			'wpvip/type/rem',
			'wpvip/type/weight',
			'wpvip/box-shadow',
		],
	} );

	styleDictionary.buildAllPlatforms();

	// If successful, buildAllPlatforms() creates a built tokens file at the configured location
	const builtTokensPath = './src/build/tokens.json';

	if ( ! await utility.fileExists( builtTokensPath ) ) {
		utility.throwError( 'Style dictionary failed to build tokens' );
	}

	return await utility.getJsonFromPath( builtTokensPath );
}

function registerFilters( styleDictionary ) {
	for ( const filterName in filters ) {
		const transform = filters[ filterName ];
		styleDictionary.registerFilter( transform );
	}
}

function registerTransforms( styleDictionary ) {
	for ( const transformName in transforms ) {
		const transform = transforms[ transformName ];
		styleDictionary.registerTransform( transform );
	}
}

function registerFormats( styleDictionary ) {
	for ( const formatName in formats ) {
		const transform = formats[ formatName ];
		styleDictionary.registerFormat( transform );
	}
}

module.exports = {
	getProcessedTokens,
};
