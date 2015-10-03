'use strict';
var path = require('path');
var dirname = path.dirname;
var resolve = require('resolve');
var caller = require('caller');
var runAsync = require('run-async');
var normalizeArgs = require('./normalize-args');

module.exports = function (opts) {
	opts = normalizeArgs(arguments);

	var cwd = process.cwd();
	var moduleName = opts.path.split(/[\/\\]/)[0];
	var pkgPath = path.join(moduleName, 'package.json');
	var shimDirectory = dirname(caller());

	var localCli = resolveSync(opts.path, cwd);
	var localPkg = null;
	if (localCli) {
		localPkg = resolveSync(pkgPath, cwd);
	}

	var globalCli = resolveSync(opts.relative, shimDirectory);
	var globalPkg = null;
	if (globalCli) {
		globalPkg = resolveSync(
			computeGlobalPackagePath(opts.path, pkgPath, opts.relative),
			shimDirectory
		);
	}

	if (!(localCli || globalCli)) {
		throw new Error('fallback-cli could not find local or global');
	}

	var callbackOptions = {
		moduleName: moduleName,
		localCli: localCli,
		localPkg: localPkg,
		globalCli: globalCli,
		globalPkg: globalPkg,
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

function computeGlobalPackagePath(cliPath, packagePath, relative) {
	return './' + path.join(
			dirname(relative),
			path.relative(dirname(cliPath), packagePath)
		);
}

function resolveSync(path, basedir) {
	try {
		return resolve.sync(path, {basedir: basedir});
	} catch (e) {
		return null;
	}
}
