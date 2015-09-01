'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var FunctionArgumentCollection = require('./../../src/FunctionArgumentCollection');
var FunctionArgument = require('./../../src/FunctionArgument');

describe('FunctionArgumentCollection', function () {
    it('should only accept FunctionArgument', function () {
        expect(function() {
           new FunctionArgumentCollection([new Date()]);
        }).to.throw('Wrong parameter type at position: 0');

        var functionArgumentStub = sinon.createStubInstance(FunctionArgument);
        expect(function() {
            new FunctionArgumentCollection([
                functionArgumentStub,
                42
            ]);
        }).to.throw('Wrong parameter type at position: 1');
    });

    it('should be iterable', function () {
        var functionArgumentStubA = sinon.createStubInstance(FunctionArgument);
        var functionArgumentStubB = sinon.createStubInstance(FunctionArgument);
        var functionArgumentStubC = sinon.createStubInstance(FunctionArgument);

        var cbSpy = sinon.spy();

        var argumentCollection = new FunctionArgumentCollection([
            functionArgumentStubA,
            functionArgumentStubB,
            functionArgumentStubC
        ]);

        argumentCollection.forEach(cbSpy);

        expect(cbSpy.getCall(0)).to.have.been.calledWith(functionArgumentStubA, 0);
        expect(cbSpy.getCall(1)).to.have.been.calledWith(functionArgumentStubB, 1);
        expect(cbSpy.getCall(2)).to.have.been.calledWith(functionArgumentStubC, 2);
    });

    it('should be iterable', function () {
        var functionArgumentStubA = sinon.createStubInstance(FunctionArgument);
        var functionArgumentStubB = sinon.createStubInstance(FunctionArgument);
        var functionArgumentStubC = sinon.createStubInstance(FunctionArgument);

        var cbSpy = sinon.spy();

        var functionArgumentCollection = new FunctionArgumentCollection([
            functionArgumentStubA,
            functionArgumentStubB,
            functionArgumentStubC
        ]);

        functionArgumentCollection.forEach(cbSpy);

        expect(cbSpy.getCall(0)).to.have.been.calledWith(functionArgumentStubA, 0);
        expect(cbSpy.getCall(1)).to.have.been.calledWith(functionArgumentStubB, 1);
        expect(cbSpy.getCall(2)).to.have.been.calledWith(functionArgumentStubC, 2);
    });
});
