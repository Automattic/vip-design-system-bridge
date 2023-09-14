const utility = require( '../utility' );

// This is very similar to the built-in StyleDictionary.formatHelpers.minifyDictionary,
// but it does things differently in two ways:
// 1. It converts token heirarchy into kebabCase. Although the 'wpvip/name' transform
//    will convert design token names to kebabCase, the nested structure keys will still
//    retain default camelCase case. This ensures parent structures keys are also kebab-cased.
// 2. For design tokens that have been changed via the 'wpvip/name' transform, this will
//    use the transformed name instead of the original key.
function minifyDictionaryKeepNames( obj ) {
	if ( typeof obj !== 'object' || Array.isArray( obj ) ) {
		return obj;
	}

	const toRet = {};

	if ( obj.hasOwnProperty( 'value' ) ) {
		return obj.value;
	}

	for ( const key in obj ) {
		if ( obj.hasOwnProperty( key ) ) {
			const child = obj[ key ];
			const keyName = child.hasOwnProperty( 'name' ) ? child.name : utility.toKebabCase( key );

			toRet[ keyName ] = minifyDictionaryKeepNames( obj[ key ] );
		}
	}

	return toRet;
}

const themeJsonFormatter = ( { dictionary } ) => {
	return JSON.stringify( minifyDictionaryKeepNames( dictionary.tokens ), null, 2 );
};

/*
 * The nested flag is required to be set on the formatter function to avoid
 * false-positive conflict warnings when outputting nested style dictionary tokens.
 */
themeJsonFormatter.nested = true;

module.exports = {
	'wpvip/format/theme-json': {
		name: 'wpvip/format/theme-json',
		formatter: themeJsonFormatter,
	},
};
