'use strict';

/**
 * This service has three type of dependence:
 *  - a container parameter,
 *  - a value that has no relation with the container
 *  - a reference to another service
 *
 * @param {String} foo
 * @param {Number} bar
 * @param {ServiceA} serviceA
 * @constructor
 */
var ServiceC = function ServiceC(foo, bar, serviceA) {
    this.foo = foo;
    this.bar = bar;
    this.serviceA = serviceA;
};

module.exports = ServiceC;
