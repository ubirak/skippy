'use strict';

/* global describe */
/* global it */

var expect = require('chai').expect;
var ContainerFactory = require('./../src/ContainerFactory');
var servicesConf = require('./fixture/valid/services');
var ServiceA = require('./fixture/valid/ServiceA');

describe('Container', function () {
    it('should return the parameter value', function () {
        var container = ContainerFactory.create(servicesConf.services, servicesConf.parameters);

        expect(container.getParameter('hello.world')).to.be.equal('Hello, I\'m a parameter!');
    });

    it('should return the service instance', function () {
        var container = ContainerFactory.create(servicesConf.services, servicesConf.parameters);

        expect(container.getService('foo.serviceA')).to.be.an.instanceof(ServiceA);
    });

    it('should return the same service instance for singleton service', function () {
        var container = ContainerFactory.create(servicesConf.services, servicesConf.parameters);

        var firstCall = container.getService('foo.serviceA');
        var secondCall = container.getService('foo.serviceA');

        expect(firstCall).to.be.equal(secondCall);
    });

    it('should not return the same service instance for non singleton service', function () {
        var container = ContainerFactory.create(servicesConf.services, servicesConf.parameters);

        var firstCall = container.getService('foo.serviceB');
        var secondCall = container.getService('foo.serviceB');

        expect(firstCall).to.not.be.equal(secondCall);
    });

    it('should throw an exception on undefined parameter', function () {
        var container = ContainerFactory.create(servicesConf.services, servicesConf.parameters);

        expect(function () {
            container.getParameter('i.do.not.exist');
        }).to.throw('Unknown parameter "i.do.not.exist".');
    });

    it('should throw an exception on undefined service', function () {
        var container = ContainerFactory.create(servicesConf.services, servicesConf.parameters);

        expect(function () {
            container.getService('i.do.not.exist');
        }).to.throw('Unknown service "i.do.not.exist".');
    });

    it('should pass the right argument to the service', function () {
        var container = ContainerFactory.create(servicesConf.services, servicesConf.parameters);

        var serviceA = container.getService('foo.serviceA');
        var serviceC = container.getService('foo.serviceC');

        expect(serviceC.foo).to.be.equal('Hello, I\'m a parameter!');
        expect(serviceC.bar).to.be.equal(42);
        expect(serviceC.serviceA).to.be.equal(serviceA);
    });
});
