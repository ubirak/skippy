'use strict';

var _ = require('lodash');
var Parameter = require('./Parameter');

/**
 * @constructor
 */
var ParameterCollection = function ParameterCollection() {
    var parameters = [];

    /**
     * @param {Parameter} parameter
     */
    this.addParameter = function (parameter) {
        if (!parameter instanceof Parameter) {
            throw new Error('Wrong parameter type.');
        }

        parameters.push(parameter);
    };

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
