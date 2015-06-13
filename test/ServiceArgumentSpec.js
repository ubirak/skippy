'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var Container = require('./../src/Container');
var ServiceArgument = require('./../src/ServiceArgument');

describe('ServiceArgument', function () {
    it('should not process simple argument', function () {
        var serviceArgument = new ServiceArgument('foo');

        var container = new Container([], {});
        sinon.spy(container, 'getParameter');
        sinon.spy(container, 'getService');

        expect(serviceArgument.getValue(container)).to.equal('foo');
        expect(container.getParameter.called).to.be.false;
        expect(container.getService.called).to.be.false;
    });

    it.skip('should process variable reference argument', function () {
    });

    it.skip('should process service reference argument', function () {
    });
});
