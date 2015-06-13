'use strict';

var Map = require('immutable').Map;
var Parameter = require('./Parameter');

/**
 * @param {Array.<Parameter>} parameterMap
 * @constructor
 */
var ParameterCollection = function ParameterCollection(parameterMap) {
    var parameterMap = parameterMap || new Map();

    if (!Map.isMap(parameterMap)) {
        throw new Error('Wrong type of map');
    }

    parameterMap.forEach(function (parameter, key) {
        if (!(parameter instanceof Parameter)) {
            throw new Error('Wrong parameter type at position: "' + key + '".');
        }
    });

    /**
     * @param {String} name
     * @returns {Parameter|undefined}
     */
    this.getParameter = function (name) {
        return parameterMap.find(function (parameter) {
            return (name === parameter.getName());
        });
    };

    /**
     * @param {String} name
     * @returns {boolean}
     */
    this.hasParameter = function (name) {
        return (undefined !== this.getParameter(name));
    };
};

module.exports = ParameterCollection;
