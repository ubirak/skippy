'use strict';

/**
 * @constructor
 */
var ServiceThatDependOnTheContainer = function ServiceThatDependOnTheContainer(container) {
    this.container = container;
};

ServiceThatDependOnTheContainer.prototype.getContainer = function getContainer() {
    return this.container;
};

module.exports = ServiceThatDependOnTheContainer;
