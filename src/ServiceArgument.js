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
     * @param {*} value
     * @returns {boolean}
     */
    this._isString = function (value) {
        if ((typeof value).toLowerCase() !== "string") {
            return false;
        }

        return true;
    };

    /**
     * @param {*} value
     * @returns {boolean}
     * @private
     */
    this._isParameterReference = function (value) {
        if (!this._isString(value)) {
            return false;
        }

        var variableReferenceRegex = /%([^\s]*)%/i;

        return variableReferenceRegex.test(value);
    };

    /**
     * @param {*} value
     * @returns {boolean}
     * @private
     */
    this._isServiceReference = function (value) {
        if (!this._isString(value)) {
            return false;
        }

        var serviceReferenceRegex = /@([^\s]*)/i;

        return serviceReferenceRegex.test(value);
    };

    /**
     * @param {*} value
     * @returns {String}
     * @private
     */
    this._detectType = function _detectParameterType(value) {
        if (this._isParameterReference(value)) {
            return ServiceArguments.TYPE_PARAMETER_REFERENCE;
        } else if (this._isServiceReference(value)) {
            return ServiceArguments.TYPE_SERVICE_REFERENCE;
        }

        return ServiceArguments.TYPE_VALUE;
    };

    /**
     * @param {String} name
     * @returns {String}
     * @private
     */
    this._extractReferencedParameterName = function (name) {
        return name.substr(1, (name.length - 2));
    };

    /**
     * @param {String} name
     * @returns {String}
     * @private
     */
    this._extractReferencedServiceName = function (name) {
        return name.substr(1);
    };

    /**
     * @returns {*}
     */
    this.getValue = function () {
        return value;
    };

    /**
     * @param {Container} container
     * @returns {*}
     */
    this.resolve = function (container) {
        if (ServiceArgument.TYPE_PARAMETER_REFERENCE === type) {
            return container.getParameter(this._extractReferencedParameterName(value));
        } else if (ServiceArgument.TYPE_SERVICE_REFERENCE === type) {
            return container.getService(this._extractReferencedServiceName(value));
        }

        return value;
    };

    type = this._detectType(value);
    value = value;
};

ServiceArgument.TYPE_PARAMETER_REFERENCE = 'parameter-reference';
ServiceArgument.TYPE_SERVICE_REFERENCE = 'service-reference';
ServiceArgument.TYPE_VALUE = 'simple-value';

module.exports = ServiceArgument;
