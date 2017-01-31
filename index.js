'use strict';

// ES5 equivalent of ES6 modules `export`
// @see https://github.com/addyosmani/es6-equivalents-in-es5#modules
// This allow the end user to do an ES6 import:
//      `import ContainerFactory, { Container } from 'skippy';`

var _extends = function (target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            target[key] = source[key];
        }
    }

    return target;
};

exports.Container = require('./src/Container');
exports['default'] = require('./src/ContainerFactory');

module.exports = _extends(exports['default'], exports);
