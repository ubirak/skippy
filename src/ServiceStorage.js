'use strict';

/**
 * @constructor
 */
var ServiceStorage = function ServiceStorage() {
    this.instances = {};
};

/**
 * @param {String} name
 * @return {boolean}
 */
ServiceStorage.prototype.hasInstance = function (name) {
    return this.instances.hasOwnProperty(name);
};

/**
 * @param {String} name
 * @param {*} instance
 */
ServiceStorage.prototype.addInstance = function (name, instance) {
    if (this.hasInstance(name)) {
        throw new Error('An instance with name the "' + name + '" already exist.');
    }

    this.instances[name] = instance;
};

/**
 * @param {String} name
 * @return {*}
 */
ServiceStorage.prototype.getInstance = function (name) {
    if (!this.hasInstance(name)) {
        throw new Error('Unknown instance with name "' + name + '".');
    }

    return this.instances[name];
};

module.exports = ServiceStorage;
