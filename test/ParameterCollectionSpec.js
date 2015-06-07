'use strict';

var expect = require('chai').expect;
var Parameter = require('./../src/Parameter');
var ParameterCollection = require('./../src/ParameterCollection');


describe('ParameterCollection', function () {
    it('should accept to be empty', function () {
        expect(function () {
            new ParameterCollection();
        }).not.to.throw();

        expect(function () {
            new ParameterCollection([]);
        }).not.to.throw();
    });

    it('should only accept Parameter instance', function () {
        var fooParameter = new Parameter('foo', 42);
        var barParameter = new Parameter('bar', 51);

        expect(function () {
            new ParameterCollection([fooParameter, barParameter]);
        }).not.to.throw();

        expect(function () {
            new ParameterCollection([fooParameter, barParameter, new Date()]);
        }).to.throw('Wrong parameter type at position: 3');

        expect(function () {
            new ParameterCollection([fooParameter, barParameter, 42]);
        }).to.throw('Wrong parameter type at position: 3');
    });

    it('should allow adding multiple time a parameter with the same name', function () {
        var fooParameterA = new Parameter('foo', 42);
        var fooParameterB = new Parameter('foo', 51);

        expect(function () {
            new ParameterCollection([fooParameterA, fooParameterB])
        }).not.to.throw();
    });

    describe('.hasParameter()', function () {
        it('should inform if a parameter is present', function () {
            var fooParameter = new Parameter('foo', 42);

            var parameterCollection = new ParameterCollection([fooParameter]);

            expect(parameterCollection.hasParameter('foo')).to.be.true;
            expect(parameterCollection.hasParameter('bar')).to.be.false;
        });
    });

    describe('.getParameter()', function () {
        it('should return asked the parameter', function () {
            var fooParameter = new Parameter('foo', 42);

            var parameterCollection = new ParameterCollection([fooParameter]);

            expect(parameterCollection.getParameter('foo')).to.be.equal(fooParameter);
        });

        it('should return null if the parameter is not present', function () {
            var parameterCollection = new ParameterCollection();

            expect(parameterCollection.getParameter('foo')).to.be.null;
        });
    });
});
