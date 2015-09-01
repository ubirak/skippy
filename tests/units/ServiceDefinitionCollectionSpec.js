'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var ServiceDefinitionCollection = require('./../../src/ServiceDefinitionCollection');
var ServiceDefinition = require('./../../src/ServiceDefinition');
var FunctionArgumentCollection = require('./../../src/FunctionArgumentCollection');

describe('ServiceDefinitionCollection', function() {
    it('should only accept SericeDefinition', function() {
        expect(function() {
           new ServiceDefinitionCollection([new Date()]);
        }).to.throw('Wrong parameter type at position: 0');

        var serviceDefinitionStub = sinon.createStubInstance(ServiceDefinition);

        expect(function() {
            new ServiceDefinitionCollection([
                serviceDefinitionStub,
                42
            ]);
        }).to.throw('Wrong parameter type at position: 1');
    });

    it('should return the asked service definition', function() {
        var serviceDefinitionA = sinon.createStubInstance(ServiceDefinition);
        serviceDefinitionA.getName.returns('foo');

        var serviceDefinitionB = sinon.createStubInstance(ServiceDefinition);
        serviceDefinitionB.getName.returns('bar');

        var serviceDefinitionCollection = new ServiceDefinitionCollection([
            serviceDefinitionA,
            serviceDefinitionB
        ]);

        expect(serviceDefinitionCollection.getServiceDefinition('foo')).to.be.equal(serviceDefinitionA);
        expect(serviceDefinitionCollection.getServiceDefinition('bar')).to.be.equal(serviceDefinitionB);
    });

    it('should inform if a service definition exist', function() {
        var serviceDefinitionA = sinon.createStubInstance(ServiceDefinition);
        serviceDefinitionA.getName.returns('foo');

        var serviceDefinitionCollection = new ServiceDefinitionCollection([serviceDefinitionA]);

        expect(serviceDefinitionCollection.hasServiceDefinition('foo')).to.be.true
        expect(serviceDefinitionCollection.hasServiceDefinition('i.do.not.exist')).to.be.false;
    });

    it('should allow to iterate on each service definition', function() {
        var serviceDefinitionA = sinon.createStubInstance(ServiceDefinition);
        serviceDefinitionA.getName.returns('foo');

        var serviceDefinitionB = sinon.createStubInstance(ServiceDefinition);
        serviceDefinitionB.getName.returns('bar');

        var serviceDefinitionC = sinon.createStubInstance(ServiceDefinition);
        serviceDefinitionC.getName.returns('baz');

        var serviceDefinitionCollection = new ServiceDefinitionCollection([
            serviceDefinitionA,
            serviceDefinitionB,
            serviceDefinitionC
        ]);

        var spyCallback = sinon.spy();

        serviceDefinitionCollection.forEach(spyCallback);

        expect(spyCallback).to.have.been.calledThrice;
        expect(spyCallback.getCall(0)).to.have.been.calledWithExactly(serviceDefinitionA);
        expect(spyCallback.getCall(1)).to.have.been.calledWithExactly(serviceDefinitionB);
        expect(spyCallback.getCall(2)).to.have.been.calledWithExactly(serviceDefinitionC);


        // Empty ServiceDefinitionCollection
        var serviceDefinitionCollection = new ServiceDefinitionCollection();
        var spyCallback = sinon.spy();

        serviceDefinitionCollection.forEach(spyCallback);

        expect(spyCallback).to.not.have.been.called;
    });
});
