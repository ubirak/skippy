'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var CallCollection = require('./../../src/CallCollection');
var Call = require('./../../src/Call');

describe('CallCollection', function() {
    it('should accept Call instance', function() {
        var calls = [
            sinon.createStubInstance(Call),
            sinon.createStubInstance(Call),
            sinon.createStubInstance(Call),
            sinon.createStubInstance(Call),
            sinon.createStubInstance(Call)
        ];

        expect(function () {
            var callCollection = new CallCollection(calls);
        }).to.not.throw();
    });

    it('should only accept Call instance', function() {
        var calls = [
            sinon.createStubInstance(Call),
            sinon.createStubInstance(Call),
            sinon.createStubInstance(Call),
            42,
            sinon.createStubInstance(Call)
        ];

        expect(function () {
            var callCollection = new CallCollection(calls);
        }).to.throw(Error, 'Wrong paramater type at position #3. Only accept Call instance.');
    });

    it('should inform if it\'s an empty collection', function() {
        var calls = [
            sinon.createStubInstance(Call),
            sinon.createStubInstance(Call),
            sinon.createStubInstance(Call)
        ];

        var callCollection = new CallCollection(calls);
        expect(callCollection.isEmpty()).to.be.false;

        var emptyCallCollection = new CallCollection([]);
        expect(emptyCallCollection.isEmpty()).to.be.true;
    });

    it('should call a callback on each element', function() {
        var calls = [
            sinon.createStubInstance(Call),
            sinon.createStubInstance(Call),
            sinon.createStubInstance(Call),
            sinon.createStubInstance(Call),
            sinon.createStubInstance(Call)
        ];

        var cb = sinon.spy();

        var callCollection = new CallCollection(calls);

        callCollection.each(cb);

        expect(cb).to.have.callCount(5);
        expect(cb.getCall(0)).to.have.been.calledWith(calls[0]);
        expect(cb.getCall(1)).to.have.been.calledWith(calls[1]);
        expect(cb.getCall(2)).to.have.been.calledWith(calls[2]);
        expect(cb.getCall(3)).to.have.been.calledWith(calls[3]);
        expect(cb.getCall(4)).to.have.been.calledWith(calls[4]);
    });
});
