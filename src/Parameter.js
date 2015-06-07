'use strict';

/**
 * @param {String} name
 * @param {*} value
 * @constructor
 */
var Parameter = function Parameter(name, value) {
    var name = name;
    var value = value;

    /**
     * @returns {String}
     */
    this.getName = function() {
        return name;
    };

    /**
     * @returns {*}
     */
    this.getValue = function() {
        return value;
    }
};

module.exports = Parameter;
