'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var Container = require('./../src/Container');
var ServiceArgument = require('./../src/ServiceArgument');

describe('ServiceArgument', function () {
    it('should return the unresolved value', function () {
        var serviceArgumentSimple = new ServiceArgument('foo');
        expect(serviceArgumentSimple.getValue()).to.equal('foo');

        var serviceArgumentParameterReference = new ServiceArgument('%foo%');
        expect(serviceArgumentParameterReference.getValue()).to.equal('%foo%');

        var serviceArgumentServiceReference = new ServiceArgument('@foo');
        expect(serviceArgumentServiceReference.getValue()).to.equal('@foo');
    });

    it('should not resolve simple argument', function () {
        var serviceArgument = new ServiceArgument('foo');

        var container = Container.create([], {});

        sinon.stub(container, 'getParameter');
        sinon.stub(container, 'getService');

        expect(serviceArgument.resolve(container)).to.equal('foo');
        expect(container.getParameter.called).to.be.false;
        expect(container.getService.called).to.be.false;
    });

    it('should resolve variable reference argument', function () {
        var serviceArgument = new ServiceArgument('%foo%');

        var container = Container.create([], {});

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

        var container = Container.create([], {});

        sinon.stub(container, 'getParameter');
        sinon.stub(container, 'getService').returns(serviceMock);

        expect(serviceArgument.resolve(container)).to.equal(serviceMock);
        expect(container.getParameter.called).to.be.false;
        expect(container.getService.calledOnce).to.be.true;
    });
});
