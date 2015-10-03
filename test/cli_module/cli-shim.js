#!/usr/bin/env node
/* eslint global-require: 0 */
var path = require('path');
var assert = require('assert');
var expectedShim = process.env.EXPECT_SHIM;
var expectedCli = process.env.EXPECT_CLI;
var fixtureBase = process.env.FALLBACK_CLI_FIXTURE_BASE;
var expectedLocation = expectedCli === 'global' ? 'global' : 'local';
var expectedVersions = {
	a: '0.0.1',
	b: '0.0.2',
	global: '0.0.3'
};
var expectedShimVersion = expectedVersions[expectedShim];
var expectedCliVersion = expectedLocation === 'global' ? null : expectedVersions[expectedCli];

var shimPath = relative(__filename);
console.log('  shim: ' + shimPath);

// Figure out if this shim is the expected one.
if (expectedShim === 'global') {
	assert(
		/^cli_module[\/\\]cli-shim\.js$/
			.test(shimPath),
		'shimPath should be global: ' + shimPath
	);
} else {
	assert.strictEqual(
		/^module_(.)[\/\\].+?[\/\\]cli-shim\.js$/
			.exec(shimPath)[1],
		expectedShim,
		shimPath
	);
}

process.nextTick(function () {
	console.log('did not exit synchronously');
	process.exit(1);
});

require('fallback-cli')(
	'cli_module/cli',
	function (options) {
		var cliModule = require(options.cli);
		console.log('  run:', options.location, cliModule);
		assert.strictEqual(options.location, expectedLocation);
		assert.strictEqual(cliModule, expectedCli);

		var shimPkg = require(options.globalPkg);
		assert.strictEqual(shimPkg.version, expectedShimVersion);

		if (expectedCliVersion === null) {
			assert.strictEqual(options.localPkg, null);
		} else {
			var localPkg = require(options.localPkg);
			assert.strictEqual(localPkg.version, expectedCliVersion);
		}

		console.log();
		process.exit(0);
	}
);

function relative(p) {
	return path.relative(fixtureBase, p);
}
