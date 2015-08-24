'use strict';

/**
 * @param {*} value
 * @constructor
 */
var ServiceArgument = function ServiceArgument(value) {
    this.type = this._detectType(value);
    this.name = value;
};

/**
 * @param {*} argumentValue
 * @return {boolean}
 */
ServiceArgument.prototype._isString = function _isString(argumentValue) {
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
ServiceArgument.prototype._isParameterReference = function _isParameterReference(argumentValue) {
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
ServiceArgument.prototype._isServiceReference = function _isServiceReference(argumentValue) {
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
ServiceArgument.prototype._detectType = function _detectType(argumentValue) {
    if (this._isParameterReference(argumentValue)) {
        return ServiceArgument.TYPE_PARAMETER_REFERENCE;
    } else if (this._isServiceReference(argumentValue)) {
        return ServiceArgument.TYPE_SERVICE_REFERENCE;
    }

    return ServiceArgument.TYPE_VALUE;
};

/**
 * @param {String} argumentName
 * @return {String}
 * @private
 */
ServiceArgument.prototype._extractReferencedParameterName = function _extractReferencedParameterName(argumentName) {
    return argumentName.substr(1, (argumentName.length - 2));
};

/**
 * @param {String} argumentName
 * @return {String}
 * @private
 */
ServiceArgument.prototype._extractReferencedServiceName = function _extractReferencedServiceName(argumentName) {
    return argumentName.substr(1);
};

/**
 * @return {String}
 */
ServiceArgument.prototype.getName = function getName() {
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
ServiceArgument.prototype.getValue = function getValue() {
    return this.name;
};

/**
 * @return {Boolean}
 */
ServiceArgument.prototype.isServiceReference = function isServiceReference() {
    return (ServiceArgument.TYPE_SERVICE_REFERENCE === this.type);
};

/**
 * @return {Boolean}
 */
ServiceArgument.prototype.isParameterReference = function isParameterReference() {
    return (ServiceArgument.TYPE_PARAMETER_REFERENCE === this.type);
};

/**
 * @param {Container} container
 * @return {*}
 */
ServiceArgument.prototype.resolve = function resolve(container) {
    if (ServiceArgument.TYPE_PARAMETER_REFERENCE === this.type) {
        return container.getParameter(this._extractReferencedParameterName(this.name));
    } else if (ServiceArgument.TYPE_SERVICE_REFERENCE === this.type) {
        return container.getService(this._extractReferencedServiceName(this.name));
    }

    return this.name;
};

ServiceArgument.TYPE_PARAMETER_REFERENCE = 'parameter-reference';
ServiceArgument.TYPE_SERVICE_REFERENCE = 'service-reference';
ServiceArgument.TYPE_VALUE = 'simple-value';

module.exports = ServiceArgument;
