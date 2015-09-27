/* eslint global-require: 0 */
'use strict';
var path = require('path');
var resolve = require('resolve');
var caller = require('caller');
var runAsync = require('run-async');
var assert = require('assert');

module.exports = function (opts, cliPathArg, globalPathArg) {
	if (typeof opts === 'string') {
		opts = {
			module: opts,
			cliPath: cliPathArg,
			globalCliPath: globalPathArg
		};
	}
	var moduleName = validate(opts.module, 'string', 'module');

	var local = opts.localCliPath || opts.cliPath;
	validate(local, 'string', 'cliPath|localCliPath');

	var global = opts.globalCliPath || local;
	validate(local, 'string', 'globalCliPath');

	var beforeFn = validate(opts.before || noop, 'function', 'before');
	var requireFn = validate(opts.require || require, 'function', 'require');
	var runFn = validate(opts.run || returnThirdArg, 'function', 'run');
	var afterFn = validate(opts.after || noop, 'function', 'after');

	var cliPath;
	var location;
	var cliModule;

	try {
		cliPath = resolve.sync(path.join(moduleName, local), {basedir: process.cwd()});
		location = 'local';
	} catch (e) {
		try {
			cliPath = resolve.sync(global, {basedir: path.join(path.dirname(caller()))});
			location = 'global';
		} catch (e) {
			throw new Error('fallback-cli could not find global', e);
		}
	}

	runAsync(beforeFn, doRequire, location, cliPath);

	function doRequire(beforeResult) {
		runAsync(requireFn, setCliModule, cliPath);

		function setCliModule(requireResult) {
			cliModule = requireResult;
			run(beforeResult);
		}
	}

	function run(result) {
		runAsync(runFn, after, location, cliModule, result);
	}

	function after(result) {
		runAsync(afterFn, noop, location, cliModule, result);
	}
};

function noop() {}

function returnThirdArg(a, b, c) {
	return c;
}

function validate(val, type, prop) {
	assert.strictEqual(typeof val, type, 'typeof options.' + prop);
	return val;
}
