'use strict';

var each = require('lodash/each');
var Call = require('./Call');
var CallCollection = require('./CallCollection');
var Container = require('./Container');
var Parameter = require('./Parameter');
var ParameterCollection = require('./ParameterCollection');
var FunctionArgument = require('./FunctionArgument');
var FunctionArgumentCollection = require('./FunctionArgumentCollection');
var ServiceDefinition = require('./ServiceDefinition');
var ServiceDefinitionCollection = require('./ServiceDefinitionCollection');

/**
 * @param {Array} services
 * @return {ServiceDefinitionCollection}
 * @private
 */
var buildServiceDefinitionCollection = function buildServiceDefinitionCollection(services) {
    var servicesConfigurationList = services || [];

    var servicesDefinitionList = [];
    each(servicesConfigurationList, function (value) {
        var argumentConfigurationList = value.arguments || [];

        var functionArgumentList = [];
        each(argumentConfigurationList, function (argumentValue) {
            functionArgumentList.push(new FunctionArgument(argumentValue));
        });

        var calls = value.calls || {};
        var callList = [];
        each(calls, function (callArguments, methodName) {
            var callArgumentList = [];
            each(callArguments, function (argumentValue) {
                callArgumentList.push(new FunctionArgument(argumentValue));
            });

            callList.push(new Call(methodName, new FunctionArgumentCollection(callArgumentList)));
        });

        servicesDefinitionList.push(new ServiceDefinition(
            value.name,
            value.service,
            new FunctionArgumentCollection(functionArgumentList),
            value.singleton,
            new CallCollection(callList)
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

var ContainerFactory = {};

/**
 * @param {Array<{name: String, service: Function, arguments: Array<String|*>, calls: {String: Array<String|*>}}>} services
 * @param {{String: *}} parameters
 * @param {Boolean} validateContainer
 * @return {Container}
 */
ContainerFactory.create = function create(services, parameters, validateContainer) {
    services = services || [];
    parameters = parameters || {};

    var serviceDefinitionCollection = buildServiceDefinitionCollection(services);
    var parameterCollection = buildParameterCollection(parameters);

    return new Container(serviceDefinitionCollection, parameterCollection, validateContainer);
};

module.exports = ContainerFactory;
