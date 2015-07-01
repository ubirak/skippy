'use strict';

/**
 * @class {ObjectHelper}
 */
var ObjectHelper = {
    /**
     * @param {Function} constructor
     * @param {Array} newInstanceArguments
     * @return {*}
     */
    createInstance: function (constructor, newInstanceArguments) {
        // From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#Using_apply_to_chain_constructors
        var proxyConstructor = Object.create(constructor.prototype);

        constructor.apply(proxyConstructor, newInstanceArguments);

        return proxyConstructor;
    },

    /**
     * @param {*} object
     * @return {*}
     */
    clone: function(object) {
        return JSON.parse(JSON.stringify(object));
    }
};

module.exports = ObjectHelper;
