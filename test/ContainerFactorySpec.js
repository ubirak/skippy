'use strict';

/* global describe */
/* global it */

var expect = require('chai').expect;
var ContainerFactory = require('./../src/ContainerFactory');
var servicesConfigurationErroredWithCyclicDependencies = require('./fixture/errored-with-cyclic-dependencies/services');
var servicesConfigurationErroredWithUnknownDependencies = require('./fixture/errored-with-unknown-dependencies/services');

describe('ContainerFactory', function () {
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
