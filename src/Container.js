'use strict';

var Parameter = require('./Parameter');
var ParameterCollection = require('./ParameterCollection');

/**
 * @param {{parameters: Array, services: Array}} configurations
 * @constructor
 */
var Container = function Container(configurations) {
    var serviceDefinitions = [];

    var parameters = [];
    if (configurations.parameters) {
        parameters = configurations.parameters.map(function (value, key) {
            return new Parameter(key, value);
        });
    }

    var parameterCollection = new ParameterCollection(parameters);

    /**
     * @param {String} name
     * @returns {*|null}
     */
    this.getParameter = function (name) {
        return parameterCollection.getParameter(name);
    };

    /**
     * @param name
     * @return {*}
     */
    this.getService = function (name) {
        //TODO
    };
};

module.exports = Container;
