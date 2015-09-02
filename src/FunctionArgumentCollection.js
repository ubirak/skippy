'use strict';

var each = require('lodash/collection/each');
var FunctionArgument = require('./FunctionArgument');

/**
 * @param {Array<FunctionArgument>} functionArguments
 * @constructor
 */
var FunctionArgumentCollection = function FunctionArgumentCollection(functionArguments) {
    functionArguments = functionArguments || [];

    each(functionArguments, function (argument, index) {
        if (!(argument instanceof FunctionArgument)) {
            throw new Error('Wrong parameter type at position: ' + (index));
        }
    });

    this.functionArguments = functionArguments;
};

/**
 * @param {Function} cb
 */
FunctionArgumentCollection.prototype.forEach = function (cb) {
    each(this.functionArguments, function (functionArgument, index) {
        cb(functionArgument, index);
    });
};

/**
 * @param {Container} container
 * @return {Array}
 * @private
 */
FunctionArgumentCollection.prototype.resolveArguments = function resolveArguments(container) {
    return this.functionArguments.map(function (argument) {
        return argument.resolve(container);
    });
};

module.exports = FunctionArgumentCollection;
