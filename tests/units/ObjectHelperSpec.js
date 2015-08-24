'use strict';

var expect = require('chai').expect;
var ObjectHelper = require('./../../src/ObjectHelper');

describe('ObjectHelper', function() {
    it('should create a new instance of given Object', function() {
        var fooFunction = function Foo(b) {
            this.a = 'a';
            this.b = b;
        };

        var fooInstance = ObjectHelper.createInstance(fooFunction, ['b']);

        expect(fooInstance).to.be.instanceof(fooFunction);
        expect(fooInstance.b).to.be.equal('b');
    });

    it('should deep clone an object', function() {
        var bar = 'bar'
        var foo = {
            keyA: 42,
            keyB: {
                keyBA: ['1', 2, 3.0]
            },
            keyC: bar
        };

        var clonedFoo = ObjectHelper.clone(foo);

        expect(clonedFoo).to.be.deep.equal(foo);
    });
});
