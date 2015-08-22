'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var ServiceArgumentCollection = require('./../../src/ServiceArgumentCollection');
var ServiceArgument = require('./../../src/ServiceArgument');

describe('ServiceArgumentCollection', function () {
    it('should only accept ServiceArgument', function () {
        expect(function() {
           new ServiceArgumentCollection([new Date()]);
        }).to.throw('Wrong parameter type at position: 0');

        var serviceArgumentStub = sinon.createStubInstance(ServiceArgument);
        expect(function() {
            new ServiceArgumentCollection([
                serviceArgumentStub,
                42
            ]);
        }).to.throw('Wrong parameter type at position: 1');
    });

    it('should return all the arguments', function () {
        var serviceArgumentStubA = sinon.createStubInstance(ServiceArgument);
        var serviceArgumentStubB = sinon.createStubInstance(ServiceArgument);
        var serviceArgumentStubC = sinon.createStubInstance(ServiceArgument);

        var argumentCollection = new ServiceArgumentCollection([
            serviceArgumentStubA,
            serviceArgumentStubB,
            serviceArgumentStubC
        ]);

        var returnedServiceArguments = argumentCollection.getArguments();

        expect(returnedServiceArguments).to.be.deep.equals([
            serviceArgumentStubA,
            serviceArgumentStubB,
            serviceArgumentStubC
        ]);
    });

    it('should return only the service reference arguments', function () {
        var createServiceArgumentStub = function(isServiceReference) {
            var serviceArgumentStub = sinon.createStubInstance(ServiceArgument);
            serviceArgumentStub.isServiceReference.returns(isServiceReference);

            return serviceArgumentStub;
        };

        var serviceArgumentStubA = createServiceArgumentStub(false);
        var serviceArgumentStubB = createServiceArgumentStub(false);
        var serviceArgumentStubC = createServiceArgumentStub(true);
        var serviceArgumentStubD = createServiceArgumentStub(true);
        var serviceArgumentStubE = createServiceArgumentStub(false);

        var argumentCollection = new ServiceArgumentCollection([
            serviceArgumentStubA,
            serviceArgumentStubB,
            serviceArgumentStubC,
            serviceArgumentStubD,
            serviceArgumentStubE
        ]);

        var returnedServiceArguments = argumentCollection.getServiceArguments();

        expect(returnedServiceArguments).to.be.deep.equals([
            serviceArgumentStubC,
            serviceArgumentStubD
        ]);
    });
});
