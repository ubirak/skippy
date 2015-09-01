'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var CallCollection = require('./../../src/CallCollection');
var Container = require('./../../src/Container');
var Parameter = require('./../../src/Parameter');
var ParameterCollection = require('./../../src/ParameterCollection');
var FunctionArgument = require('./../../src/FunctionArgument');
var FunctionArgumentCollection = require('./../../src/FunctionArgumentCollection');
var ServiceDefinition = require('./../../src/ServiceDefinition');
var ServiceDefinitionCollection = require('./../../src/ServiceDefinitionCollection');
var servicesConfigurationValid = require('./../fixture/valid/services');
var ServiceA = require('./../fixture/valid/ServiceA');
var ServiceC = require('./../fixture/valid/ServiceC');

describe('Container', function () {
    it('should return the parameter value', function () {
        var serviceDefinitionCollection = new ServiceDefinitionCollection();
        var parameterCollection = new ParameterCollection([
            new Parameter('foo', 'bar')
        ]);

        var container = new Container(serviceDefinitionCollection, parameterCollection);

        expect(container.getParameter('foo')).to.be.equal('bar');
    });

    it('should return the service instance', function () {
        var serviceDefinitionA = new ServiceDefinition(
            'foo.serviceA',
            ServiceA,
            new FunctionArgumentCollection(),
            true,
            new CallCollection()
        );

        var serviceDefinitionCollection = new ServiceDefinitionCollection([serviceDefinitionA]);
        var parameterCollection = new ParameterCollection();

        var container = new Container(serviceDefinitionCollection, parameterCollection);

        expect(container.getService('foo.serviceA')).to.be.an.instanceof(ServiceA);
    });

    it('should return the same service instance for singleton service', function () {
        var serviceDefinitionA = new ServiceDefinition(
            'foo.serviceA',
            ServiceA,
            new FunctionArgumentCollection(),
            true,
            new CallCollection()
        );

        var serviceDefinitionCollection = new ServiceDefinitionCollection([serviceDefinitionA]);
        var parameterCollection = new ParameterCollection();

        var container = new Container(serviceDefinitionCollection, parameterCollection);

        var firstCall = container.getService('foo.serviceA');
        var secondCall = container.getService('foo.serviceA');

        expect(firstCall).to.be.equal(secondCall);
    });

    it('should not return the same service instance for non singleton service', function () {
        var serviceDefinitionA = new ServiceDefinition(
            'foo.serviceA',
            ServiceA,
            new FunctionArgumentCollection(),
            false,
            new CallCollection()
        );

        var serviceDefinitionCollection = new ServiceDefinitionCollection([serviceDefinitionA]);
        var parameterCollection = new ParameterCollection();

        var container = new Container(serviceDefinitionCollection, parameterCollection);

        var firstCall = container.getService('foo.serviceA');
        var secondCall = container.getService('foo.serviceA');

        expect(firstCall).to.not.be.equal(secondCall);
    });

    it('should throw an exception on undefined parameter', function () {
        var serviceDefinitionCollection = new ServiceDefinitionCollection();

        var parameter = new Parameter('foo', 'bar');
        var parameterCollection = new ParameterCollection([parameter]);

        var container = new Container(serviceDefinitionCollection, parameterCollection);

        expect(function () {
            container.getParameter('i.do.not.exist');
        }).to.throw('Unknown parameter "i.do.not.exist".');
    });

    it('should throw an exception on undefined service', function () {
        var serviceDefinitionCollection = new ServiceDefinitionCollection();
        var parameterCollection = new ParameterCollection();

        var container = new Container(serviceDefinitionCollection, parameterCollection);


        expect(function () {
            container.getService('i.do.not.exist');
        }).to.throw('Unknown service "i.do.not.exist".');
    });

    it('should pass the right argument to the service', function () {
        var serviceDefinitionA = new ServiceDefinition(
            'foo.serviceA',
            ServiceA,
            new FunctionArgumentCollection(),
            true,
            new CallCollection()
        );

        var serviceDefinitionC = new ServiceDefinition(
            'foo.serviceC',
            ServiceC,
            new FunctionArgumentCollection([
                new FunctionArgument('%foo%'),
                new FunctionArgument(42),
                new FunctionArgument('@foo.serviceA')
            ]),
            false,
            new CallCollection()
        );

        var parameterFoo = new Parameter('foo', 'Pwouet');

        var serviceDefinitionCollection = new ServiceDefinitionCollection([serviceDefinitionA, serviceDefinitionC]);
        var parameterCollection = new ParameterCollection([parameterFoo]);

        var container = new Container(serviceDefinitionCollection, parameterCollection);


        var serviceA = container.getService('foo.serviceA');
        var serviceC = container.getService('foo.serviceC');

        expect(serviceC.foo).to.be.equal('Pwouet');
        expect(serviceC.bar).to.be.equal(42);
        expect(serviceC.serviceA).to.be.equal(serviceA);
    });

    it('should replace a service by a mocked one', function () {
        var serviceDefinitionCollection = sinon.createStubInstance(ServiceDefinitionCollection);
        serviceDefinitionCollection.hasServiceDefinition.withArgs('foo').returns(true);

        var parameterCollection = sinon.createStubInstance(ParameterCollection);

        var fakeServiceMock = sinon.spy();

        var container = new Container(serviceDefinitionCollection, parameterCollection);
        container.mockService('foo', fakeServiceMock);

        expect(container.getService('foo')).to.be.equals(fakeServiceMock);
        expect(fakeServiceMock).to.not.have.been.called;
    });

    it.skip('should replace a cached service by a mocker one', function () {
        // TODO
    });
});
