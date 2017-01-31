'use strict';

var CONTAINER_SERVICE_NAME = '@container';

/**
 * @param {*} value
 * @constructor
 */
var FunctionArgument = function FunctionArgument(value) {
    this.type = this._detectType(value);
    this.name = value;
};

/**
 * @param {*} argumentValue
 * @return {boolean}
 */
FunctionArgument.prototype._isString = function _isString(argumentValue) {
    if ((typeof argumentValue).toLowerCase() !== 'string') {
        return false;
    }

    return true;
};

/**
 * @param {*} argumentValue
 * @return {boolean}
 * @private
 */
FunctionArgument.prototype._isParameterReference = function _isParameterReference(argumentValue) {
    if (!this._isString(argumentValue)) {
        return false;
    }

    var variableReferenceRegex = /%([^\s]*)%/i;

    return variableReferenceRegex.test(argumentValue);
};

/**
 * @param {*} argumentValue
 * @return {boolean}
 * @private
 */
FunctionArgument.prototype._isContainerReference = function _isContainerReference(argumentValue) {
    if (!this._isString(argumentValue)) {
        return false;
    }

    return argumentValue === CONTAINER_SERVICE_NAME;
};

/**
 * @param {*} argumentValue
 * @return {boolean}
 * @private
 */
FunctionArgument.prototype._isServiceReference = function _isServiceReference(argumentValue) {
    if (!this._isString(argumentValue)) {
        return false;
    }

    var serviceReferenceRegex = /@([^\s]*)/i;

    return serviceReferenceRegex.test(argumentValue);
};

/**
 * @param {*} argumentValue
 * @return {String}
 * @private
 */
FunctionArgument.prototype._detectType = function _detectType(argumentValue) {
    if (this._isParameterReference(argumentValue)) {
        return FunctionArgument.TYPE_PARAMETER_REFERENCE;
    } else if (this._isContainerReference(argumentValue)) {
        return FunctionArgument.TYPE_CONTAINER_REFERENCE;
    } else if (this._isServiceReference(argumentValue)) {
        return FunctionArgument.TYPE_SERVICE_REFERENCE;
    }

    return FunctionArgument.TYPE_VALUE;
};

/**
 * @param {String} argumentName
 * @return {String}
 * @private
 */
FunctionArgument.prototype._extractReferencedParameterName = function _extractReferencedParameterName(argumentName) {
    return argumentName.substr(1, (argumentName.length - 2));
};

/**
 * @param {String} argumentName
 * @return {String}
 * @private
 */
FunctionArgument.prototype._extractReferencedServiceName = function _extractReferencedServiceName(argumentName) {
    return argumentName.substr(1);
};

/**
 * @return {String}
 */
FunctionArgument.prototype.getName = function getName() {
    if (this.isParameterReference()) {
        return this._extractReferencedParameterName(this.name);
    } else if (this.isServiceReference()) {
        return this._extractReferencedServiceName(this.name);
    } else {
        throw new Error('Simple value parameter do not have name. Value: "' + this.name + '".');
    }
};

/**
 * @return {*}
 */
FunctionArgument.prototype.getValue = function getValue() {
    return this.name;
};

/**
 * @return {Boolean}
 */
FunctionArgument.prototype.isServiceReference = function isServiceReference() {
    return (FunctionArgument.TYPE_SERVICE_REFERENCE === this.type);
};

/**
 * @return {Boolean}
 */
FunctionArgument.prototype.isParameterReference = function isParameterReference() {
    return (FunctionArgument.TYPE_PARAMETER_REFERENCE === this.type);
};

/**
 * @param {Container} container
 * @return {*}
 */
FunctionArgument.prototype.resolve = function resolve(container) {
    if (FunctionArgument.TYPE_CONTAINER_REFERENCE === this.type) {
        return container;
    } else if (FunctionArgument.TYPE_PARAMETER_REFERENCE === this.type) {
        return container.getParameter(this._extractReferencedParameterName(this.name));
    } else if (FunctionArgument.TYPE_SERVICE_REFERENCE === this.type) {
        return container.getService(this._extractReferencedServiceName(this.name));
    }

    return this.name;
};

FunctionArgument.TYPE_CONTAINER_REFERENCE = 'container-reference';
FunctionArgument.TYPE_PARAMETER_REFERENCE = 'parameter-reference';
FunctionArgument.TYPE_SERVICE_REFERENCE = 'service-reference';
FunctionArgument.TYPE_VALUE = 'simple-value';

module.exports = FunctionArgument;
