'use strict';
normalizeArgs.validate = validate;
module.exports = normalizeArgs;
var basename = require('path').basename;
var assert = require('assert');
var defaultRunner = require('./default-runner');

function normalizeArgs(args) {
	var opts = args[0];
	if (typeof opts === 'string') {
		opts = {
			path: opts
		};
		if (typeof args[1] === 'string') {
			opts.relative = args[1];
			opts.run = args[2];
		} else {
			opts.run = args[1];
		}
	}
	var path = validate(opts.path, 'string', 'path');
	var relative = validate(opts.relative || './' + basename(path), 'string', 'relative');
	var run = validate(opts.run || defaultRunner, 'function', 'run');

	return {
		path: path,
		relative: relative,
		run: run
	};
}

function validate(val, type, prop) {
	assert.strictEqual(typeof val, type, 'typeof options.' + prop);
	return val;
}
