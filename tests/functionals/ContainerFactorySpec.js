'use strict';

var expect = require('chai').expect;
var ContainerFactory = require('./../../src/ContainerFactory');
var servicesConfigurationValid = require('./../fixture/valid/services');
var servicesConfigurationErroredWithCyclicDependencies = require('./../fixture/errored-with-cyclic-dependencies/services');
var servicesConfigurationErroredWithUnknownDependencies = require('./../fixture/errored-with-unknown-dependencies/services');
var servicesConfigurationErroredWithInvalidCalls = require('./../fixture/errored-with-invalid-calls/services');
var ServiceA = require('./../fixture/valid/ServiceA');

describe('ContainerFactory', function () {
    it('should return the parameter value', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);

        expect(container.getParameter('hello.world')).to.be.equal('Hello, I\'m a parameter!');
    });

    it('should return the service instance', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);

        var serviceA = container.getService('foo.serviceA');
        expect(serviceA).to.be.an.instanceof(ServiceA);
        expect(serviceA.hello()).to.equals('world');
        expect(serviceA.testClosure()).to.equals('boo');
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

    it('should concider a service as singleton if it have no singleton configuration', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);

        var firstCall = container.getService('foo.serviceE');
        var secondCall = container.getService('foo.serviceE');

        expect(firstCall).to.equals(secondCall);
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

    it('should call the given method with the resolved arguments on the service instance', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);

        var serviceD = container.getService('foo.serviceD');
        var serviceA = container.getService('foo.serviceA');

        expect(serviceD.something).to.equals('Hello, I\'m a parameter!');
        expect(serviceD.another).to.equals(serviceA);
        expect(serviceD.someother).to.equals(51);
    });

    it('should only call once the given method on the service lifecycle', function () {
        var container = ContainerFactory.create(servicesConfigurationValid.services, servicesConfigurationValid.parameters);
        var serviceD = container.getService('foo.serviceD');

        expect(serviceD.aCounter).to.equals(1);

        serviceD = container.getService('foo.serviceD');
        expect(container.getService('foo.serviceD').aCounter).to.equals(1);

        serviceD = container.getService('foo.serviceD');
        expect(container.getService('foo.serviceD').aCounter).to.equals(1);
    });

    it('should thrown an error if a service depend on an undefined service and the container validation is activated', function () {
        expect(function () {
            ContainerFactory.create(servicesConfigurationErroredWithUnknownDependencies.services, servicesConfigurationErroredWithUnknownDependencies.parameters, true);
        }).to.throw('The "bar.service.B" service constructor has dependencies on the unknown service "bar.service.C".');
    });

    it('should not thrown an error if a service depend on an undefined service and the container validation isn\'t activated', function () {
        expect(function () {
            ContainerFactory.create(servicesConfigurationErroredWithUnknownDependencies.services, servicesConfigurationErroredWithUnknownDependencies.parameters);
        }).to.not.throw();
    });

    it('should thrown an error if services configuration has cyclic dependencies and the container validation activated', function () {
        expect(function () {
            ContainerFactory.create(servicesConfigurationErroredWithCyclicDependencies.services, servicesConfigurationErroredWithCyclicDependencies.parameters, true);
        }).to.throw('Cyclic dependencies detected on service constructor: "bar.service.B > bar.service.C > bar.service.D > bar.service.B".');
    });

    it('should thrown an error if services configuration has cyclic dependencies and the container validation isn\'t activated', function () {
        expect(function () {
            ContainerFactory.create(servicesConfigurationErroredWithCyclicDependencies.services, servicesConfigurationErroredWithCyclicDependencies.parameters);
        }).to.not.throw();
    });

    it('should thrown an error if a service has call on an undefined method and the container validation activated', function () {
        expect(function () {
            ContainerFactory.create(servicesConfigurationErroredWithInvalidCalls.services, servicesConfigurationErroredWithInvalidCalls.parameters, true);
        }).to.throw('The method "doBar" does not exist on the given constructor.');
    });

    it('should thrown an error if a service has call on an undefined method and the container validation isn\'t activated', function () {
        expect(function () {
            ContainerFactory.create(servicesConfigurationErroredWithInvalidCalls.services, servicesConfigurationErroredWithInvalidCalls.parameters);
        }).to.not.throw();
    });
});
