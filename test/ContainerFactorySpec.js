'use strict';

/* global describe */
/* global it */

var expect = require('chai').expect;
var ContainerFactory = require('./../src/ContainerFactory');
var servicesConfigurationValid = require('./fixture/valid/services');
var servicesConfigurationErroredWithCyclicDependencies = require('./fixture/errored-with-cyclic-dependencies/services');
var servicesConfigurationErroredWithUnknownDependencies = require('./fixture/errored-with-unknown-dependencies/services');
var ServiceA = require('./fixture/valid/ServiceA');

describe('ContainerFactory', function () {
    it('should return the parameter value', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);

        expect(container.getParameter('hello.world')).to.be.equal('Hello, I\'m a parameter!');
    });

    it('should return the service instance', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);

        expect(container.getService('foo.serviceA')).to.be.an.instanceof(ServiceA);
    });

    it('should return the same service instance for singleton service', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);

        var firstCall = container.getService('foo.serviceA');
        var secondCall = container.getService('foo.serviceA');

        expect(firstCall).to.be.equal(secondCall);
    });

    it('should not return the same service instance for non singleton service', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);

        var firstCall = container.getService('foo.serviceB');
        var secondCall = container.getService('foo.serviceB');

        expect(firstCall).to.not.be.equal(secondCall);
    });

    it('should throw an exception on undefined parameter', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);

        expect(function () {
            container.getParameter('i.do.not.exist');
        }).to.throw('Unknown parameter "i.do.not.exist".');
    });

    it('should throw an exception on undefined service', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);

        expect(function () {
            container.getService('i.do.not.exist');
        }).to.throw('Unknown service "i.do.not.exist".');
    });

    it('should pass the right argument to the service', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);

        var serviceA = container.getService('foo.serviceA');
        var serviceC = container.getService('foo.serviceC');

        expect(serviceC.foo).to.be.equal('Hello, I\'m a parameter!');
        expect(serviceC.bar).to.be.equal(42);
        expect(serviceC.serviceA).to.be.equal(serviceA);
    });

    it('should reuse the singleton instance even to build other service', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);

        var serviceD = container.getService('foo.serviceD');
        var serviceAFromServiceD = serviceD.serviceA;

        var serviceA = container.getService('foo.serviceA');

        expect(serviceAFromServiceD).to.be.equal(serviceA);
    });

    it('should not reuse non singleton instance to build other service', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);

        var serviceD = container.getService('foo.serviceD');
        var serviceBFromServiceD = serviceD.serviceB;

        var serviceB = container.getService('foo.serviceB');

        expect(serviceBFromServiceD).to.not.be.equal(serviceB);
    });

    it('should thrown an error if a service depend on an undefined service', function () {
        expect(function() {
            ContainerFactory.create(servicesConfigurationErroredWithUnknownDependencies.services, servicesConfigurationErroredWithUnknownDependencies.parameters);
        }).to.throw('The service "bar.service.B" has dependencies on the unknown service "bar.service.C".');
    });

    it('should thrown an error if services configuration has cyclic dependencies', function () {
        expect(function() {
            ContainerFactory.create(servicesConfigurationErroredWithCyclicDependencies.services, servicesConfigurationErroredWithCyclicDependencies.parameters);
        }).to.throw('Cyclic dependencies detected: "bar.service.B > bar.service.C > bar.service.D > bar.service.B".');
    });
});
