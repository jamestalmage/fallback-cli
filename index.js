/* eslint global-require: 0 */
'use strict';
var dirname = require('path').dirname;
var resolve = require('resolve');
var caller = require('caller');
var runAsync = require('run-async');
var normalizeArgs = require('./normalize-args');

module.exports = function (opts) {
	opts = normalizeArgs(arguments);

	var cliPath;
	var location;

	try {
		cliPath = resolveSync(opts.path, process.cwd());
		location = 'local';
	} catch (e) {
		try {
			cliPath = resolveSync(opts.relative, dirname(caller()));
			location = 'global';
		} catch (e) {
			throw new Error('fallback-cli could not find global', e);
		}
	}

	runAsync(opts.before, doRequire, location, cliPath);

	function doRequire(beforeResult) {
		runAsync(opts.require, setCliModule, cliPath);

		function setCliModule(requireResult) {
			opts.run(location, requireResult, beforeResult);
		}
	}
};

function resolveSync(path, basedir) {
	return resolve.sync(path, {basedir: basedir});
}
