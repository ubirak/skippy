'use strict';

/**
 * A service with another service as dependency.
 *
 * @param {ServiceC} serviceC
 * @constructor
 */
var ServiceB = function ServiceB(serviceC) {
    this.serviceC = serviceC;
};

module.exports = ServiceB;
