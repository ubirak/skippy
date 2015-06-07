'use strict';

var _ = require('lodash');
var Parameter = require('./Parameter');
var ParameterCollection = require('./ParameterCollection');

/**
 * @param {{parameters: Array, services: Array}} configurations
 * @constructor
 */
var Container = function Container(configurations) {
    var serviceDefinitions = [];
    var parameterCollection = new ParameterCollection();

    _.each(configurations.parameters, function (value, key) {
        if (parameterCollection.hasParameter(key)) {
            throw new Error('Duplicate parameter name: "' + key + '".');
        }

        parameterCollection.addParameter(new Parameter(key, value));
    });

    /**
     * @param {String} name
     * @returns {*|null}
     */
    this.getParameter = function(name) {
        return parameterCollection.getParameter(name);
    };

    /**
     * @param name
     * @return {*}
     */
    this.getService = function(name) {
        //TODO
    };
};

module.exports = Container;
