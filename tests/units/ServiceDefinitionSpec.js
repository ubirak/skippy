'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var ServiceDefinition = require('./../../src/ServiceDefinition');
var ServiceArgument = require('./../../src/ServiceArgument');
var ServiceArgumentCollection = require('./../../src/ServiceArgumentCollection');
var Container = require('./../../src/Container');

describe('ServiceDefinition', function () {
    var noop = function noop() {};

    it('should give it\'s name', function () {
        var emptyServiceArgumentCollectionStub = sinon.createStubInstance(ServiceArgumentCollection);
        var serviceDefinition = new ServiceDefinition('foo', noop, emptyServiceArgumentCollectionStub, false);

        expect(serviceDefinition.getName()).to.equal('foo');
    });

    it('should inform if the service should be considered as a singleton', function () {
        var emptyServiceArgumentCollectionStub = sinon.createStubInstance(ServiceArgumentCollection);
        var singletonService = new ServiceDefinition('foo', noop, emptyServiceArgumentCollectionStub, false);
        expect(singletonService.isSingleton()).to.be.false;

        var sharedService = new ServiceDefinition('foo', noop, emptyServiceArgumentCollectionStub, true);
        expect(sharedService.isSingleton()).to.be.true;
    });

    it('should create an instance of a service without arguments', function () {
        var emptyServiceArgumentCollectionStub = sinon.createStubInstance(ServiceArgumentCollection);
        emptyServiceArgumentCollectionStub.getArguments.returns([]);

        var container = sinon.createStubInstance(Container);

        var serviceDefinition = new ServiceDefinition('foo', noop, emptyServiceArgumentCollectionStub, false);

        expect(serviceDefinition.createInstance(container)).to.be.instanceOf(noop);
    });

    it('should create an instance of a service with arguments', function () {
        var serviceArgumentCollectionStub = sinon.createStubInstance(ServiceArgumentCollection);
        serviceArgumentCollectionStub.resolveArguments.returns([42, 'bar']);

        var serviceConstructorSpy = sinon.spy(noop);

        var container = sinon.createStubInstance(Container);

        var serviceDefinition = new ServiceDefinition('foo', serviceConstructorSpy, serviceArgumentCollectionStub, false);

        var serviceInstance = serviceDefinition.createInstance(container);

        expect(serviceInstance).to.be.instanceOf(serviceConstructorSpy);
        expect(serviceConstructorSpy).to.have.been.calledOnce.and.calledWithExactly(42, 'bar');
    });
});
