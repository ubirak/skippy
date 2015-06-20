'use strict';

/* global describe */
/* global it */

var expect = require('chai').expect;
var sinon = require('sinon');
var ServiceDefinition = require('./../src/ServiceDefinition');
var ServiceArgument = require('./../src/ServiceArgument');
var ServiceArgumentCollection = require('./../src/ServiceArgumentCollection');
var Container = require('./../src/Container');

describe('ServiceDefinition', function () {
    var noop = function noop() {
    };

    var emptyServiceArgument = new ServiceArgumentCollection([]);

    it('should give it\'s name', function () {
        var serviceDefinition = new ServiceDefinition('foo', noop, emptyServiceArgument, false);

        expect(serviceDefinition.getName()).to.equal('foo');
    });

    it('should inform if the service should be considered as a service', function () {
        var singletonService = new ServiceDefinition('foo', noop, emptyServiceArgument, false);
        expect(singletonService.isSingleton()).to.be.false;

        var sharedService = new ServiceDefinition('foo', noop, emptyServiceArgument, true);
        expect(sharedService.isSingleton()).to.be.true;
    });

    it('should create an instance of a service without arguments', function () {
        var serviceDefinition = new ServiceDefinition('foo', noop, emptyServiceArgument, false);

        var container = Container.create([], {});
        sinon.stub(container);

        expect(serviceDefinition.createInstance(container)).to.be.instanceOf(noop);
    });

    it('should create an instance of a service with arguments', function () {
        var serviceArgumentCollection = new ServiceArgumentCollection([
            new ServiceArgument(42),
            new ServiceArgument('bar')
        ]);

        var serviceConstructor = function ServiceConstructor() {
        };

        serviceConstructor = sinon.spy(serviceConstructor);

        var serviceDefinition = new ServiceDefinition('foo', serviceConstructor, serviceArgumentCollection, false);

        var container = Container.create([], {});
        sinon.stub(container);

        expect(serviceDefinition.createInstance(container)).to.be.instanceOf(serviceConstructor);
        expect(serviceConstructor.calledWithExactly(42, 'bar')).to.be.true;
    });
});
