'use strict';

var Container = require('./Container');

/**
 * @param {*} value
 * @constructor
 */
var ServiceArgument = function ServiceArguments(value) {
    // Filled at the end of the file.
    var type = null;
    var name = null;

    /**
     * @param {*} argumentValue
     * @return {boolean}
     */
    this._isString = function (argumentValue) {
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
    this._isParameterReference = function (argumentValue) {
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
    this._isServiceReference = function (argumentValue) {
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
    this._detectType = function _detectParameterType(argumentValue) {
        if (this._isParameterReference(argumentValue)) {
            return ServiceArguments.TYPE_PARAMETER_REFERENCE;
        } else if (this._isServiceReference(argumentValue)) {
            return ServiceArguments.TYPE_SERVICE_REFERENCE;
        }

        return ServiceArguments.TYPE_VALUE;
    };

    /**
     * @param {String} argumentName
     * @return {String}
     * @private
     */
    this._extractReferencedParameterName = function (argumentName) {
        return argumentName.substr(1, (argumentName.length - 2));
    };

    /**
     * @param {String} argumentName
     * @return {String}
     * @private
     */
    this._extractReferencedServiceName = function (argumentName) {
        return argumentName.substr(1);
    };

    /**
     * @return {String}
     */
    this.getName = function () {
        if (this.isParameterReference()) {
            return this._extractReferencedParameterName(name);
        } else if (this.isServiceReference()) {
            return this._extractReferencedServiceName(name);
        } else {
            throw new Error('Simple value parameter do not have name.');
        }
    };

    /**
     * @return {*}
     */
    this.getValue = function () {
        return value;
    };

    /**
     * @return {Boolean}
     */
    this.isServiceReference = function () {
        return (ServiceArgument.TYPE_SERVICE_REFERENCE === type);
    };

    /**
     * @return {Boolean}
     */
    this.isParameterReference = function () {
        return (ServiceArgument.TYPE_PARAMETER_REFERENCE === type);
    };

    /**
     * @param {Container} container
     * @return {*}
     */
    this.resolve = function (container) {
        if (ServiceArgument.TYPE_PARAMETER_REFERENCE === type) {
            return container.getParameter(this._extractReferencedParameterName(name));
        } else if (ServiceArgument.TYPE_SERVICE_REFERENCE === type) {
            return container.getService(this._extractReferencedServiceName(name));
        }

        return value;
    };

    type = this._detectType(value);
    name = value;
};

ServiceArgument.TYPE_PARAMETER_REFERENCE = 'parameter-reference';
ServiceArgument.TYPE_SERVICE_REFERENCE = 'service-reference';
ServiceArgument.TYPE_VALUE = 'simple-value';

module.exports = ServiceArgument;
