'use strict';

var each = require('lodash/each');
var find = require('lodash/find');
var Parameter = require('./Parameter');

/**
 * @param {Array<Parameter>} parameters
 * @constructor
 */
var ParameterCollection = function ParameterCollection(parameters) {
    this.parameters = parameters || [];

    each(this.parameters, function (parameter, key) {
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
    return find(this.parameters, function (parameter) {
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
