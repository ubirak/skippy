'use strict';

var Parameter = require('./Parameter');
var ParameterCollection = require('./ParameterCollection');
var ServiceArgument = require('./ServiceArgument');
var ServiceArgumentCollection = require('./ServiceArgumentCollection');
var ServiceDefinition = require('./ServiceDefinition');
var ServiceDefinitionCollection = require('./ServiceDefinitionCollection');
var ServiceStorage = require('./ServiceStorage');

/**
 * Use ContainerFactory.create(...) to create a new container instance.
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

module.exports = Container;
