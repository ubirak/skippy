'use strict';

var each = require('lodash/collection/each');
var Container = require('./Container');
var ObjectHelper = require('./ObjectHelper');
var Parameter = require('./Parameter');
var ParameterCollection = require('./ParameterCollection');
var ServiceArgument = require('./ServiceArgument');
var ServiceArgumentCollection = require('./ServiceArgumentCollection');
var ServiceDefinition = require('./ServiceDefinition');
var ServiceDefinitionCollection = require('./ServiceDefinitionCollection');

/**
 * @param {Array} services
 * @return {ServiceDefinitionCollection}
 */
var buildServiceDefinitionCollection = function buildServiceDefinitionCollection(services) {
    var servicesConfigurationList = services || [];

    var servicesDefinitionList = [];
    each(servicesConfigurationList, function (value) {
        var argumentConfigurationList = value.arguments || [];

        var serviceArgumentList = [];
        each(argumentConfigurationList, function (argumentValue) {
            serviceArgumentList.push(new ServiceArgument(argumentValue));
        });

        servicesDefinitionList.push(new ServiceDefinition(
            value.name,
            value.service,
            new ServiceArgumentCollection(serviceArgumentList),
            value.singleton || undefined
        ));
    });

    return new ServiceDefinitionCollection(servicesDefinitionList);
};

/**
 * @param {Object} parameters
 * @return {ParameterCollection}
 * @private
 */
var buildParameterCollection = function buildParameterCollection(parameters) {
    var parameterMap = parameters || {};

    var parameterList = [];
    each(parameterMap, function (value, key) {
        parameterList.push(new Parameter(key, value));
    });

    return new ParameterCollection(parameterList);
};

var checkCyclicDependencies = function checkCyclicDependencies(serviceDefinition, serviceDefinitionCollection, parentDependentServiceNames) {
    parentDependentServiceNames = parentDependentServiceNames || [serviceDefinition.getName()];

    var serviceArguments = serviceDefinition.getArgumentCollection().getServiceArguments();
    each(serviceArguments, function (argument) {
        var serviceName = argument.getName();

        if (!serviceDefinitionCollection.hasServiceDefinition(serviceName)) {
            throw new Error('The service "' + serviceDefinition.getName() + '" has dependencies on the unknown service "' + serviceName + '".');
        }

        if (parentDependentServiceNames.indexOf(serviceName) !== -1) {
            parentDependentServiceNames.push(serviceName); // To show the complete dependency graph.
            throw new Error('Cyclic dependencies detected: "' + parentDependentServiceNames.join(' > ') + '".');
        }

        var childDependentServiceNames = ObjectHelper.clone(parentDependentServiceNames);
        childDependentServiceNames.push(serviceName);

        checkCyclicDependencies(serviceDefinitionCollection.getServiceDefinition(serviceName), serviceDefinitionCollection, childDependentServiceNames);
    });
};

var ContainerFactory = {};

/**
 * @param {Array<{name: String, service: Function, arguments: Array<String|*>}>} services
 * @param {{String: *}} parameters
 * @return {Container}
 * @public
 */
ContainerFactory.create = function create(services, parameters) {
    services = services || [];
    parameters = parameters || {};

    var serviceDefinitionCollection = buildServiceDefinitionCollection(services);
    var parameterCollection = buildParameterCollection(parameters);

    if (process.env.NODE_ENV === 'development') {
        serviceDefinitionCollection.forEach(function (serviceDefinition) {
            checkCyclicDependencies(serviceDefinition, serviceDefinitionCollection);
        });
    }

    return new Container(serviceDefinitionCollection, parameterCollection);
};

module.exports = ContainerFactory;
