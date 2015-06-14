'use strict';

/**
 * @param {String} name
 * @param {*} value
 * @constructor
 */
var Parameter = function Parameter(name, value) {
    this.name = name;
    this.value = value;

    /**
     * @returns {String}
     */
    this.getName = function() {
        return this.name;
    };

    /**
     * @returns {*}
     */
    this.getValue = function() {
        return this.value;
    }
};

module.exports = Parameter;
