'use strict';

/**
 * This service has two dependence:
 *  - a reference to another singleton service
 *  - a reference to another non singleton service
 *
 * @param {ServiceA} serviceA
 * @param {serviceB} serviceB
 * @constructor
 */
var ServiceD = function ServiceC(serviceA, serviceB) {
    this.serviceA = serviceA;
    this.serviceB = serviceB;
};

module.exports = ServiceD;
