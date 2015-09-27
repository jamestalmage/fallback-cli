#!/usr/bin/env node
var path = require('path');
var assert = require('assert');
var expectedShim = process.env.EXPECT_SHIM;
var expectedCli = process.env.EXPECT_CLI;
var fixtureBase = process.env.FALLBACK_CLI_FIXTURE_BASE;
var expectedLocation = expectedCli === 'global' ? 'global' : 'local';
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

require('fallback-cli')({
	path: 'cli_module/cli',
	before: function (location, cliPath) {
		console.log('  before:', location, relative(cliPath));
		assert.strictEqual(location, expectedLocation);
		return 'beforeResult';
	},
	run: function (location, cliModule, result) {
		console.log('  run:', location, cliModule, result);
		assert.strictEqual(location, expectedLocation);
		assert.strictEqual(cliModule, expectedCli);
		assert.strictEqual('beforeResult', result);
		console.log();
		process.exit(0);
	}
});

function relative(p) {
	return path.relative(fixtureBase, p);
}
