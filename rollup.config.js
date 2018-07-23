import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

export default {
	input: 'src/index.js',
	plugins: [
		resolve(),
		babel({
			exclude: ['node_modules/**']
		})
	],
	output: [
		{ file: pkg.main, format: 'cjs' },
		{ file: pkg.module, format: 'es' },
	]
};
