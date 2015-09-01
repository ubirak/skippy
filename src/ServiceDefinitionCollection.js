'use strict';

var each = require('lodash/collection/each');
var find = require('lodash/collection/find');
var ServiceDefinition = require('./ServiceDefinition');
var ObjectHelper = require('./ObjectHelper');

/**
 * @param {Array<ServiceDefinition>} serviceDefinitions
 * @constructor
 */
var ServiceDefinitionCollection = function ServiceDefinitionCollection(serviceDefinitions) {
    this.serviceDefinitions = serviceDefinitions || [];

    each(this.serviceDefinitions, function (definition, index) {
        if (!(definition instanceof ServiceDefinition)) {
            throw new Error('Wrong parameter type at position: ' + index);
        }
    });
};

/**
 * @param {String} name
 * @return {ServiceDefinition|undefined}
 */
ServiceDefinitionCollection.prototype.getServiceDefinition = function (name) {
    return find(this.serviceDefinitions, function (serviceDefinition) {
        return (serviceDefinition.getName() === name);
    });
};

/**
 * @param {String} name
 * @return {Boolean}
 */
ServiceDefinitionCollection.prototype.hasServiceDefinition = function (name) {
    return (undefined !== this.getServiceDefinition(name));
};

/**
 * @param {Function} cb
 */
ServiceDefinitionCollection.prototype.forEach = function (cb) {
    each(this.serviceDefinitions, function (serviceDefinition) {
        return cb(serviceDefinition);
    });
};

ServiceDefinitionCollection.prototype.checkCyclicDependencies = function () {
    var self = this;
    this.forEach(function (serviceDefinition) {
        self._recurcivelyCheckServiceConstructorCyclicDependencies(serviceDefinition);
    });
};

ServiceDefinitionCollection.prototype._recurcivelyCheckServiceConstructorCyclicDependencies = function (serviceDefinition, parentDependentServiceNames) {
    parentDependentServiceNames = parentDependentServiceNames || [serviceDefinition.getName()];

    var self = this;
    serviceDefinition.getFunctionArgumentCollection().forEach(function (functionArgument) {
        if (!functionArgument.isServiceReference()) {
            return;
        }

        var serviceName = functionArgument.getName();

        if (!self.hasServiceDefinition(serviceName)) {
            throw new Error('The "' + serviceDefinition.getName() + '" service constructor has dependencies on the unknown service "' + serviceName + '".');
        }

        if (parentDependentServiceNames.indexOf(serviceName) !== -1) {
            parentDependentServiceNames.push(serviceName); // To show the complete dependency graph.
            throw new Error('Cyclic dependencies detected on service constructor: "' + parentDependentServiceNames.join(' > ') + '".');
        }

        var childDependentServiceNames = ObjectHelper.clone(parentDependentServiceNames);
        childDependentServiceNames.push(serviceName);

        self._recurcivelyCheckServiceConstructorCyclicDependencies(self.getServiceDefinition(serviceName), childDependentServiceNames);
    });
};

module.exports = ServiceDefinitionCollection;
