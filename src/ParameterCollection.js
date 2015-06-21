'use strict';

var List = require('immutable').List;
var Parameter = require('./Parameter');

/**
 * @param {Array.<Parameter>} parameters
 * @constructor
 */
var ParameterCollection = function ParameterCollection(parameters) {
    var parameterList = new List(parameters || []);

    parameterList.forEach(function (parameter, key) {
        if (!(parameter instanceof Parameter)) {
            throw new Error('Wrong parameter type at position: "' + key + '".');
        }
    });

    /**
     * @param {String} name
     * @return {Parameter|undefined}
     */
    this.getParameter = function (name) {
        return parameterList.find(function (parameter) {
            return (name === parameter.getName());
        });
    };

    /**
     * @param {String} name
     * @return {boolean}
     */
    this.hasParameter = function (name) {
        return (undefined !== this.getParameter(name));
    };
};

module.exports = ParameterCollection;
