'use strict';

var List = require('immutable').List;
var ServiceDefinition = require('./ServiceDefinition');

/**
 * @param {Array.<ServiceDefinition>} serviceDefinitions
 * @constructor
 */
var ServiceDefinitionCollection = function ServiceDefinitionCollection(serviceDefinitions) {
    var serviceDefinitionList = new List(serviceDefinitions || []);

    serviceDefinitionList.map(function (definition, index) {
        if (!(definition instanceof ServiceDefinition)) {
            throw new Error('Wrong parameter type at position: ' + index);
        }
    });

    /**
     * @param {String} name
     * @return {ServiceDefinition|undefined}
     */
    this.getServiceDefinition = function (name) {
        return serviceDefinitionList.find(function (serviceDefinition) {
            return (serviceDefinition.getName() === name);
        });
    };

    /**
     * @param {String} name
     * @return {Boolean}
     */
    this.hasServiceDefinition = function (name) {
        return (undefined !== this.getServiceDefinition(name));
    };

    /**
     * @param {Function} cb
     */
    this.forEach = function (cb) {
        serviceDefinitionList.forEach(function (serviceDefinition) {
            return cb(serviceDefinition);
        });
    };
};

module.exports = ServiceDefinitionCollection;
