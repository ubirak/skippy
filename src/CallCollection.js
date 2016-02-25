'use strict';

var each = require('lodash/each');
var Call = require('./Call');

/**
 * @param {Array<Call>} calls
 */
var CallCollection = function CallCollection(calls) {
    calls = calls || [];

    each(calls, function (call, index) {
        if (!(call instanceof Call)) {
            throw new Error('Wrong paramater type at position #' + index + '. Only accept Call instance.');
        }
    });

    this.calls = calls;
};

/**
 * @return {Boolean}
 */
CallCollection.prototype.isEmpty = function () {
    return (this.calls.length === 0);
};

/**
 * @param {Function} cb
 */
CallCollection.prototype.forEach = function (cb) {
    each(this.calls, cb);
};

module.exports = CallCollection;
