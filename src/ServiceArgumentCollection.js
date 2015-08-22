'use strict';

var List = require('immutable').List;
var ServiceArgument = require('./ServiceArgument');

/**
 * @param {Array.<ServiceArgument>} serviceArguments
 * @constructor
 */
var ServiceArgumentCollection = function ServiceArgumentCollection(serviceArguments) {
    this.serviceArgumentList = new List(serviceArguments || []);

    this.serviceArgumentList.map(function (argument, index) {
        if (!(argument instanceof ServiceArgument)) {
            throw new Error('Wrong parameter type at position: ' + (index));
        }
    });
};

/**
 * @return {Array.<ServiceArgument>}
 */
ServiceArgumentCollection.prototype.getArguments = function () {
    return this.serviceArgumentList.toArray();
};

/**
 * @return {Array.<ServiceArgument>}
 */
ServiceArgumentCollection.prototype.getServiceArguments = function () {
    var serviceReferenceArgumentList = this.serviceArgumentList.filter(function (argument) {
        return argument.isServiceReference();
    });

    return serviceReferenceArgumentList.toArray();
};

module.exports = ServiceArgumentCollection;
