'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var Call = require('./../../src/Call');
var Container = require('./../../src/Container');
var FunctionArgumentCollection = require('./../../src/FunctionArgumentCollection');

describe('Call', function() {
    it('should call the linked method on the object instance', function() {
        var container = sinon.createStubInstance(Container);
        var functionArgumentCollection = sinon.createStubInstance(FunctionArgumentCollection);
        functionArgumentCollection.resolveArguments.returns(['bar', 42]);

        var instanceMock = {
            setFoo: function(paramA, paramB) {}
        }

        sinon.spy(instanceMock, 'setFoo');

        var call = new Call('setFoo', functionArgumentCollection);
        call.trigger(container, instanceMock)

        expect(instanceMock.setFoo).to.have.been.calledWithExactly('bar', 42);
    });

    it('should throw an exception if the method do exist', function() {
        var container = sinon.createStubInstance(Container);
        var functionArgumentCollection = sinon.createStubInstance(FunctionArgumentCollection);

        var instanceMock = {};

        var call = new Call('unknownMethodName', functionArgumentCollection);

        expect(function () {
            call.trigger(container, instanceMock);
        }).to.throw(Error, 'Can\'t call the given method: "unknownMethodName" does not exist on the given instance.');
    });

    it('should throw an exception if the referenced method is not a function', function() {
        var container = sinon.createStubInstance(Container);
        var functionArgumentCollection = sinon.createStubInstance(FunctionArgumentCollection);

        var instanceMock = {
            notAFunction: 42
        };

        var call = new Call('notAFunction', functionArgumentCollection);

        expect(function () {
            call.trigger(container, instanceMock);
        }).to.throw(Error, 'Can\'t call the given method: "notAFunction" is not a callable function on the given instance.');
    });
});
