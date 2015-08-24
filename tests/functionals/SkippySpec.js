'use strict';

var expect = require('chai').expect;
var ContainerFactory = require('./../../src/ContainerFactory');

describe('Skippy package', function () {
    it('should only expose the ContainerFactory', function () {
        var ExposedApi = require('./../../index');

        expect(ExposedApi).to.be.equal(ContainerFactory);
        expect(ExposedApi.create).to.be.equal(ContainerFactory.create);
    });
});
