'use strict';

/**
 * This service is part of a cyclic dependencies.
 *
 * @param {ServiceD} serviceD
 * @constructor
 */
var ServiceC = function ServiceC(serviceD) {
};

module.exports = ServiceC;
