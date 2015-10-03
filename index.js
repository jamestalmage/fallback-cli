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

	if (!(localCli || globalCli)) {
		throw new Error('fallback-cli could not find local or global');
	}

	var callbackOptions = {
		localCli: localCli,
		globalCli: globalCli,
		cli: localCli || globalCli,
		location: localCli ? 'local' : 'global'
	};

	runAsync(opts.before, doRequire, callbackOptions);

	function doRequire(beforeResult) {
		runAsync(opts.require, setCliModule, callbackOptions);

		function setCliModule(requireResult) {
			opts.run(callbackOptions, requireResult, beforeResult);
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
