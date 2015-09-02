'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var Container = require('./../../src/Container');
var FunctionArgument = require('./../../src/FunctionArgument');

describe('FunctionArgument', function () {
    it('should detect simple value', function () {
        var functionArgumentServiceReference = new FunctionArgument('foo');

        expect(functionArgumentServiceReference.isServiceReference()).to.be.false;
        expect(functionArgumentServiceReference.isParameterReference()).to.be.false;
    });

    it('should detect service reference value', function () {
        var functionArgumentServiceReference = new FunctionArgument('@foo');

        expect(functionArgumentServiceReference.isServiceReference()).to.be.true;
        expect(functionArgumentServiceReference.isParameterReference()).to.be.false;
    });

    it('should detect parameter reference value', function () {
        var functionArgumentServiceReference = new FunctionArgument('%foo%');

        expect(functionArgumentServiceReference.isServiceReference()).to.be.false;
        expect(functionArgumentServiceReference.isParameterReference()).to.be.true;
    });

    it('should return the unresolved value', function () {
        var functionArgumentSimple = new FunctionArgument('foo');
        expect(functionArgumentSimple.getValue()).to.equal('foo');

        var functionArgumentParameterReference = new FunctionArgument('%foo%');
        expect(functionArgumentParameterReference.getValue()).to.equal('%foo%');

        var functionArgumentServiceReference = new FunctionArgument('@foo');
        expect(functionArgumentServiceReference.getValue()).to.equal('@foo');
    });

    it('should return the referenced name of service reference', function () {
                var functionArgumentServiceReference = new FunctionArgument('@foo.bar');
        expect(functionArgumentServiceReference.getName()).to.equal('foo.bar');
    });

    it('should return the referenced name of parameter reference', function () {
        var functionArgumentParameterReference = new FunctionArgument('%foo.bar%');
        expect(functionArgumentParameterReference.getName()).to.equal('foo.bar');
    });

    it('should not return the referenced name of simple value', function () {
        var functionArgumentSimple = new FunctionArgument('foo');
        expect(function() {
            functionArgumentSimple.getName();
        }).to.throw('Simple value parameter do not have name. Value: "foo".');
    });

    it('should not resolve simple argument', function () {
        var container = sinon.createStubInstance(Container);

        var functionArgument = new FunctionArgument('foo');

        expect(functionArgument.resolve(container)).to.equal('foo');
        expect(container.getParameter.called).to.be.false;
        expect(container.getService.called).to.be.false;
    });

    it('should resolve variable reference argument', function () {
        var container = sinon.createStubInstance(Container);
        container.getParameter.returns(42);

        var functionArgument = new FunctionArgument('%foo%');

        expect(functionArgument.resolve(container)).to.equals(42);
        expect(container.getParameter.calledOnce).to.be.true;
        expect(container.getService.called).to.be.false;
    });

    it('should resolve service reference argument', function () {
        var fakeService = function() {
        };

        var container = sinon.createStubInstance(Container);
        container.getService.returns(fakeService);

        var functionArgument = new FunctionArgument('@foo');

        expect(functionArgument.resolve(container)).to.equals(fakeService);
        expect(container.getParameter.called).to.be.false;
        expect(container.getService.calledOnce).to.be.true;
    });
});
