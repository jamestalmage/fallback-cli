/* eslint global-require: 0 */
'use strict';
module.exports = defaultRequire;

function defaultRequire(opts) {
	if (opts.localCli) {
		return require(opts.localCli);
	}
	return require(opts.globalCli);
}
