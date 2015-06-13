'use strict';

var Map = require('immutable').Map;
var List = require('immutable').List;
var Parameter = require('./Parameter');
var ParameterCollection = require('./ParameterCollection');
var ServiceArgument = require('./ServiceArgument');
var ServiceArgumentCollection = require('./ServiceArgumentCollection');
var ServiceDefinition = require('./ServiceDefinition');
var ServiceDefinitionCollection = require('./ServiceDefinitionCollection');

/**
 * @param {[]} servicesConfiguration
 * @param {{}} parametersConfiguration
 * @constructor
 */
var Container = function Container(servicesConfiguration, parametersConfiguration) {
    var servicesConfigurationList = new List(servicesConfiguration || []);
    var parametersConfigurationMap = new Map(parametersConfiguration || {});

    var serviceDefinitionCollection = new ServiceDefinitionCollection(servicesConfigurationList.map(function (value) {
        if (!value["arguments"]) {
            value["arguments"] = [];
        }

        var argumentList = new List(value["arguments"]);

        return new ServiceDefinition(
            value.name,
            value.service,
            new ServiceArgumentCollection(argumentList.map(function (value) {
                return new ServiceArgument(value);
            })),
            value.singleton || undefined
        );
    }));

    var parameterCollection = new ParameterCollection(parametersConfigurationMap.map(function (value, key) {
        return new Parameter(key, value);
    }));

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
        if (!serviceDefinitionCollection.hasServiceDefinition(name)) {
            throw new Error('Unknown service %s.')
        }

        var serviceDefinition = serviceDefinitionCollection.getServiceDefinition(name);
        return serviceDefinition.createInstance(this);
    };
};

module.exports = Container;
