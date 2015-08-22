'use strict';

var ObjectHelper = require('./ObjectHelper');

/**
 * @param {String} name
 * @param {Function} serviceConstructor
 * @param {ServiceArgumentCollection} serviceArgumentCollection
 * @param {boolean} isSingletonService
 * @constructor
 */
var ServiceDefinition = function ServiceDefinition(name, serviceConstructor, serviceArgumentCollection, isSingletonService) {
    this.name = name;
    this.serviceConstructor = serviceConstructor;
    this.serviceArgumentCollection = serviceArgumentCollection;
    this.isSingletonService = !!isSingletonService;
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
    return ObjectHelper.createInstance(this.serviceConstructor, this._resolveArguments(container));
};

/**
 * @param {Container} container
 * @return {Array}
 * @private
 */
ServiceDefinition.prototype._resolveArguments = function _resolveArguments(container) {
    return this.serviceArgumentCollection.getArguments().map(function (argument) {
        return argument.resolve(container);
    });
};

module.exports = ServiceDefinition;
