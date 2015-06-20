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
    var serviceDefinitionCollection = serviceDefinitionCollection;
    var parameterCollection = parameterCollection;
    var serviceStorage = new ServiceStorage();

    /**
     * @param {String} name
     * @returns {*|null}
     */
    this.getParameter = function (name) {
        if (!this.parameterCollection.hasParameter(name)) {
            throw new Error('Unknown parameter "' + name + '".');
        }

        var parameter = this.parameterCollection.getParameter(name);

        return parameter.getValue();
    };

    /**
     * @param name
     * @return {*}
     */
    this.getService = function (name) {
        if (!this.serviceDefinitionCollection.hasServiceDefinition(name)) {
            throw new Error('Unknown service "' + name + '".')
        }

        var serviceDefinition = this.serviceDefinitionCollection.getServiceDefinition(name);
        return serviceDefinition.createInstance(this);
    };
};

/**
 * @param {Array} services
 * @returns {ServiceDefinitionCollection}
 * @private
 */
Container._initServiceDefinitionCollection = function (services) {
    var servicesConfigurationList = new List(services);

    var servicesDefinitionList = servicesConfigurationList.map(function (value) {
        var argumentConfigurationList = new List(value["arguments"] || []);
        var serviceArgumentList = argumentConfigurationList.map(function (value) {
            return new ServiceArgument(value);
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
 * @returns {ParameterCollection}
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
 * @returns {Container}
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
