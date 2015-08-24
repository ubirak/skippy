'use strict';

var chai = require("chai");
var sinonChai = require("sinon-chai");

chai.use(sinonChai);

if (process.env.NODE_ENV !== 'test') {
    console.warn('Warning: you\'re not running the tests in test environment. Define the NODE_ENV variable to "test".');
}
