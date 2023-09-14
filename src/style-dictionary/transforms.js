const utility = require( '../utility' );

const fontWeightMap = new Map( [
	[ 'thin', 200 ],
	[ 'extra light', 200 ],
	[ 'light', 300 ],
	[ 'regular', 400 ],
	[ 'medium', 500 ],
	[ 'semi bold', 600 ],
	[ 'bold', 700 ],
	[ 'extra bold', 800 ],
	[ 'black', 900 ],
	[ 'extra black', 900 ],
] );

function isPlainNumber( value ) {
	return ! isNaN( value );
}

module.exports = {
	/*
	 * Handle custom name transforms. All name transforms must be completed in a
	 * single transformation function or name transforms will overwrite each other.
	 */
	'wpvip/name': {
		name: 'wpvip/name',
		type: 'name',
		matcher: () => true,
		transformer: token => {
			const kebabedName = utility.toKebabCase( token.name );

			// Name-specific changes
			if ( kebabedName === 'text-case' ) {
				// Transform 'text-case' to 'text-transform' to better match CSS usage
				return 'text-transform';
			}

			return kebabedName;
		},
	},

	/*
	 * Add 'px' suffix to all number values by default, skipping properties
	 * that are allowed to be bare numbers.
	 */
	'wpvip/size/px': {
		name: 'wpvip/size/px',
		type: 'value',
		matcher: token => {
			const isFontWeight = token.type === 'fontWeight' || token.type === 'fontWeights';

			// To avoid adding suffixes to dynamic values like `clamp(...)`,
			// only add suffix to plain number values.
			const isNumber = isPlainNumber( token.value );

			return isNumber && ! isFontWeight;
		},
		transformer: token => token.original.value.toString() + 'px',
	},

	/*
	 * Transform light/medium/bold-type font weights to the corresponding integer value
	 */
	'wpvip/type/weight': {
		name: 'wpvip/type/weight',
		type: 'value',
		matcher: token => {
			const isValidFontWeight =
				( token.type === 'fontWeight' || token.type === 'fontWeights' ) &&
				fontWeightMap.has( token.value.toString().toLowerCase() );
			return isValidFontWeight;
		},
		transformer: token => fontWeightMap.get( token.value.toString().toLowerCase() ),
	},

	/*
	 * Convert boxShadow types to CSS-compatible box shadow value
	 */
	'wpvip/box-shadow': {
		name: 'wpvip/box-shadow',
		type: 'value',
		matcher: token => {
			const isTokenBoxShadow = token.attributes.category === 'shadow';

			return isTokenBoxShadow;
		},
		transformer: token => {
			if ( ! Array.isArray( token.value ) ) {
				// 'description' tokens haven't been filtered yet.
				// If this token is not an array, skip it and it will be filtered later.
				return token.value;
			}

			const shadowParts = [];

			token.value.forEach( shadowObject => {
				const { x: positionX, y: positionY, blur, spread, color } = shadowObject;

				shadowParts.push(
					`${ positionX }px ${ positionY }px ${ blur }px ${ spread }px ${ color }`
				);
			} );

			return shadowParts.join( ', ' );
		},
	},

	/*
	 * Use to debug tokens during transformation
	 */
	'wpvip/debug-transform': {
		name: 'wpvip/debug-transform',
		type: 'value',
		matcher: () => true,
		transformer( token ) {
			// Add logging for incoming tokens here if desired
			return token.value;
		},
	},
};
