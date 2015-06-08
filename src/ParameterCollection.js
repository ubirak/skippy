'use strict';

var Parameter = require('./Parameter');

/**
 * @param {Array.<Parameter>} parameters
 * @constructor
 */
var ParameterCollection = function ParameterCollection(parameters) {
    var parameters = parameters || [];

    parameters.map(function (parameter, index) {
        if (!(parameter instanceof Parameter)) {
            throw new Error('Wrong parameter type at position: ' + (index + 1));
        }
    });

    /**
     * @param {String} name
     * @returns {*|null}
     */
    this.getParameter = function (name) {
        var param = parameters.map(function (parameter) {
            if (name === parameter.getName())
                return parameter;
        });

        return param.shift() || null;
    };

    /**
     * @param {String} name
     * @returns {boolean}
     */
    this.hasParameter = function (name) {
        return (this.getParameter(name) ? true : false)
    };
};

module.exports = ParameterCollection;
