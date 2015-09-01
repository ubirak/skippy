'use strict';

var each = require('lodash/collection/each');
var filter = require('lodash/collection/filter');
var FunctionArgument = require('./FunctionArgument');

/**
 * @param {Array<FunctionArgument>} functionArguments
 * @constructor
 */
var FunctionArgumentCollection = function FunctionArgumentCollection(functionArguments) {
    this.functionArguments = functionArguments || [];

    each(this.functionArguments, function (argument, index) {
        if (!(argument instanceof FunctionArgument)) {
            throw new Error('Wrong parameter type at position: ' + (index));
        }
    });
};

/**
 * @return {Array<FunctionArgument>}
 */
FunctionArgumentCollection.prototype.getArguments = function () {
    return this.functionArguments;
};

/**
 * @return {Array<FunctionArgument>}
 */
FunctionArgumentCollection.prototype.getFunctionArguments = function () {
    return filter(this.functionArguments, function (argument) {
        return argument.isServiceReference();
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
