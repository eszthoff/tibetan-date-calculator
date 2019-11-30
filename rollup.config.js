import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.ts',
    output: {
      file: pkg.browser,
      format: 'umd',
      name: 'tibetanCalendarCalculator'
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        useTsconfigDeclarationDir: true,
      }),
    ]
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.ts',
    plugins: [
      resolve(),
      typescript({
        useTsconfigDeclarationDir: true,
      }),
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ]
  }
];
