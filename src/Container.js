'use strict';

var Map = require('immutable').Map;
var List = require('immutable').List;
var Parameter = require('./Parameter');
var ParameterCollection = require('./ParameterCollection');
var ServiceArgument = require('./ServiceArgument');
var ServiceArgumentCollection = require('./ServiceArgumentCollection');
var ServiceDefinition = require('./ServiceDefinition');
var ServiceDefinitionCollection = require('./ServiceDefinitionCollection');
var ServiceStorage = require('./ServiceStorage');

/**
 * Use Container.create(...) to create a new container instance.
 *
 * @param {ServiceDefinitionCollection} serviceDefinitionCollection
 * @param {ParameterCollection} parameterCollection
 * @private
 * @constructor
 */
var Container = function Container(serviceDefinitionCollection, parameterCollection) {
    var serviceStorage = new ServiceStorage();

    /**
     * @param {String} name
     * @return {*|null}
     */
    this.getParameter = function (name) {
        if (!parameterCollection.hasParameter(name)) {
            throw new Error('Unknown parameter "' + name + '".');
        }

        var parameter = parameterCollection.getParameter(name);

        return parameter.getValue();
    };

    /**
     * @param {String} name
     * @return {*}
     */
    this.getService = function (name) {
        if (!serviceDefinitionCollection.hasServiceDefinition(name)) {
            throw new Error('Unknown service "' + name + '".');
        }

        if (serviceStorage.hasInstance(name)) {
            return serviceStorage.getInstance(name);
        }

        var serviceDefinition = serviceDefinitionCollection.getServiceDefinition(name);
        var serviceInstance = serviceDefinition.createInstance(this);

        if (serviceDefinition.isSingleton()) {
            serviceStorage.addInstance(name, serviceInstance);
        }

        return serviceInstance;
    };
};

/**
 * @param {Array} services
 * @return {ServiceDefinitionCollection}
 * @private
 */
Container._initServiceDefinitionCollection = function (services) {
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
Container._initParameterCollection = function (parameters) {
    var parametersConfigurationMap = new Map(parameters);

    var parameterMap = parametersConfigurationMap.map(function (value, key) {
        return new Parameter(key, value);
    });

    return new ParameterCollection(parameterMap.toArray());
};

/**
 * @param {Array.<{name: String, service: Function, arguments: Array.<String|*>}>} services
 * @param {{String: *}} parameters
 * @return {Container}
 */
Container.create = function (services, parameters) {
    services = services || [];
    parameters = parameters || {};

    var serviceDefinitionCollection = Container._initServiceDefinitionCollection(services);
    var parameterCollection = Container._initParameterCollection(parameters);

    return new Container(serviceDefinitionCollection, parameterCollection);
};

/**
 * @type {{create: Container.create}}
 */
module.exports = {
    create: Container.create
};
