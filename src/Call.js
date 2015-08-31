'use strict';

/**
 * @param {String} methodName
 * @param {ServiceArgumentCollection} serviceArgumentCollection
 */
var Call = function Call(methodName, serviceArgumentCollection) {
    this.methodName = methodName;
    this.serviceArgumentCollection = serviceArgumentCollection;
};

/**
 * @param {Container} container
 * @param {Object} instance
 */
Call.prototype.trigger = function trigger(container, instance) {
    if (!instance[this.methodName]) {
        throw new Error('Can\'t call the given method: "' + this.methodName + '" does not exist on the given instance.');
    }

    if (!(instance[this.methodName] instanceof Function)) {
        throw new Error('Can\'t call the given method: "' + this.methodName + '" is not a callable function on the given instance.');
    }

    instance[this.methodName].apply(instance, this.serviceArgumentCollection.resolveArguments(container));
};

module.exports = Call;
