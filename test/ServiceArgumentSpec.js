'use strict';

/* global describe */
/* global it */

var expect = require('chai').expect;
var sinon = require('sinon');
var ContainerFactory = require('./../src/ContainerFactory');
var ServiceArgument = require('./../src/ServiceArgument');

describe('ServiceArgument', function () {
    it('should detect simple value', function () {
        var serviceArgumentServiceReference = new ServiceArgument('foo');

        expect(serviceArgumentServiceReference.isServiceReference()).to.be.false;
        expect(serviceArgumentServiceReference.isParameterReference()).to.be.false;
    });

    it('should detect service reference value', function () {
        var serviceArgumentServiceReference = new ServiceArgument('@foo');

        expect(serviceArgumentServiceReference.isServiceReference()).to.be.true;
        expect(serviceArgumentServiceReference.isParameterReference()).to.be.false;
    });

    it('should detect parameter reference value', function () {
        var serviceArgumentServiceReference = new ServiceArgument('%foo%');

        expect(serviceArgumentServiceReference.isServiceReference()).to.be.false;
        expect(serviceArgumentServiceReference.isParameterReference()).to.be.true;
    });

    it('should return the unresolved value', function () {
        var serviceArgumentSimple = new ServiceArgument('foo');
        expect(serviceArgumentSimple.getValue()).to.equal('foo');

        var serviceArgumentParameterReference = new ServiceArgument('%foo%');
        expect(serviceArgumentParameterReference.getValue()).to.equal('%foo%');

        var serviceArgumentServiceReference = new ServiceArgument('@foo');
        expect(serviceArgumentServiceReference.getValue()).to.equal('@foo');
    });

    it('should return the referenced name of service reference', function () {
                var serviceArgumentServiceReference = new ServiceArgument('@foo.bar');
        expect(serviceArgumentServiceReference.getName()).to.equal('foo.bar');
    });

    it('should return the referenced name of parameter reference', function () {
        var serviceArgumentParameterReference = new ServiceArgument('%foo.bar%');
        expect(serviceArgumentParameterReference.getName()).to.equal('foo.bar');
    });

    it('should not return the referenced name of simple value', function () {
        var serviceArgumentSimple = new ServiceArgument('foo');
        expect(function() {
            serviceArgumentSimple.getName();
        }).to.throw('Simple value parameter do not have name.');
    });

    it('should not resolve simple argument', function () {
        var serviceArgument = new ServiceArgument('foo');

        var container = ContainerFactory.create([], {});

        sinon.stub(container, 'getParameter');
        sinon.stub(container, 'getService');

        expect(serviceArgument.resolve(container)).to.equal('foo');
        expect(container.getParameter.called).to.be.false;
        expect(container.getService.called).to.be.false;
    });

    it('should resolve variable reference argument', function () {
        var serviceArgument = new ServiceArgument('%foo%');

        var container = ContainerFactory.create([], {});

        sinon.stub(container, 'getParameter').returns(42);
        sinon.stub(container, 'getService');

        expect(serviceArgument.resolve(container)).to.equal(42);
        expect(container.getParameter.calledOnce).to.be.true;
        expect(container.getService.called).to.be.false;
    });

    it('should resolve service reference argument', function () {
        var serviceArgument = new ServiceArgument('@foo');
        var serviceMock = function() {
        };

        var container = ContainerFactory.create([], {});

        sinon.stub(container, 'getParameter');
        sinon.stub(container, 'getService').returns(serviceMock);

        expect(serviceArgument.resolve(container)).to.equal(serviceMock);
        expect(container.getParameter.called).to.be.false;
        expect(container.getService.calledOnce).to.be.true;
    });
});
