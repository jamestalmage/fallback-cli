'use strict';
var dirname = require('path').dirname;
var resolve = require('resolve');
var caller = require('caller');
var runAsync = require('run-async');
var normalizeArgs = require('./normalize-args');

module.exports = function (opts) {
	opts = normalizeArgs(arguments);

	var localCli = resolveSync(opts.path, process.cwd());
	var globalCli = resolveSync(opts.relative, dirname(caller()));
	var location = localCli ? 'local' : 'global';
	var cliPath = localCli || globalCli;

	if (!(localCli || globalCli)) {
		throw new Error('fallback-cli could not find local or global');
	}

	runAsync(opts.before, doRequire, location, cliPath);

	function doRequire(beforeResult) {
		var requireOptions = {
			localCli: localCli,
			globalCli: globalCli
		};

		runAsync(opts.require, setCliModule, requireOptions);

		function setCliModule(requireResult) {
			opts.run(location, requireResult, beforeResult);
		}
	}
};

function resolveSync(path, basedir) {
	try {
		return resolve.sync(path, {basedir: basedir});
	} catch (e) {
		return null;
	}
}
