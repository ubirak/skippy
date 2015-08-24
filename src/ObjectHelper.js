'use strict';

/**
 * @class {ObjectHelper}
 */
var ObjectHelper = {};

/**
 * @param {*} object
 * @return {*}
 */
ObjectHelper.clone = function clone(object) {
    return JSON.parse(JSON.stringify(object));
};

/**
 * @param {Function} constructor
 * @param {Array} newInstanceArguments
 * @return {*}
 */
ObjectHelper.createInstance = function createInstance(constructor, newInstanceArguments) {
    // From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#Using_apply_to_chain_constructors
    var proxyConstructor = Object.create(constructor.prototype);

    constructor.apply(proxyConstructor, newInstanceArguments);

    return proxyConstructor;
};

module.exports = ObjectHelper;
