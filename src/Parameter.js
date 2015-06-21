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
     * @return {String}
     */
    this.getName = function() {
        return this.name;
    };

    /**
     * @return {*}
     */
    this.getValue = function() {
        return this.value;
    };
};

module.exports = Parameter;
