'use strict';

/**
 * This service is part of a cyclic dependencies.
 *
 * @param {ServiceA} serviceA
 * @param {ServiceB} serviceB
 * @constructor
 */
var ServiceD = function ServiceD(serviceA, serviceB) {
};

module.exports = ServiceD;
