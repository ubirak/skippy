'use strict';

var Map = require('immutable').Map;
var List = require('immutable').List;
var Container = require('./Container');
var Parameter = require('./Parameter');
var ParameterCollection = require('./ParameterCollection');
var ServiceArgument = require('./ServiceArgument');
var ServiceArgumentCollection = require('./ServiceArgumentCollection');
var ServiceDefinition = require('./ServiceDefinition');
var ServiceDefinitionCollection = require('./ServiceDefinitionCollection');
var ServiceStorage = require('./ServiceStorage');

/**
 * @param {Array} services
 * @return {ServiceDefinitionCollection}
 */
var buildServiceDefinitionCollection = function buildServiceDefinitionCollection(services) {
    var servicesConfigurationList = new List(services);

    var servicesDefinitionList = servicesConfigurationList.map(function (value) {
        var argumentConfigurationList = new List(value.arguments || []);
        var serviceArgumentList = argumentConfigurationList.map(function (argumentValue) {
            return new ServiceArgument(argumentValue);
        });

        return new ServiceDefinition(
            value.name,
            value.service,
            new ServiceArgumentCollection(serviceArgumentList.toArray()),
            value.singleton || undefined
        );
    });

    return new ServiceDefinitionCollection(servicesDefinitionList.toArray());
};

/**
 * @param {Object} parameters
 * @return {ParameterCollection}
 * @private
 */
var buildParameterCollection = function buildParameterCollection(parameters) {
    var parametersConfigurationMap = new Map(parameters);

    var parameterMap = parametersConfigurationMap.map(function (value, key) {
        return new Parameter(key, value);
    });

    return new ParameterCollection(parameterMap.toArray());
};

var ContainerFactory = {};

/**
 * @param {Array.<{name: String, service: Function, arguments: Array.<String|*>}>} services
 * @param {{String: *}} parameters
 * @return {Container}
 * @public
 */
ContainerFactory.create = function (services, parameters) {
    services = services || [];
    parameters = parameters || {};

    var serviceDefinitionCollection = buildServiceDefinitionCollection(services);
    var parameterCollection = buildParameterCollection(parameters);

    return new Container(serviceDefinitionCollection, parameterCollection);
};

module.exports = ContainerFactory;
