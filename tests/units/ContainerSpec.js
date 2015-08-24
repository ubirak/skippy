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

    /**
     * @see http://stackoverflow.com/a/16060619
     * @param {[type]} module
     * @return {[type]}
     */
    function requireUncached(module) {
        delete require.cache[require.resolve(module)]
        return require(module)
    }

    it('should throw a error when trying to mock an undefined service', function () {
        var serviceDefinitionCollection = sinon.createStubInstance(ServiceDefinitionCollection);
        var parameterCollection = sinon.createStubInstance(ParameterCollection);

        var container = new Container(serviceDefinitionCollection, parameterCollection);

        expect(function () {
            container.mockService('foo', function () {});
        }).to.throw('Unknown service "foo".');
    });

    it('should provide an api to mock a service in test environement', function () {
        var serviceDefinitionCollection = sinon.createStubInstance(ServiceDefinitionCollection);
        var parameterCollection = sinon.createStubInstance(ParameterCollection);

        process.env.NODE_ENV = 'test';
        var FreshContainer = requireUncached('./../../src/Container');

        var container = new FreshContainer(serviceDefinitionCollection, parameterCollection);
        expect(container).to.have.property('mockService');
    });

    it('should not provide an api to mock a service in production environement', function () {
        var serviceDefinitionCollection = sinon.createStubInstance(ServiceDefinitionCollection);
        var parameterCollection = sinon.createStubInstance(ParameterCollection);

        process.env.NODE_ENV = 'production';
        var FreshContainer = requireUncached('./../../src/Container');

        var container = new FreshContainer(serviceDefinitionCollection, parameterCollection);
        expect(container).to.not.have.property('mockService');
    });
});
