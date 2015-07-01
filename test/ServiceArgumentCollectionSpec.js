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
        var argumentCollection = new ServiceArgumentCollection([
            new ServiceArgument('a'),
            new ServiceArgument('%b%'),
            new ServiceArgument('@c')
        ]);

        var returnedServiceArguments = argumentCollection.getArguments();

        expect(returnedServiceArguments).to.have.length(3);

        expect(returnedServiceArguments[0].getValue()).to.be.equal('a');
        expect(returnedServiceArguments[1].getValue()).to.be.equal('%b%');
        expect(returnedServiceArguments[2].getValue()).to.be.equal('@c');
    });

    it('should return only the service reference arguments', function () {
        var argumentCollection = new ServiceArgumentCollection([
            new ServiceArgument('a'),
            new ServiceArgument('%b%'),
            new ServiceArgument('@c'),
            new ServiceArgument('@d'),
            new ServiceArgument('%e%')
        ]);

        var returnedServiceArguments = argumentCollection.getServiceArguments();

        expect(returnedServiceArguments).to.have.length(2);

        expect(returnedServiceArguments[0].getValue()).to.be.equal('@c');
        expect(returnedServiceArguments[1].getValue()).to.be.equal('@d');
    });
});
