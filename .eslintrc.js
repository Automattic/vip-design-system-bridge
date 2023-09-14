require( '@automattic/eslint-plugin-wpvip/init' );

module.exports = {
	extends: [ 'plugin:@automattic/wpvip/recommended', 'plugin:@automattic/wpvip/cli' ],
	root: true,
	rules: {
		'security/detect-non-literal-fs-filename': 'off',
		'security/detect-object-injection': 'off',

		'no-await-in-loop': 'off',
		'no-console': 'off',
	},
};
