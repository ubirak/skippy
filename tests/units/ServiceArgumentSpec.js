'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var Container = require('./../../src/Container');
var ServiceArgument = require('./../../src/ServiceArgument');

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
        }).to.throw('Simple value parameter do not have name. Value: "foo".');
    });

    it('should not resolve simple argument', function () {
        var container = sinon.createStubInstance(Container);

        var serviceArgument = new ServiceArgument('foo');

        expect(serviceArgument.resolve(container)).to.equal('foo');
        expect(container.getParameter.called).to.be.false;
        expect(container.getService.called).to.be.false;
    });

    it('should resolve variable reference argument', function () {
        var container = sinon.createStubInstance(Container);
        container.getParameter.returns(42);

        var serviceArgument = new ServiceArgument('%foo%');

        expect(serviceArgument.resolve(container)).to.equals(42);
        expect(container.getParameter.calledOnce).to.be.true;
        expect(container.getService.called).to.be.false;
    });

    it('should resolve service reference argument', function () {
        var fakeService = function() {
        };

        var container = sinon.createStubInstance(Container);
        container.getService.returns(fakeService);

        var serviceArgument = new ServiceArgument('@foo');

        expect(serviceArgument.resolve(container)).to.equals(fakeService);
        expect(container.getParameter.called).to.be.false;
        expect(container.getService.calledOnce).to.be.true;
    });
});
