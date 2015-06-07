'use strict';

var expect = require('chai').expect;
var Parameter = require('./../src/Parameter');


describe('A Parameter', function() {
    it('should have name and a value', function() {
        var parameter = new Parameter('foo', 'bar');

        expect(parameter.getName()).to.equal('foo');
        expect(parameter.getValue()).to.equal('bar');
    });
});
