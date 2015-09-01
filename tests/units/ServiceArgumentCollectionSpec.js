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

    it('should return all the arguments', function () {
        var functionArgumentStubA = sinon.createStubInstance(FunctionArgument);
        var functionArgumentStubB = sinon.createStubInstance(FunctionArgument);
        var functionArgumentStubC = sinon.createStubInstance(FunctionArgument);

        var argumentCollection = new FunctionArgumentCollection([
            functionArgumentStubA,
            functionArgumentStubB,
            functionArgumentStubC
        ]);

        var returnedFunctionArguments = argumentCollection.getArguments();

        expect(returnedFunctionArguments).to.be.deep.equals([
            functionArgumentStubA,
            functionArgumentStubB,
            functionArgumentStubC
        ]);
    });

    it('should return only the service reference arguments', function () {
        var createFunctionArgumentStub = function(isServiceReference) {
            var functionArgumentStub = sinon.createStubInstance(FunctionArgument);
            functionArgumentStub.isServiceReference.returns(isServiceReference);

            return functionArgumentStub;
        };

        var functionArgumentStubA = createFunctionArgumentStub(false);
        var functionArgumentStubB = createFunctionArgumentStub(false);
        var functionArgumentStubC = createFunctionArgumentStub(true);
        var functionArgumentStubD = createFunctionArgumentStub(true);
        var functionArgumentStubE = createFunctionArgumentStub(false);

        var argumentCollection = new FunctionArgumentCollection([
            functionArgumentStubA,
            functionArgumentStubB,
            functionArgumentStubC,
            functionArgumentStubD,
            functionArgumentStubE
        ]);

        var returnedFunctionArguments = argumentCollection.getFunctionArguments();

        expect(returnedFunctionArguments).to.be.deep.equals([
            functionArgumentStubC,
            functionArgumentStubD
        ]);
    });
});
