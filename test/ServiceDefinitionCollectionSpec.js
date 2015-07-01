'use strict';

/* global describe */
/* global it */

var expect = require('chai').expect;
var sinon = require('sinon');
var ServiceDefinitionCollection = require('./../src/ServiceDefinitionCollection');
var ServiceDefinition = require('./../src/ServiceDefinition');
var ServiceArgumentCollection = require('./../src/ServiceArgumentCollection');

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
        var serviceDefinitionA = new ServiceDefinition(
            'foo',
            function() {},
            new ServiceArgumentCollection(),
            true
        );

        var serviceDefinitionB = new ServiceDefinition(
            'bar',
            function() {},
            new ServiceArgumentCollection(),
            true
        );

        var serviceDefinitionCollection = new ServiceDefinitionCollection([
            serviceDefinitionA,
            serviceDefinitionB
        ]);

        expect(serviceDefinitionCollection.getServiceDefinition('foo')).to.be.equal(serviceDefinitionA);
        expect(serviceDefinitionCollection.getServiceDefinition('bar')).to.be.equal(serviceDefinitionB);
    });

    it('should inform if a service definition exist', function() {
        var serviceDefinitionA = new ServiceDefinition(
            'foo',
            function() {},
            new ServiceArgumentCollection(),
            true
        );

        var serviceDefinitionCollection = new ServiceDefinitionCollection([serviceDefinitionA]);

        expect(serviceDefinitionCollection.hasServiceDefinition('foo')).to.be.true
        expect(serviceDefinitionCollection.hasServiceDefinition('i.do.not.exist')).to.be.false;
    });

    it('should allow to iterate on each service definition', function() {
        var serviceDefinitionA = new ServiceDefinition(
            'foo',
            function() {},
            new ServiceArgumentCollection(),
            true
        );

        var serviceDefinitionB = new ServiceDefinition(
            'bar',
            function() {},
            new ServiceArgumentCollection(),
            true
        );

        var serviceDefinitionC = new ServiceDefinition(
            'baz',
            function() {},
            new ServiceArgumentCollection(),
            false
        );

        var serviceDefinitionCollection = new ServiceDefinitionCollection([
            serviceDefinitionA,
            serviceDefinitionB,
            serviceDefinitionC
        ]);

        var spyCallback = sinon.spy();

        serviceDefinitionCollection.forEach(spyCallback);

        expect(spyCallback.callCount).to.be.equal(3);
        expect(spyCallback.getCall(0).calledWith(serviceDefinitionA)).to.be.true;
        expect(spyCallback.getCall(1).calledWith(serviceDefinitionB)).to.be.true;
        expect(spyCallback.getCall(2).calledWith(serviceDefinitionC)).to.be.true;

        // Empty ServiceDefinitionCollection
        var serviceDefinitionCollection = new ServiceDefinitionCollection();
        var spyCallback = sinon.spy();

        serviceDefinitionCollection.forEach(spyCallback);

        expect(spyCallback.callCount).to.be.equal(0);
    });
});
