'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var Container = require('./../../src/Container');
var ServiceDefinitionCollection = require('./../../src/ServiceDefinitionCollection');
var ParameterCollection = require('./../../src/ParameterCollection');

describe('Container', function () {
    var previousProcessEnv = process.env.NODE_ENV;

    afterEach(function () {
        process.env.NODE_ENV = previousProcessEnv;
    });

    it('should throw a error when trying to mock an undefined service', function () {
        var serviceDefinitionCollection = sinon.createStubInstance(ServiceDefinitionCollection);
        var parameterCollection = sinon.createStubInstance(ParameterCollection);

        var container = new Container(serviceDefinitionCollection, parameterCollection);

        expect(function () {
            container.mockService('foo', function () {});
        }).to.throw('Unknown service "foo".');
    });

    it('should check the service cyclic dependencies if the container validation activated', function () {
        var serviceDefinitionCollection = sinon.createStubInstance(ServiceDefinitionCollection);
        serviceDefinitionCollection.checkCyclicDependencies.returns(null);
        var parameterCollection = sinon.createStubInstance(ParameterCollection);

        var container = new Container(serviceDefinitionCollection, parameterCollection, true);

        expect(serviceDefinitionCollection.checkCyclicDependencies).to.have.been.calledOnce;
        expect(serviceDefinitionCollection.validateCalls).to.have.been.calledOnce;
    });

    it('should not check the service cyclic dependencies if the container validation isn\'t activated', function () {
        var serviceDefinitionCollection = sinon.createStubInstance(ServiceDefinitionCollection);
        serviceDefinitionCollection.checkCyclicDependencies.returns(null);
        var parameterCollection = sinon.createStubInstance(ParameterCollection);

        var container = new Container(serviceDefinitionCollection, parameterCollection);

        expect(serviceDefinitionCollection.checkCyclicDependencies).to.not.have.been.called;
        expect(serviceDefinitionCollection.validateCalls).to.not.have.been.called;
    });
});
