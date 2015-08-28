'use strict';

var each = require('lodash/collection/each');
var filter = require('lodash/collection/filter');
var ServiceArgument = require('./ServiceArgument');

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

module.exports = ServiceArgumentCollection;
