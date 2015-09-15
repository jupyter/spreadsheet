var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, S. Chris Colbert
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
var tests;
(function (tests) {
    var disconnectReceiver = phosphor.core.disconnectReceiver;
    var disconnectSender = phosphor.core.disconnectSender;
    var sender = phosphor.core.sender;
    var signal = phosphor.core.signal;
    var TestObject = (function () {
        function TestObject() {
        }
        __decorate([
            signal
        ], TestObject.prototype, "one");
        __decorate([
            signal
        ], TestObject.prototype, "two");
        __decorate([
            signal
        ], TestObject.prototype, "three");
        return TestObject;
    })();
    var TestHandler = (function () {
        function TestHandler() {
            this.name = '';
            this.oneCount = 0;
            this.twoValue = false;
        }
        TestHandler.prototype.onOne = function () {
            this.oneCount++;
        };
        TestHandler.prototype.onTwo = function (args) {
            this.twoValue = args;
        };
        TestHandler.prototype.onThree = function (args) {
            args.push(this.name);
        };
        TestHandler.prototype.onThrow = function () {
            throw new Error();
        };
        return TestHandler;
    })();
    describe('phosphor.core - signaling', function () {
        describe('ISignal', function () {
            describe('#connect()', function () {
                it('should return true on success', function () {
                    var obj = new TestObject();
                    var handler = new TestHandler();
                    var c1 = obj.one.connect(handler.onOne, handler);
                    expect(c1).to.be(true);
                });
                it('should return false on failure', function () {
                    var obj = new TestObject();
                    var handler = new TestHandler();
                    var c1 = obj.one.connect(handler.onOne, handler);
                    var c2 = obj.one.connect(handler.onOne, handler);
                    expect(c1).to.be(true);
                    expect(c2).to.be(false);
                });
                it('should connect plain functions', function () {
                    var obj = new TestObject();
                    var handler = new TestHandler();
                    var c1 = obj.one.connect(handler.onThrow);
                    expect(c1).to.be(true);
                });
                it('should ignore duplicate connections', function () {
                    var obj = new TestObject();
                    var handler = new TestHandler();
                    var c1 = obj.one.connect(handler.onOne, handler);
                    var c2 = obj.one.connect(handler.onOne, handler);
                    var c3 = obj.two.connect(handler.onTwo, handler);
                    var c4 = obj.two.connect(handler.onTwo, handler);
                    obj.one.emit(void 0);
                    obj.two.emit(true);
                    expect(c1).to.be(true);
                    expect(c2).to.be(false);
                    expect(c3).to.be(true);
                    expect(c4).to.be(false);
                    expect(handler.oneCount).to.be(1);
                    expect(handler.twoValue).to.be(true);
                });
            });
            describe('#disconnect()', function () {
                it('should return true on success', function () {
                    var obj = new TestObject();
                    var handler = new TestHandler();
                    obj.one.connect(handler.onOne, handler);
                    var d1 = obj.one.disconnect(handler.onOne, handler);
                    expect(d1).to.be(true);
                });
                it('should return false on failure', function () {
                    var obj = new TestObject();
                    var handler = new TestHandler();
                    var d1 = obj.one.disconnect(handler.onOne, handler);
                    expect(d1).to.be(false);
                });
                it('should disconnect a specific signal', function () {
                    var obj1 = new TestObject();
                    var obj2 = new TestObject();
                    var handler1 = new TestHandler();
                    var handler2 = new TestHandler();
                    obj1.one.connect(handler1.onOne, handler1);
                    obj2.one.connect(handler2.onOne, handler2);
                    var d1 = obj1.one.disconnect(handler1.onOne, handler1);
                    var d2 = obj1.one.disconnect(handler1.onOne, handler1);
                    obj1.one.emit(void 0);
                    obj2.one.emit(void 0);
                    expect(d1).to.be(true);
                    expect(d2).to.be(false);
                    expect(handler1.oneCount).to.be(0);
                    expect(handler2.oneCount).to.be(1);
                });
            });
            describe('#emit()', function () {
                it('should invoke handlers in connection order', function () {
                    var obj1 = new TestObject();
                    var handler1 = new TestHandler();
                    var handler2 = new TestHandler();
                    var handler3 = new TestHandler();
                    handler1.name = 'foo';
                    handler2.name = 'bar';
                    handler3.name = 'baz';
                    obj1.three.connect(handler1.onThree, handler1);
                    obj1.one.connect(handler1.onOne, handler1);
                    obj1.three.connect(handler2.onThree, handler2);
                    obj1.three.connect(handler3.onThree, handler3);
                    var names = [];
                    obj1.three.emit(names);
                    obj1.one.emit(void 0);
                    expect(names).to.eql(['foo', 'bar', 'baz']);
                    expect(handler1.oneCount).to.be(1);
                    expect(handler2.oneCount).to.be(0);
                });
                it('should immediately propagate a handler exception', function () {
                    var obj1 = new TestObject();
                    var handler1 = new TestHandler();
                    var handler2 = new TestHandler();
                    var handler3 = new TestHandler();
                    handler1.name = 'foo';
                    handler2.name = 'bar';
                    handler3.name = 'baz';
                    obj1.three.connect(handler1.onThree, handler1);
                    obj1.three.connect(handler2.onThrow, handler2);
                    obj1.three.connect(handler3.onThree, handler3);
                    var threw = false;
                    var names1 = [];
                    try {
                        obj1.three.emit(names1);
                    }
                    catch (e) {
                        threw = true;
                    }
                    obj1.three.disconnect(handler2.onThrow, handler2);
                    var names2 = [];
                    obj1.three.emit(names2);
                    expect(threw).to.be(true);
                    expect(names1).to.eql(['foo']);
                    expect(names2).to.eql(['foo', 'baz']);
                });
                it('should not invoke signals added during emission', function () {
                    var obj1 = new TestObject();
                    var handler1 = new TestHandler();
                    var handler2 = new TestHandler();
                    var handler3 = new TestHandler();
                    handler1.name = 'foo';
                    handler2.name = 'bar';
                    handler3.name = 'baz';
                    var adder = {
                        add: function () {
                            obj1.three.connect(handler3.onThree, handler3);
                        },
                    };
                    obj1.three.connect(handler1.onThree, handler1);
                    obj1.three.connect(handler2.onThree, handler2);
                    obj1.three.connect(adder.add, adder);
                    var names1 = [];
                    obj1.three.emit(names1);
                    obj1.three.disconnect(adder.add, adder);
                    var names2 = [];
                    obj1.three.emit(names2);
                    expect(names1).to.eql(['foo', 'bar']);
                    expect(names2).to.eql(['foo', 'bar', 'baz']);
                });
                it('should not invoke signals removed during emission', function () {
                    var obj1 = new TestObject();
                    var handler1 = new TestHandler();
                    var handler2 = new TestHandler();
                    var handler3 = new TestHandler();
                    handler1.name = 'foo';
                    handler2.name = 'bar';
                    handler3.name = 'baz';
                    var remover = {
                        remove: function () {
                            obj1.three.disconnect(handler3.onThree, handler3);
                        },
                    };
                    obj1.three.connect(handler1.onThree, handler1);
                    obj1.three.connect(handler2.onThree, handler2);
                    obj1.three.connect(remover.remove, remover);
                    obj1.three.connect(handler3.onThree, handler3);
                    var names = [];
                    obj1.three.emit(names);
                    expect(names).to.eql(['foo', 'bar']);
                });
            });
        });
        describe('sender()', function () {
            it('should return the current signal emitter', function () {
                var obj1 = new TestObject();
                var target = null;
                var handler = function () { target = sender(); };
                obj1.one.connect(handler);
                obj1.one.emit(void 0);
                expect(target).to.be(obj1);
            });
            it('should handle nested dispatch', function () {
                var obj1 = new TestObject();
                var obj2 = new TestObject();
                var targets = [];
                var func1 = function () { targets.push(sender()); };
                var func2 = function () {
                    targets.push(sender());
                    obj1.one.emit(void 0);
                    targets.push(sender());
                };
                obj1.one.connect(func1);
                obj2.one.connect(func2);
                obj2.one.emit(void 0);
                expect(targets).to.eql([obj1, obj2, obj1]);
            });
        });
        describe('disconnectSender()', function () {
            it('should disconnect all signals from a specific sender', function () {
                var obj1 = new TestObject();
                var obj2 = new TestObject();
                var handler1 = new TestHandler();
                var handler2 = new TestHandler();
                obj1.one.connect(handler1.onOne, handler1);
                obj1.one.connect(handler2.onOne, handler2);
                obj2.one.connect(handler1.onOne, handler1);
                obj2.one.connect(handler2.onOne, handler2);
                disconnectSender(obj1);
                obj1.one.emit(void 0);
                obj2.one.emit(void 0);
                expect(handler1.oneCount).to.be(1);
                expect(handler2.oneCount).to.be(1);
            });
        });
        describe('disconnectReceiver()', function () {
            it('should disconnect all signals from a specific receiver', function () {
                var obj1 = new TestObject();
                var obj2 = new TestObject();
                var handler1 = new TestHandler();
                var handler2 = new TestHandler();
                obj1.one.connect(handler1.onOne, handler1);
                obj1.one.connect(handler2.onOne, handler2);
                obj2.one.connect(handler1.onOne, handler1);
                obj2.one.connect(handler2.onOne, handler2);
                obj2.two.connect(handler1.onTwo, handler1);
                obj2.two.connect(handler2.onTwo, handler2);
                disconnectReceiver(handler1);
                obj1.one.emit(void 0);
                obj2.one.emit(void 0);
                obj2.two.emit(true);
                expect(handler1.oneCount).to.be(0);
                expect(handler2.oneCount).to.be(2);
                expect(handler1.twoValue).to.be(false);
                expect(handler2.twoValue).to.be(true);
            });
        });
    });
})(tests || (tests = {})); // module tests
