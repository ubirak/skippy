'use strict';

var ObjectHelper = require('./ObjectHelper');
var Container = require('./Container');
var ServiceArgument = require('./ServiceArgument');
var ServiceArgumentCollection = require('./ServiceArgumentCollection');

/**
 * @param {String} name
 * @param {Function} constructor
 * @param {ServiceArgumentCollection} serviceArgumentCollection
 * @param {boolean} isSingleton
 * @constructor
 */
var ServiceDefinition = function ServiceDefinition(name, constructor, serviceArgumentCollection, isSingleton) {
    var name = name;
    var constructor = constructor;
    var serviceArgumentCollection = serviceArgumentCollection;
    var isSingleton = !!isSingleton;

    /**
     * @returns {String}
     */
    this.getName = function () {
        return name;
    };

    /**
     * @returns {boolean}
     */
    this.isSingleton = function () {
        return isSingleton;
    };

    /**
     * @param {Container} container
     */
    this.createInstance = function (container) {
        return ObjectHelper.createInstance(constructor, this._resolveArguments(serviceArgumentCollection, container));
    };

    /**
     * @param {Container} container
     * @private
     */
    this._resolveArguments = function (serviceArgumentCollection, container) {
        return serviceArgumentCollection.getArguments().map(function (argument) {
            return argument.resolve(container);
        });
    };
};

module.exports = ServiceDefinition;
