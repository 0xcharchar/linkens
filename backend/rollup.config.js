import dotenv from 'dotenv'
dotenv.config()

import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';
import json from '@rollup/plugin-json'
import sveltePreprocess from 'svelte-preprocess'

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'template/src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'template/public/build/bundle.js'
	},

	plugins: [
		svelte({
      preprocess: sveltePreprocess({
        sourceMap: !production,
        replace: [
          ['process.env.ENS_REGISTRY_ADDRESS', JSON.stringify(process.env.ENS_REGISTRY_ADDRESS)],
          ['process.env.ENS_NODE', JSON.stringify(process.env.ENS_NODE)],
          ['process.env.ALCHEMY_API_KEY', JSON.stringify(process.env.ALCHEMY_API_KEY)],
        ]
      }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),

		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),
    json(),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('template/public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
