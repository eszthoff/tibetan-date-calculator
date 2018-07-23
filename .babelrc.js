const { BABEL_ENV, NODE_ENV } = process.env;

const cjs = BABEL_ENV === 'cjs' || NODE_ENV === 'test';

module.exports = {
	presets: [
		['env', { loose: true, modules: false }]
	],
	plugins: [
		"transform-object-rest-spread",
		"external-helpers",
		cjs && 'transform-es2015-modules-commonjs'
	].filter(Boolean)
};
