'use strict';

var expect = require('chai').expect;
var Map = require('immutable').Map;
var Parameter = require('./../src/Parameter');
var ParameterCollection = require('./../src/ParameterCollection');

describe('ParameterCollection', function () {
    it('should accept no value', function () {
        expect(function () {
            new ParameterCollection();
        }).not.to.throw();
    });

    it('should accept an empty Map', function () {
        expect(function () {
            new ParameterCollection(new Map());
        }).not.to.throw();
    });

    it('should only accept Map', function () {
        expect(function () {
            new ParameterCollection([]);
        }).to.throw();

        expect(function () {
            new ParameterCollection({});
        }).to.throw();
    });

    it('should only accept Parameter inside the Map', function () {
        var fooParameter = new Parameter('foo', 42);
        var barParameter = new Parameter('bar', 51);

        expect(function () {
            new ParameterCollection(new Map({"foo": fooParameter, "bar": barParameter}));
        }).not.to.throw();

        expect(function () {
            new ParameterCollection(new Map({"foo": fooParameter, "bar": barParameter, "date": new Date()}));
        }).to.throw('Wrong parameter type at position: "date".');

        expect(function () {
            new ParameterCollection(new Map({"foo": fooParameter, "bar": barParameter, "number": 42}));
        }).to.throw('Wrong parameter type at position: "number".');
    });

    it('should allow adding multiple time a parameter with the same name', function () {
        var fooParameterA = new Parameter('foo', 42);
        var fooParameterB = new Parameter('foo', 51);

        expect(function () {
            new ParameterCollection(new Map({"fooA": fooParameterA, "fooB": fooParameterB}))
        }).not.to.throw();
    });

    describe('.hasParameter()', function () {
        it('should inform if a parameter is present', function () {
            var fooParameter = new Parameter('foo', 42);

            var parameterCollection = new ParameterCollection(new Map({"foo": fooParameter}));

            expect(parameterCollection.hasParameter('foo')).to.be.true;
            expect(parameterCollection.hasParameter('bar')).to.be.false;
        });
    });

    describe('.getParameter()', function () {
        it('should return the same parameter', function () {
            var fooParameter = new Parameter('foo', 42);

            var parameterCollection = new ParameterCollection(new Map({"foo": fooParameter}));

            expect(parameterCollection.getParameter('foo')).to.be.equal(fooParameter);
        });

        it('should return undefined if the parameter is not present', function () {
            var parameterCollection = new ParameterCollection();

            expect(parameterCollection.getParameter('bar')).to.be.undefined;
        });
    });
});
