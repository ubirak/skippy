'use strict';

var List = require('immutable').List;
var ServiceDefinition = require('./ServiceDefinition');

/**
 * @param {Array.<ServiceDefinition>} serviceDefinitions
 * @constructor
 */
var ServiceDefinitionCollection = function ServiceDefinitionCollection(serviceDefinitions) {
    this.serviceDefinitionList = new List(serviceDefinitions || []);

    this.serviceDefinitionList.map(function (definition, index) {
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
    return this.serviceDefinitionList.find(function (serviceDefinition) {
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
    this.serviceDefinitionList.forEach(function (serviceDefinition) {
        return cb(serviceDefinition);
    });
};

module.exports = ServiceDefinitionCollection;
