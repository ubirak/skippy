'use strict';

var List = require('immutable').List;
var Parameter = require('./Parameter');

/**
 * @param {Array.<Parameter>} parameters
 * @constructor
 */
var ParameterCollection = function ParameterCollection(parameters) {
    this.parameterList = new List(parameters || []);

    this.parameterList.forEach(function (parameter, key) {
        if (!(parameter instanceof Parameter)) {
            throw new Error('Wrong parameter type at position: "' + key + '".');
        }
    });
};

/**
 * @param {String} name
 * @return {Parameter|undefined}
 */
ParameterCollection.prototype.getParameter = function (name) {
    return this.parameterList.find(function (parameter) {
        return (name === parameter.getName());
    });
};

/**
 * @param {String} name
 * @return {boolean}
 */
ParameterCollection.prototype.hasParameter = function (name) {
    return (undefined !== this.getParameter(name));
};

module.exports = ParameterCollection;
