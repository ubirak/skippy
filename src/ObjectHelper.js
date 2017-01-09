'use strict';

/**
 * @class {ObjectHelper}
 */
var ObjectHelper = {};

/**
 * @param {*} object
 * @return {*}
 */
ObjectHelper.clone = function clone(object) {
    return JSON.parse(JSON.stringify(object));
};

/**
 * @param {Function} constructor
 * @param {Array} newInstanceArguments
 * @return {*}
 */
ObjectHelper.createInstance = function createInstance(constructor, newInstanceArguments) {
    // This solution come from babel.
    // Try it here: http://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015&code=%0Aclass%20Bar%20%7B%0A%7D%0A%0Anew%20Bar(...%5B1%2C%202%5D)%3B
    return new (Function.prototype.bind.apply(constructor, [null].concat(newInstanceArguments)))();
};

module.exports = ObjectHelper;
