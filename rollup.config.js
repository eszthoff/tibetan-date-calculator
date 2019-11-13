import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { DEFAULT_EXTENSIONS } from '@babel/core';
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
      typescript(),
      babel({
        exclude: ['node_modules/**'],
        plugins: ['external-helpers'],
        extensions: [
          ...DEFAULT_EXTENSIONS,
          '.ts'
        ]
      })
    ]
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.js',
    plugins: [
      resolve(),
      typescript(),
      babel({
        exclude: ['node_modules/**'],
        plugins: ['external-helpers'],
        extensions: [
          ...DEFAULT_EXTENSIONS,
          '.ts'
        ]
      })
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ]
  }];
