'use strict';

var List = require('immutable').List;
var ServiceArgument = require('./ServiceArgument');

/**
 * @param {Array.<ServiceArgument>} parameters
 * @constructor
 */
var ServiceArgumentCollection = function ServiceArgumentCollection(serviceArgumentList) {
    var serviceArgumentList = new List(serviceArgumentList || []);

    serviceArgumentList.map(function (argument, index) {
        if (!(argument instanceof ServiceArgument)) {
            throw new Error('Wrong parameter type at position: ' + (index + 1));
        }
    });

    /**
     * @returns {List.<ServiceArgument>}
     */
    this.getArguments = function () {
        return serviceArgumentList.toArray();
    };
};

module.exports = ServiceArgumentCollection;
