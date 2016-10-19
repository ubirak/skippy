'use strict';

var ServiceStorage = require('./ServiceStorage');

/**
 * Use ContainerFactory.create(...) to create a new container instance.
 *
 * @param {ServiceDefinitionCollection} serviceDefinitionCollection
 * @param {ParameterCollection} parameterCollection
 * @param {Boolean} validateContainer
 * @private
 * @constructor
 */
var Container = function Container(serviceDefinitionCollection, parameterCollection, validateContainer) {
    this.serviceDefinitionCollection = serviceDefinitionCollection;
    this.parameterCollection = parameterCollection;

    this.serviceStorage = new ServiceStorage();
    this.isDestroyed = false;

    if (validateContainer) {
        this.serviceDefinitionCollection.checkCyclicDependencies();
        this.serviceDefinitionCollection.validateCalls();
        // TODO: Validate the existance of used parameter as service arguments or call arguments.
    }
};

/**
 * Return a parameter value.
 *
 * @param {String} name
 * @return {*|null}
 */
Container.prototype.getParameter = function (name) {
    if (this.isDestroyed) {
        throw new Error('This container instance has been destroyed.');
    } else if (!this.parameterCollection.hasParameter(name)) {
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
    if (this.isDestroyed) {
        throw new Error('This container instance has been destroyed.');
    } else if (!this.serviceDefinitionCollection.hasServiceDefinition(name)) {
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

/**
 * Replace a service instance by a mocked instance. Should only be used in test
 * environement.
 *
 * @param {String} name
 * @param {Function} mock
 */
Container.prototype.mockService = function (name, mock) {
    if (this.isDestroyed) {
        throw new Error('This container instance has been destroyed.');
    } else if (!this.serviceDefinitionCollection.hasServiceDefinition(name)) {
        throw new Error('Unknown service "' + name + '".');
    }

    if (!this.serviceStorage.hasInstance(name)) {
        this.serviceStorage.addInstance(name, mock);
        return;
    }

    this.serviceStorage.replaceInstance(name, mock);
};

/**
 * Will try to destroy all services by calling the method `destructor` on it (if
 * it exist) to ask them nicely to destroy themself and by removing the internal
 * reference to the service to simplify the life of the garbage colletor.
 * The container will also be inusable.
 */
Container.prototype.destroy = function () {
    if (this.isDestroyed) {
        throw new Error('This container instance has already been destroyed.');
    }

    this.isDestroyed = true;

    var self = this;
    this.serviceDefinitionCollection.forEach(function (serviceDefinition) {
        if (self.serviceStorage.hasInstance(serviceDefinition.getName())) {
            var serviceInstance = self.serviceStorage.getInstance(serviceDefinition.getName());

            if (typeof serviceInstance.destructor === 'function') {
                serviceInstance.destructor();
            }
        }
    });

    delete this.parameterCollection;
    delete this.serviceDefinitionCollection;
    delete this.serviceStorage;
};

module.exports = Container;
