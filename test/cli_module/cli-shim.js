#!/usr/bin/env node
/* eslint global-require: 0 */
var path = require('path');
var assert = require('assert');
var expectedShim = process.env.EXPECT_SHIM;
var expectedLocal = process.env.EXPECT_LOCAL;
var expectedGlobal = process.env.EXPECT_GLOBAL;
var expectedLocation = process.env.EXPECT_LOCATION;
var fixtureBase = process.env.FALLBACK_CLI_FIXTURE_BASE;
var expectedVersions = {
	a: '0.0.1',
	b: '0.0.2',
	global: '0.0.3',
	null: null
};
var expectedGlobalVersion = expectedVersions[expectedGlobal];
var expectedLocalVersion = expectedVersions[expectedLocal];

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

		if (expectedLocation === 'global') {
			assert.strictEqual(cliModule, expectedGlobal);
		} else {
			assert.strictEqual(expectedLocation, 'local', 'expected location must be "global" or "local"');
			assert.strictEqual(cliModule, expectedLocal);
		}

		assert(!(expectedGlobal === 'null' && expectedLocal === 'null'), 'they can not both be null');

		if (expectedGlobal === 'null') {
			assert.strictEqual(options.globalCli, null, 'globalCli');
			assert.strictEqual(options.globalPkg, null, 'globalPkg');
		} else {
			assert.strictEqual(
				require(options.globalCli),
				expectedGlobal
			);
			assert.strictEqual(
				require(options.globalPkg).version,
				expectedGlobalVersion
			);
		}

		if (expectedLocal === 'null') {
			assert.strictEqual(options.localCli, null, 'localCli');
			assert.strictEqual(options.localPkg, null, 'localPkg');
			assert.strictEqual(options.cli, options.globalCli, 'cli should be the same as globalCli');
			assert.strictEqual(options.pkg, options.globalPkg, 'pkg should be the same as globalPkg');
		} else {
			assert.strictEqual(
				require(options.localCli),
				expectedLocal,
				'localCli'
			);
			assert.strictEqual(
				require(options.localPkg).version,
				expectedLocalVersion,
				'localPkg'
			);
			assert.strictEqual(options.cli, options.localCli, 'cli should be the same as localCli');
			assert.strictEqual(options.pkg, options.localPkg, 'pkg should be the same as localPkg');
		}

		console.log();
		process.exit(0);
	}
);

function relative(p) {
	return path.relative(fixtureBase, p);
}
