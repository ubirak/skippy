'use strict';

var ServiceParent = require('./ServiceParent');

/**
 * This service has two dependence:
 *  - a reference to another singleton service
 *  - a reference to another non singleton service
 *
 * @param {ServiceA} serviceA
 * @param {serviceB} serviceB
 * @constructor
 */
var ServiceD = function ServiceD(serviceA, serviceB) {
    this.serviceA = serviceA;
    this.serviceB = serviceB;

    this.aCounter = 0;
    this.something = null;
    this.another = null;
    this.someother = null;
};

ServiceD.prototype = new ServiceParent();

ServiceD.prototype.saySomething = function (something, another, someother) {
    this.aCounter++;
    this.something = something;
    this.another = another;
    this.someother = someother;
};

module.exports = ServiceD;
