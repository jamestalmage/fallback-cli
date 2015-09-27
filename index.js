/* eslint global-require: 0 */
'use strict';
var path = require('path');
var resolve = require('resolve');
var caller = require('caller');
var runAsync = require('run-async');

module.exports = function (opts) {
	var moduleName = opts.module;
	var local = opts.localCliPath || opts.cliPath;
	var global = opts.globalCliPath || local;
	var beforeFn = opts.before || noop;
	var runFn = opts.run || returnThirdArg;
	var afterFn = opts.after || noop;
	var requireFn = opts.require || require;

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
