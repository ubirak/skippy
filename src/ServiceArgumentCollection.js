'use strict';

var each = require('lodash/collection/each');
var filter = require('lodash/collection/filter');
var ServiceArgument = require('./ServiceArgument');

// TODO: Rename to ArgumentCollection to allow a more logic re-use in the Call context.

/**
 * @param {Array<ServiceArgument>} serviceArguments
 * @constructor
 */
var ServiceArgumentCollection = function ServiceArgumentCollection(serviceArguments) {
    this.serviceArguments = serviceArguments || [];

    each(this.serviceArguments, function (argument, index) {
        if (!(argument instanceof ServiceArgument)) {
            throw new Error('Wrong parameter type at position: ' + (index));
        }
    });
};

/**
 * @return {Array<ServiceArgument>}
 */
ServiceArgumentCollection.prototype.getArguments = function () {
    return this.serviceArguments;
};

/**
 * @return {Array<ServiceArgument>}
 */
ServiceArgumentCollection.prototype.getServiceArguments = function () {
    return filter(this.serviceArguments, function (argument) {
        return argument.isServiceReference();
    });
};

/**
 * @param {Container} container
 * @return {Array}
 * @private
 */
ServiceArgumentCollection.prototype.resolveArguments = function resolveArguments(container) {
    return this.serviceArguments.map(function (argument) {
        return argument.resolve(container);
    });
};

module.exports = ServiceArgumentCollection;
