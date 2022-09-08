module.exports = {
	/*
	 * Remove tokens that are unused in the theme. This consists of tokens with
	 * the 'other' type including 'description' tokens. Ideally it would be possible to
	 * translate description tokens to appear in theme.json as a comment, but they are
	 * ignored for now.
	 */
	'wpvip/filter/other': {
		name: 'wpvip/filter/other',
		matcher: token => {
			const isOtherToken = token.type === 'other';

			return ! isOtherToken;
		},
	},
};
