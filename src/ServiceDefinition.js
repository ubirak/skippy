'use strict';

var Container = require('./Container');
var ServiceArgument = require('./ServiceArgument');
var ServiceArgumentCollection = require('./ServiceArgumentCollection');

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
    var serviceArgumentCollection = new ServiceArgumentCollection(args.map(function(argumentValue) {
        return new ServiceArgument(argumentValue);
    }));
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
        return serviceArgumentCollection.getArguments().map(function (argument) {
            return argument.getValue(container);
        });
    };
};

module.exports = ServiceDefinition;
