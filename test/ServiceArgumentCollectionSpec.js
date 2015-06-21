'use strict';

/* global describe */
/* global it */

var expect = require('chai').expect;
var ServiceArgumentCollection = require('./../src/ServiceArgumentCollection');
var ServiceArgument = require('./../src/ServiceArgument');

describe('ServiceArgumentCollection', function () {
    it('should only accept ServiceArgument', function () {
        expect(function() {
           new ServiceArgumentCollection([new Date()]);
        }).to.throw('Wrong parameter type at position: 0');

        expect(function() {
            new ServiceArgumentCollection([
                new ServiceArgument('%foo%'),
                42
            ]);
        }).to.throw('Wrong parameter type at position: 1');
    });

    it('should return all the arguments', function () {
        var serviceArguments = [
            new ServiceArgument('a'),
            new ServiceArgument('b'),
            new ServiceArgument('c')
        ];

        var argumentCollection = new ServiceArgumentCollection(serviceArguments);

        var returnedServiceArguments = argumentCollection.getArguments();

        expect(returnedServiceArguments).to.have.length(3);

        expect(returnedServiceArguments[0].getValue()).to.be.equal('a');
        expect(returnedServiceArguments[1].getValue()).to.be.equal('b');
        expect(returnedServiceArguments[2].getValue()).to.be.equal('c');
    });
});
