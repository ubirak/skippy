'use strict';

/**
 * This service is part of a cyclic dependencies.
 *
 * @param {ServiceA} serviceA
 * @param {ServiceD} serviceD
 * @constructor
 */
var ServiceC = function ServiceC(serviceA, serviceD) {
};

module.exports = ServiceC;
