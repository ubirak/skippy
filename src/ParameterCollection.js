'use strict';

var _ = require('lodash');
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
        var param = _.find(parameters, function (parameter) {
            return name === parameter.getName();
        });

        return param || null;
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
