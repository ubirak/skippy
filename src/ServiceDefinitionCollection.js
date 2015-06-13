'use strict';

var List = require('immutable').List;
var ServiceDefinition = require('./ServiceDefinition');

/**
 * @param {List.<ServiceDefinition>} serviceDefinitionList
 * @constructor
 */
var ServiceDefinitionCollection = function ServiceDefinitionCollection(serviceDefinitionList) {
    var serviceDefinitionList = serviceDefinitionList || new List();

    serviceDefinitionList.map(function (definition, index) {
        if (!(definition instanceof ServiceDefinition)) {
            throw new Error('Wrong parameter type at position: ' + (index + 1));
        }
    });

    /**
     * @param {String} name
     * @returns {ServiceDefinition|undefined}
     */
    this.getServiceDefinition = function (name) {
        return serviceDefinitionList.find(function(serviceDefinition) {
            return (serviceDefinition.getName() === name);
        });
    };

    /**
     * @param {String} name
     * @returns {boolean}
     */
    this.hasServiceDefinition = function (name) {
        return (undefined !== this.getServiceDefinition(name));
    };
};

module.exports = ServiceDefinitionCollection;
