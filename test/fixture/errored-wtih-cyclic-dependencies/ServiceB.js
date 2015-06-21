'use strict';

/**
 * This service is part of a cyclic dependencies.
 *
 * @param {ServiceC} serviceC
 * @constructor
 */
var ServiceB = function ServiceB(serviceC) {
};

module.exports = ServiceB;
