'use strict';

/* global describe */
/* global it */

var expect = require('chai').expect;
var Exposed = require('./../index');
var ContainerFactory = require('./../src/ContainerFactory');

describe('Skippy package', function () {
    it('should only expose the ContainerFactory', function () {
        expect(Exposed).to.be.equal(ContainerFactory);
        expect(Exposed.create).to.be.equal(ContainerFactory.create);
    });
});
