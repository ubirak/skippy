'use strict';

var Container = require('./Container');

/**
 * @param {*} value
 * @constructor
 */
var ServiceArgument = function ServiceArguments(value) {
    var type = this._detectParameterType(value);
    var value = value;

    /**
     * @param {*} value
     * @returns {boolean}
     * @private
     */
    this._isVariableReference = function (value) {
        return true;
    };

    /**
     * @param {*} value
     * @returns {boolean}
     * @private
     */
    this._isServiceReference = function (value) {
        return true;
    };

    /**
     * @param {*} value
     * @returns {String}
     * @private
     */
    this._detectParameterType = function _detectParameterType(value) {
        if (this._isVariableReference(value)) {
            return ServiceArguments.TYPE_PARAMETER_REFERENCE;
        } else if (this._isServiceReference(value)) {
            return ServiceArguments.TYPE_SERVICE_REFERENCE;
        } else {
            return ServiceArguments.TYPE_VALUE;
        }
    };

    /**
     * @param {String} name
     * @returns {String}
     * @private
     */
    this._extractReferencedParameterName = function (name) {
        return name.substr(1, (name.length - 2))
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
     * @param {Container} container
     * @returns {*}
     */
    this.getValue = function (container) {
        if (ServiceArgument.TYPE_PARAMETER_REFERENCE === type) {
            return container.getParameter(this._extractReferencedParameterName(value));
        } else if (ServiceArgument.TYPE_SERVICE_REFERENCE === type) {
            return container.getService(this._extractReferencedServiceName(value));
        }

        return value;
    };
};

ServiceArgument.TYPE_PARAMETER_REFERENCE = 'variable-reference';
ServiceArgument.TYPE_SERVICE_REFERENCE = 'service-reference';
ServiceArgument.TYPE_VALUE = 'value';

module.exports = ServiceArgument;
