'use strict';

/**
 * @param {String} name
 * @param {*} value
 * @constructor
 */
var Parameter = function Parameter(name, value) {
    this.name = name;
    this.value = value;
};

/**
 * @return {String}
 */
Parameter.prototype.getName = function () {
    return this.name;
};

/**
 * @return {*}
 */
Parameter.prototype.getValue = function () {
    return this.value;
};

module.exports = Parameter;
