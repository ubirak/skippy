'use strict';

var expect = require('chai').expect;
var ServiceStorage = require('./../../src/ServiceStorage');

describe('ServiceStorage', function () {
    it('should  add an instance to the storage and return it', function () {
        var serviceStorage = new ServiceStorage();

        var someInstance = Object.create({a: 'bar'});

        serviceStorage.addInstance('foo', someInstance);

        expect(serviceStorage.getInstance('foo')).to.equals(someInstance);
    });

    it('should throw an exception if an instance with the same name already exist', function () {
        var serviceStorage = new ServiceStorage();

        var someInstance = Object.create({a: 'bar'});
        var someOtherInstance = Object.create({a: 'baz'});

        serviceStorage.addInstance('foo', someInstance);

        expect(function () {
            serviceStorage.addInstance('foo', someOtherInstance);
        }).to.throw('An instance with name the "foo" already exist.');
    });

    it('should throw an exception on unknown instance', function () {
        var serviceStorage = new ServiceStorage();

        expect(function () {
            serviceStorage.getInstance('bar');
        }).to.throw('Unknown instance with name "bar".');
    });

    it('should inform if an instance instance exist in the storage', function () {
        var serviceStorage = new ServiceStorage();

        serviceStorage.addInstance('foo', 'some value');

        expect(serviceStorage.hasInstance('foo')).to.be.true;
        expect(serviceStorage.hasInstance('bar')).to.be.false;
    });
});
