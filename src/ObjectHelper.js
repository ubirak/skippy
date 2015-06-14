'use strict';

var ObjectHelper = {
    /**
     * @param {Function} constructor
     * @returns {*}
     */
    createInstance: function (constructor, newInstanceArguments) {
        // From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#Using_apply_to_chain_constructors
        var proxyConstructor = Object.create(constructor.prototype);

        constructor.apply(proxyConstructor, newInstanceArguments);

        return proxyConstructor;
    }
};

module.exports = ObjectHelper;
