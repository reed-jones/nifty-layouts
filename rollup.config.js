import pkg from './package.json';
import babel from '@rollup/plugin-babel';
import { terser } from "rollup-plugin-terser";
const production = !process.env.ROLLUP_WATCH
export default [
	// browser-friendly UMD build
	{
		input: 'index.js',
		output: {
			name: 'niftyLayouts',
			file: pkg.browser,
			format: 'umd'
		},
        plugins: [
            babel({ babelHelpers: 'bundled' }),
            production && terser()
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'index.js',
		// external: ['ms'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
        ],

        plugins: [
            babel({ babelHelpers: 'bundled' }),
            production && terser()
		]
	}
];
