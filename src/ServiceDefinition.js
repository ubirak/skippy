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
    isSingleton = !!isSingleton;

    /**
     * @return {String}
     */
    this.getName = function () {
        return name;
    };

    /**
     * @return {ServiceArgumentCollection}
     */
    this.getArgumentCollection = function () {
        return serviceArgumentCollection;
    };

    /**
     * @return {boolean}
     */
    this.isSingleton = function () {
        return isSingleton;
    };

    /**
     * @param {Container} container
     * @return {*}
     */
    this.createInstance = function (container) {
        return ObjectHelper.createInstance(constructor, this._resolveArguments(container));
    };

    /**
     * @param {Container} container
     * @return {Array}
     * @private
     */
    this._resolveArguments = function (container) {
        return serviceArgumentCollection.getArguments().map(function (argument) {
            return argument.resolve(container);
        });
    };
};

module.exports = ServiceDefinition;
