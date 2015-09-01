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
    if (process.env.NODE_ENV === 'development') {
        serviceDefinitionCollection.checkCyclicDependencies();
    }

    this.serviceDefinitionCollection = serviceDefinitionCollection;
    this.parameterCollection = parameterCollection;

    this.serviceStorage = new ServiceStorage();
};

/**
 * Return a parameter value.
 *
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
 * Return a sercice instance.
 *
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

    if (serviceDefinition.hasCalls()) {
        serviceDefinition.triggerCalls(this, serviceInstance);
    }

    return serviceInstance;
};

if (process.env.NODE_ENV === 'test') {
    /**
     * Replace a service instance by a mocked instance. Only avialable in test environement.
     *
     * @param {String} name
     * @param {Function} mock
     */
    Container.prototype.mockService = function (name, mock) {
        if (!this.serviceDefinitionCollection.hasServiceDefinition(name)) {
            throw new Error('Unknown service "' + name + '".');
        }

        if (!this.serviceStorage.hasInstance(name)) {
            this.serviceStorage.addInstance(name, mock);
            return;
        }

        this.serviceStorage.replaceInstance(name, mock);
    };
}
module.exports = Container;
