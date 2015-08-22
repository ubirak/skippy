'use strict';

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
    this.serviceDefinitionCollection = serviceDefinitionCollection;
    this.parameterCollection = parameterCollection;

    this.serviceStorage = new ServiceStorage();
};

/**
 * @param {String} name
 * @return {*|null}
 */
Container.prototype.getParameter = function (name) {
    if (!this.parameterCollection.hasParameter(name)) {
        throw new Error('Unknown parameter "' + name + '".');
    }

    var parameter = this.parameterCollection.getParameter(name);

    return parameter.getValue();
};

/**
 * @param {String} name
 * @return {*}
 */
Container.prototype.getService = function (name) {
    if (!this.serviceDefinitionCollection.hasServiceDefinition(name)) {
        throw new Error('Unknown service "' + name + '".');
    }

    if (this.serviceStorage.hasInstance(name)) {
        return this.serviceStorage.getInstance(name);
    }

    var serviceDefinition = this.serviceDefinitionCollection.getServiceDefinition(name);
    var serviceInstance = serviceDefinition.createInstance(this);
    if (serviceDefinition.isSingleton()) {
        this.serviceStorage.addInstance(name, serviceInstance);
    }

    return serviceInstance;
};

module.exports = Container;
