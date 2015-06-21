'use strict';

/**
 * @constructor
 */
var ServiceStorage = function ServiceStorage() {
    var instances = {};

    /**
     * @param {String} name
     * @return {boolean}
     */
    this.hasInstance = function (name) {
        return instances.hasOwnProperty(name);
    };

    /**
     * @param {String} name
     * @param {*} instance
     */
    this.addInstance = function (name, instance) {
        if (this.hasInstance(name)) {
            throw new Error('An instance with name the "' + name + '" already exist.');
        }

        instances[name] = instance;
    };

    /**
     * @param {String} name
     * @return {*}
     */
    this.getInstance = function (name) {
        if (!this.hasInstance(name)) {
            throw new Error('Unknown instance with name "' + name + '".');
        }

        return instances[name];
    };
};

module.exports = ServiceStorage;
