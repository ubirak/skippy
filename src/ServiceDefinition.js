'use strict';

var ObjectHelper = require('./ObjectHelper');

/**
 * @param {String} name
 * @param {Function} serviceConstructor
 * @param {ServiceArgumentCollection} serviceArgumentCollection
 * @param {boolean} isSingletonService
 * @param {CallCollection} callCollection
 * @constructor
 */
var ServiceDefinition = function ServiceDefinition(name, serviceConstructor, serviceArgumentCollection, isSingletonService, callCollection) {
    this.name = name;
    this.serviceConstructor = serviceConstructor;
    this.serviceArgumentCollection = serviceArgumentCollection;
    this.isSingletonService = !!isSingletonService;
    this.callCollection = callCollection;
};

/**
 * @return {String}
 */
ServiceDefinition.prototype.getName = function getName() {
    return this.name;
};

/**
 * @return {ServiceArgumentCollection}
 */
ServiceDefinition.prototype.getArgumentCollection = function getArgumentCollection() {
    return this.serviceArgumentCollection;
};

/**
 * @return {boolean}
 */
ServiceDefinition.prototype.isSingleton = function isSingleton() {
    return this.isSingletonService;
};

/**
 * @param {Container} container
 * @return {*}
 */
ServiceDefinition.prototype.createInstance = function createInstance(container) {
    return ObjectHelper.createInstance(this.serviceConstructor, this.serviceArgumentCollection.resolveArguments(container));
};

/**
 * @return {Boolean}
 */
ServiceDefinition.prototype.hasCalls = function hasCalls() {
    return (!this.callCollection.isEmpty());
};

/**
 * @param {Container} container
 * @param {Object} instance
 */
ServiceDefinition.prototype.triggerCalls = function triggerCalls(container, instance) {
    this.callCollection.each(function (call) {
        call.trigger(container, instance);
    });
};

module.exports = ServiceDefinition;
