'use strict';

var Container = require('./Container');
var ServiceArgument = require('./ServiceArgument');

/**
 * @param {String} name
 * @param {Function} constructor
 * @param {Array.<ServiceArgument>} args
 * @param {boolean} isSingleton
 * @constructor
 */
var ServiceDefinition = function ServiceDefinition(name, constructor, args, isSingleton) {
    var name = name;
    var constructor = constructor;
    var serviceArguments = args;
    var isSingleton = isSingleton || true;

    /**
     * @returns {boolean}
     */
    this.canHaveMultipleInstance = function () {
        return !isSingleton;
    };

    /**
     * @param {Container} container
     */
    this.createInstance = function (container) {
        return constructor.apply(constructor, this._buildArguments(container));
    };

    /**
     * @param {Container} container
     * @private
     */
    this._buildArguments = function (container) {
        return serviceArguments.map(function (argument) {
            return argument.getValue(container);
        });
    };
};

module.exports = ServiceDefinition;
