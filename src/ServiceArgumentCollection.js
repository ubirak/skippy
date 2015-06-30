'use strict';

var List = require('immutable').List;
var ServiceArgument = require('./ServiceArgument');

/**
 * @param {Array.<ServiceArgument>} serviceArguments
 * @constructor
 */
var ServiceArgumentCollection = function ServiceArgumentCollection(serviceArguments) {
    var serviceArgumentList = new List(serviceArguments || []);

    serviceArgumentList.map(function (argument, index) {
        if (!(argument instanceof ServiceArgument)) {
            throw new Error('Wrong parameter type at position: ' + (index));
        }
    });

    /**
     * @return {Array.<ServiceArgument>}
     */
    this.getArguments = function () {
        return serviceArgumentList.toArray();
    };

    /**
     * @return {Array.<ServiceArgument>}
     */
    this.getServiceArguments = function() {
        var serviceReferenceArgumentList = serviceArgumentList.filter(function(argument) {
            return argument.isServiceReference();
        });

        return serviceReferenceArgumentList.toArray();
    };
};

module.exports = ServiceArgumentCollection;
