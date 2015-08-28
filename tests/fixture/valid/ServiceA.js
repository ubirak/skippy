'use strict';

var testVariableClosure = 'boo';

/**
 * A service with no dependency.
 *
 * @constructor
 */
var ServiceA = function ServiceA() {
};

ServiceA.prototype.hello = function hello() {
    return "world";
};

ServiceA.prototype.testClosure = function testClosure() {
    return testVariableClosure;
};

module.exports = ServiceA;
