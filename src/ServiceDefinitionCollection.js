'use strict';

var each = require('lodash/collection/each');
var find = require('lodash/collection/find');
var ServiceDefinition = require('./ServiceDefinition');

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

module.exports = ServiceDefinitionCollection;
