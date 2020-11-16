function unwrapExports(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default")
    ? x["default"]
    : x;
}

function createCommonjsModule(fn, module) {
  return (module = { exports: {} }), fn(module, module.exports), module.exports;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }

  return _typeof(obj);
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

/* global Reflect, Promise */
var _extendStatics = function extendStatics(d, b) {
  _extendStatics =
    Object.setPrototypeOf ||
    ({
      __proto__: [],
    } instanceof Array &&
      function (d, b) {
        d.__proto__ = b;
      }) ||
    function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

  return _extendStatics(d, b);
};

function __extends(d, b) {
  _extendStatics(d, b);

  function __() {
    this.constructor = d;
  }

  d.prototype =
    b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isFunction(x) {
  return typeof x === "function";
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var _enable_super_gross_mode_that_will_cause_bad_things = false;
var config = {
  Promise: undefined,

  set useDeprecatedSynchronousErrorHandling(value) {
    if (value) {
      var error = /*@__PURE__*/ new Error();
      /*@__PURE__*/

      console.warn(
        "DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n" +
          error.stack
      );
    }

    _enable_super_gross_mode_that_will_cause_bad_things = value;
  },

  get useDeprecatedSynchronousErrorHandling() {
    return _enable_super_gross_mode_that_will_cause_bad_things;
  },
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function hostReportError(err) {
  setTimeout(function () {
    throw err;
  }, 0);
}

/** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
var empty = {
  closed: true,
  next: function next(value) {},
  error: function error(err) {
    if (config.useDeprecatedSynchronousErrorHandling) {
      throw err;
    } else {
      hostReportError(err);
    }
  },
  complete: function complete() {},
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArray = /*@__PURE__*/ (function () {
  return (
    Array.isArray ||
    function (x) {
      return x && typeof x.length === "number";
    }
  );
})();

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isObject(x) {
  return x !== null && _typeof(x) === "object";
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var UnsubscriptionErrorImpl = /*@__PURE__*/ (function () {
  function UnsubscriptionErrorImpl(errors) {
    Error.call(this);
    this.message = errors
      ? errors.length +
        " errors occurred during unsubscription:\n" +
        errors
          .map(function (err, i) {
            return i + 1 + ") " + err.toString();
          })
          .join("\n  ")
      : "";
    this.name = "UnsubscriptionError";
    this.errors = errors;
    return this;
  }

  UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(
    Error.prototype
  );
  return UnsubscriptionErrorImpl;
})();

var UnsubscriptionError = UnsubscriptionErrorImpl;

var Subscription = /*@__PURE__*/ (function () {
  function Subscription(unsubscribe) {
    this.closed = false;
    this._parentOrParents = null;
    this._subscriptions = null;

    if (unsubscribe) {
      this._unsubscribe = unsubscribe;
    }
  }

  Subscription.prototype.unsubscribe = function () {
    var errors;

    if (this.closed) {
      return;
    }

    var _a = this,
      _parentOrParents = _a._parentOrParents,
      _unsubscribe = _a._unsubscribe,
      _subscriptions = _a._subscriptions;

    this.closed = true;
    this._parentOrParents = null;
    this._subscriptions = null;

    if (_parentOrParents instanceof Subscription) {
      _parentOrParents.remove(this);
    } else if (_parentOrParents !== null) {
      for (var index = 0; index < _parentOrParents.length; ++index) {
        var parent_1 = _parentOrParents[index];
        parent_1.remove(this);
      }
    }

    if (isFunction(_unsubscribe)) {
      try {
        _unsubscribe.call(this);
      } catch (e) {
        errors =
          e instanceof UnsubscriptionError
            ? flattenUnsubscriptionErrors(e.errors)
            : [e];
      }
    }

    if (isArray(_subscriptions)) {
      var index = -1;
      var len = _subscriptions.length;

      while (++index < len) {
        var sub = _subscriptions[index];

        if (isObject(sub)) {
          try {
            sub.unsubscribe();
          } catch (e) {
            errors = errors || [];

            if (e instanceof UnsubscriptionError) {
              errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
            } else {
              errors.push(e);
            }
          }
        }
      }
    }

    if (errors) {
      throw new UnsubscriptionError(errors);
    }
  };

  Subscription.prototype.add = function (teardown) {
    var subscription = teardown;

    if (!teardown) {
      return Subscription.EMPTY;
    }

    switch (_typeof(teardown)) {
      case "function":
        subscription = new Subscription(teardown);

      case "object":
        if (
          subscription === this ||
          subscription.closed ||
          typeof subscription.unsubscribe !== "function"
        ) {
          return subscription;
        } else if (this.closed) {
          subscription.unsubscribe();
          return subscription;
        } else if (!(subscription instanceof Subscription)) {
          var tmp = subscription;
          subscription = new Subscription();
          subscription._subscriptions = [tmp];
        }

        break;

      default: {
        throw new Error(
          "unrecognized teardown " + teardown + " added to Subscription."
        );
      }
    }

    var _parentOrParents = subscription._parentOrParents;

    if (_parentOrParents === null) {
      subscription._parentOrParents = this;
    } else if (_parentOrParents instanceof Subscription) {
      if (_parentOrParents === this) {
        return subscription;
      }

      subscription._parentOrParents = [_parentOrParents, this];
    } else if (_parentOrParents.indexOf(this) === -1) {
      _parentOrParents.push(this);
    } else {
      return subscription;
    }

    var subscriptions = this._subscriptions;

    if (subscriptions === null) {
      this._subscriptions = [subscription];
    } else {
      subscriptions.push(subscription);
    }

    return subscription;
  };

  Subscription.prototype.remove = function (subscription) {
    var subscriptions = this._subscriptions;

    if (subscriptions) {
      var subscriptionIndex = subscriptions.indexOf(subscription);

      if (subscriptionIndex !== -1) {
        subscriptions.splice(subscriptionIndex, 1);
      }
    }
  };

  Subscription.EMPTY = (function (empty) {
    empty.closed = true;
    return empty;
  })(new Subscription());

  return Subscription;
})();

function flattenUnsubscriptionErrors(errors) {
  return errors.reduce(function (errs, err) {
    return errs.concat(err instanceof UnsubscriptionError ? err.errors : err);
  }, []);
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var rxSubscriber = /*@__PURE__*/ (function () {
  return typeof Symbol === "function"
    ? /*@__PURE__*/ Symbol("rxSubscriber")
    : "@@rxSubscriber_" + /*@__PURE__*/ Math.random();
})();

var Subscriber = /*@__PURE__*/ (function (_super) {
  __extends(Subscriber, _super);

  function Subscriber(destinationOrNext, error, complete) {
    var _this = _super.call(this) || this;

    _this.syncErrorValue = null;
    _this.syncErrorThrown = false;
    _this.syncErrorThrowable = false;
    _this.isStopped = false;

    switch (arguments.length) {
      case 0:
        _this.destination = empty;
        break;

      case 1:
        if (!destinationOrNext) {
          _this.destination = empty;
          break;
        }

        if (_typeof(destinationOrNext) === "object") {
          if (destinationOrNext instanceof Subscriber) {
            _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
            _this.destination = destinationOrNext;
            destinationOrNext.add(_this);
          } else {
            _this.syncErrorThrowable = true;
            _this.destination = new SafeSubscriber(_this, destinationOrNext);
          }

          break;
        }

      default:
        _this.syncErrorThrowable = true;
        _this.destination = new SafeSubscriber(
          _this,
          destinationOrNext,
          error,
          complete
        );
        break;
    }

    return _this;
  }

  Subscriber.prototype[rxSubscriber] = function () {
    return this;
  };

  Subscriber.create = function (next, error, complete) {
    var subscriber = new Subscriber(next, error, complete);
    subscriber.syncErrorThrowable = false;
    return subscriber;
  };

  Subscriber.prototype.next = function (value) {
    if (!this.isStopped) {
      this._next(value);
    }
  };

  Subscriber.prototype.error = function (err) {
    if (!this.isStopped) {
      this.isStopped = true;

      this._error(err);
    }
  };

  Subscriber.prototype.complete = function () {
    if (!this.isStopped) {
      this.isStopped = true;

      this._complete();
    }
  };

  Subscriber.prototype.unsubscribe = function () {
    if (this.closed) {
      return;
    }

    this.isStopped = true;

    _super.prototype.unsubscribe.call(this);
  };

  Subscriber.prototype._next = function (value) {
    this.destination.next(value);
  };

  Subscriber.prototype._error = function (err) {
    this.destination.error(err);
    this.unsubscribe();
  };

  Subscriber.prototype._complete = function () {
    this.destination.complete();
    this.unsubscribe();
  };

  Subscriber.prototype._unsubscribeAndRecycle = function () {
    var _parentOrParents = this._parentOrParents;
    this._parentOrParents = null;
    this.unsubscribe();
    this.closed = false;
    this.isStopped = false;
    this._parentOrParents = _parentOrParents;
    return this;
  };

  return Subscriber;
})(Subscription);

var SafeSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(SafeSubscriber, _super);

  function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
    var _this = _super.call(this) || this;

    _this._parentSubscriber = _parentSubscriber;
    var next;
    var context = _this;

    if (isFunction(observerOrNext)) {
      next = observerOrNext;
    } else if (observerOrNext) {
      next = observerOrNext.next;
      error = observerOrNext.error;
      complete = observerOrNext.complete;

      if (observerOrNext !== empty) {
        context = Object.create(observerOrNext);

        if (isFunction(context.unsubscribe)) {
          _this.add(context.unsubscribe.bind(context));
        }

        context.unsubscribe = _this.unsubscribe.bind(_this);
      }
    }

    _this._context = context;
    _this._next = next;
    _this._error = error;
    _this._complete = complete;
    return _this;
  }

  SafeSubscriber.prototype.next = function (value) {
    if (!this.isStopped && this._next) {
      var _parentSubscriber = this._parentSubscriber;

      if (
        !config.useDeprecatedSynchronousErrorHandling ||
        !_parentSubscriber.syncErrorThrowable
      ) {
        this.__tryOrUnsub(this._next, value);
      } else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
        this.unsubscribe();
      }
    }
  };

  SafeSubscriber.prototype.error = function (err) {
    if (!this.isStopped) {
      var _parentSubscriber = this._parentSubscriber;
      var useDeprecatedSynchronousErrorHandling =
        config.useDeprecatedSynchronousErrorHandling;

      if (this._error) {
        if (
          !useDeprecatedSynchronousErrorHandling ||
          !_parentSubscriber.syncErrorThrowable
        ) {
          this.__tryOrUnsub(this._error, err);

          this.unsubscribe();
        } else {
          this.__tryOrSetError(_parentSubscriber, this._error, err);

          this.unsubscribe();
        }
      } else if (!_parentSubscriber.syncErrorThrowable) {
        this.unsubscribe();

        if (useDeprecatedSynchronousErrorHandling) {
          throw err;
        }

        hostReportError(err);
      } else {
        if (useDeprecatedSynchronousErrorHandling) {
          _parentSubscriber.syncErrorValue = err;
          _parentSubscriber.syncErrorThrown = true;
        } else {
          hostReportError(err);
        }

        this.unsubscribe();
      }
    }
  };

  SafeSubscriber.prototype.complete = function () {
    var _this = this;

    if (!this.isStopped) {
      var _parentSubscriber = this._parentSubscriber;

      if (this._complete) {
        var wrappedComplete = function wrappedComplete() {
          return _this._complete.call(_this._context);
        };

        if (
          !config.useDeprecatedSynchronousErrorHandling ||
          !_parentSubscriber.syncErrorThrowable
        ) {
          this.__tryOrUnsub(wrappedComplete);

          this.unsubscribe();
        } else {
          this.__tryOrSetError(_parentSubscriber, wrappedComplete);

          this.unsubscribe();
        }
      } else {
        this.unsubscribe();
      }
    }
  };

  SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
    try {
      fn.call(this._context, value);
    } catch (err) {
      this.unsubscribe();

      if (config.useDeprecatedSynchronousErrorHandling) {
        throw err;
      } else {
        hostReportError(err);
      }
    }
  };

  SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
    if (!config.useDeprecatedSynchronousErrorHandling) {
      throw new Error("bad call");
    }

    try {
      fn.call(this._context, value);
    } catch (err) {
      if (config.useDeprecatedSynchronousErrorHandling) {
        parent.syncErrorValue = err;
        parent.syncErrorThrown = true;
        return true;
      } else {
        hostReportError(err);
        return true;
      }
    }

    return false;
  };

  SafeSubscriber.prototype._unsubscribe = function () {
    var _parentSubscriber = this._parentSubscriber;
    this._context = null;
    this._parentSubscriber = null;

    _parentSubscriber.unsubscribe();
  };

  return SafeSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
function canReportError(observer) {
  while (observer) {
    var _a = observer,
      closed_1 = _a.closed,
      destination = _a.destination,
      isStopped = _a.isStopped;

    if (closed_1 || isStopped) {
      return false;
    } else if (destination && destination instanceof Subscriber) {
      observer = destination;
    } else {
      observer = null;
    }
  }

  return true;
}

/** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
function toSubscriber(nextOrObserver, error, complete) {
  if (nextOrObserver) {
    if (nextOrObserver instanceof Subscriber) {
      return nextOrObserver;
    }

    if (nextOrObserver[rxSubscriber]) {
      return nextOrObserver[rxSubscriber]();
    }
  }

  if (!nextOrObserver && !error && !complete) {
    return new Subscriber(empty);
  }

  return new Subscriber(nextOrObserver, error, complete);
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var observable = /*@__PURE__*/ (function () {
  return (typeof Symbol === "function" && Symbol.observable) || "@@observable";
})();

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function identity(x) {
  return x;
}

/** PURE_IMPORTS_START _identity PURE_IMPORTS_END */
function pipe() {
  var fns = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    fns[_i] = arguments[_i];
  }

  return pipeFromArray(fns);
}
function pipeFromArray(fns) {
  if (fns.length === 0) {
    return identity;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return function piped(input) {
    return fns.reduce(function (prev, fn) {
      return fn(prev);
    }, input);
  };
}

/** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */

var Observable = /*@__PURE__*/ (function () {
  function Observable(subscribe) {
    this._isScalar = false;

    if (subscribe) {
      this._subscribe = subscribe;
    }
  }

  Observable.prototype.lift = function (operator) {
    var observable = new Observable();
    observable.source = this;
    observable.operator = operator;
    return observable;
  };

  Observable.prototype.subscribe = function (observerOrNext, error, complete) {
    var operator = this.operator;
    var sink = toSubscriber(observerOrNext, error, complete);

    if (operator) {
      sink.add(operator.call(sink, this.source));
    } else {
      sink.add(
        this.source ||
          (config.useDeprecatedSynchronousErrorHandling &&
            !sink.syncErrorThrowable)
          ? this._subscribe(sink)
          : this._trySubscribe(sink)
      );
    }

    if (config.useDeprecatedSynchronousErrorHandling) {
      if (sink.syncErrorThrowable) {
        sink.syncErrorThrowable = false;

        if (sink.syncErrorThrown) {
          throw sink.syncErrorValue;
        }
      }
    }

    return sink;
  };

  Observable.prototype._trySubscribe = function (sink) {
    try {
      return this._subscribe(sink);
    } catch (err) {
      if (config.useDeprecatedSynchronousErrorHandling) {
        sink.syncErrorThrown = true;
        sink.syncErrorValue = err;
      }

      if (canReportError(sink)) {
        sink.error(err);
      } else {
        console.warn(err);
      }
    }
  };

  Observable.prototype.forEach = function (next, promiseCtor) {
    var _this = this;

    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function (resolve, reject) {
      var subscription;
      subscription = _this.subscribe(
        function (value) {
          try {
            next(value);
          } catch (err) {
            reject(err);

            if (subscription) {
              subscription.unsubscribe();
            }
          }
        },
        reject,
        resolve
      );
    });
  };

  Observable.prototype._subscribe = function (subscriber) {
    var source = this.source;
    return source && source.subscribe(subscriber);
  };

  Observable.prototype[observable] = function () {
    return this;
  };

  Observable.prototype.pipe = function () {
    var operations = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      operations[_i] = arguments[_i];
    }

    if (operations.length === 0) {
      return this;
    }

    return pipeFromArray(operations)(this);
  };

  Observable.prototype.toPromise = function (promiseCtor) {
    var _this = this;

    promiseCtor = getPromiseCtor(promiseCtor);
    return new promiseCtor(function (resolve, reject) {
      var value;

      _this.subscribe(
        function (x) {
          return (value = x);
        },
        function (err) {
          return reject(err);
        },
        function () {
          return resolve(value);
        }
      );
    });
  };

  Observable.create = function (subscribe) {
    return new Observable(subscribe);
  };

  return Observable;
})();

function getPromiseCtor(promiseCtor) {
  if (!promiseCtor) {
    promiseCtor = config.Promise || Promise;
  }

  if (!promiseCtor) {
    throw new Error("no Promise impl found");
  }

  return promiseCtor;
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var ObjectUnsubscribedErrorImpl = /*@__PURE__*/ (function () {
  function ObjectUnsubscribedErrorImpl() {
    Error.call(this);
    this.message = "object unsubscribed";
    this.name = "ObjectUnsubscribedError";
    return this;
  }

  ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/ Object.create(
    Error.prototype
  );
  return ObjectUnsubscribedErrorImpl;
})();

var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */

var SubjectSubscription = /*@__PURE__*/ (function (_super) {
  __extends(SubjectSubscription, _super);

  function SubjectSubscription(subject, subscriber) {
    var _this = _super.call(this) || this;

    _this.subject = subject;
    _this.subscriber = subscriber;
    _this.closed = false;
    return _this;
  }

  SubjectSubscription.prototype.unsubscribe = function () {
    if (this.closed) {
      return;
    }

    this.closed = true;
    var subject = this.subject;
    var observers = subject.observers;
    this.subject = null;

    if (
      !observers ||
      observers.length === 0 ||
      subject.isStopped ||
      subject.closed
    ) {
      return;
    }

    var subscriberIndex = observers.indexOf(this.subscriber);

    if (subscriberIndex !== -1) {
      observers.splice(subscriberIndex, 1);
    }
  };

  return SubjectSubscription;
})(Subscription);

/** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */

var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(SubjectSubscriber, _super);

  function SubjectSubscriber(destination) {
    var _this = _super.call(this, destination) || this;

    _this.destination = destination;
    return _this;
  }

  return SubjectSubscriber;
})(Subscriber);

var Subject = /*@__PURE__*/ (function (_super) {
  __extends(Subject, _super);

  function Subject() {
    var _this = _super.call(this) || this;

    _this.observers = [];
    _this.closed = false;
    _this.isStopped = false;
    _this.hasError = false;
    _this.thrownError = null;
    return _this;
  }

  Subject.prototype[rxSubscriber] = function () {
    return new SubjectSubscriber(this);
  };

  Subject.prototype.lift = function (operator) {
    var subject = new AnonymousSubject(this, this);
    subject.operator = operator;
    return subject;
  };

  Subject.prototype.next = function (value) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }

    if (!this.isStopped) {
      var observers = this.observers;
      var len = observers.length;
      var copy = observers.slice();

      for (var i = 0; i < len; i++) {
        copy[i].next(value);
      }
    }
  };

  Subject.prototype.error = function (err) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }

    this.hasError = true;
    this.thrownError = err;
    this.isStopped = true;
    var observers = this.observers;
    var len = observers.length;
    var copy = observers.slice();

    for (var i = 0; i < len; i++) {
      copy[i].error(err);
    }

    this.observers.length = 0;
  };

  Subject.prototype.complete = function () {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    }

    this.isStopped = true;
    var observers = this.observers;
    var len = observers.length;
    var copy = observers.slice();

    for (var i = 0; i < len; i++) {
      copy[i].complete();
    }

    this.observers.length = 0;
  };

  Subject.prototype.unsubscribe = function () {
    this.isStopped = true;
    this.closed = true;
    this.observers = null;
  };

  Subject.prototype._trySubscribe = function (subscriber) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else {
      return _super.prototype._trySubscribe.call(this, subscriber);
    }
  };

  Subject.prototype._subscribe = function (subscriber) {
    if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else if (this.hasError) {
      subscriber.error(this.thrownError);
      return Subscription.EMPTY;
    } else if (this.isStopped) {
      subscriber.complete();
      return Subscription.EMPTY;
    } else {
      this.observers.push(subscriber);
      return new SubjectSubscription(this, subscriber);
    }
  };

  Subject.prototype.asObservable = function () {
    var observable = new Observable();
    observable.source = this;
    return observable;
  };

  Subject.create = function (destination, source) {
    return new AnonymousSubject(destination, source);
  };

  return Subject;
})(Observable);

var AnonymousSubject = /*@__PURE__*/ (function (_super) {
  __extends(AnonymousSubject, _super);

  function AnonymousSubject(destination, source) {
    var _this = _super.call(this) || this;

    _this.destination = destination;
    _this.source = source;
    return _this;
  }

  AnonymousSubject.prototype.next = function (value) {
    var destination = this.destination;

    if (destination && destination.next) {
      destination.next(value);
    }
  };

  AnonymousSubject.prototype.error = function (err) {
    var destination = this.destination;

    if (destination && destination.error) {
      this.destination.error(err);
    }
  };

  AnonymousSubject.prototype.complete = function () {
    var destination = this.destination;

    if (destination && destination.complete) {
      this.destination.complete();
    }
  };

  AnonymousSubject.prototype._subscribe = function (subscriber) {
    var source = this.source;

    if (source) {
      return this.source.subscribe(subscriber);
    } else {
      return Subscription.EMPTY;
    }
  };

  return AnonymousSubject;
})(Subject);

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function refCount() {
  return function refCountOperatorFunction(source) {
    return source.lift(new RefCountOperator(source));
  };
}

var RefCountOperator = /*@__PURE__*/ (function () {
  function RefCountOperator(connectable) {
    this.connectable = connectable;
  }

  RefCountOperator.prototype.call = function (subscriber, source) {
    var connectable = this.connectable;
    connectable._refCount++;
    var refCounter = new RefCountSubscriber(subscriber, connectable);
    var subscription = source.subscribe(refCounter);

    if (!refCounter.closed) {
      refCounter.connection = connectable.connect();
    }

    return subscription;
  };

  return RefCountOperator;
})();

var RefCountSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(RefCountSubscriber, _super);

  function RefCountSubscriber(destination, connectable) {
    var _this = _super.call(this, destination) || this;

    _this.connectable = connectable;
    return _this;
  }

  RefCountSubscriber.prototype._unsubscribe = function () {
    var connectable = this.connectable;

    if (!connectable) {
      this.connection = null;
      return;
    }

    this.connectable = null;
    var refCount = connectable._refCount;

    if (refCount <= 0) {
      this.connection = null;
      return;
    }

    connectable._refCount = refCount - 1;

    if (refCount > 1) {
      this.connection = null;
      return;
    }

    var connection = this.connection;
    var sharedConnection = connectable._connection;
    this.connection = null;

    if (sharedConnection && (!connection || sharedConnection === connection)) {
      sharedConnection.unsubscribe();
    }
  };

  return RefCountSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START tslib,_Subject,_Observable,_Subscriber,_Subscription,_operators_refCount PURE_IMPORTS_END */

var ConnectableObservable = /*@__PURE__*/ (function (_super) {
  __extends(ConnectableObservable, _super);

  function ConnectableObservable(source, subjectFactory) {
    var _this = _super.call(this) || this;

    _this.source = source;
    _this.subjectFactory = subjectFactory;
    _this._refCount = 0;
    _this._isComplete = false;
    return _this;
  }

  ConnectableObservable.prototype._subscribe = function (subscriber) {
    return this.getSubject().subscribe(subscriber);
  };

  ConnectableObservable.prototype.getSubject = function () {
    var subject = this._subject;

    if (!subject || subject.isStopped) {
      this._subject = this.subjectFactory();
    }

    return this._subject;
  };

  ConnectableObservable.prototype.connect = function () {
    var connection = this._connection;

    if (!connection) {
      this._isComplete = false;
      connection = this._connection = new Subscription();
      connection.add(
        this.source.subscribe(
          new ConnectableSubscriber(this.getSubject(), this)
        )
      );

      if (connection.closed) {
        this._connection = null;
        connection = Subscription.EMPTY;
      }
    }

    return connection;
  };

  ConnectableObservable.prototype.refCount = function () {
    return refCount()(this);
  };

  return ConnectableObservable;
})(Observable);

var ConnectableSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(ConnectableSubscriber, _super);

  function ConnectableSubscriber(destination, connectable) {
    var _this = _super.call(this, destination) || this;

    _this.connectable = connectable;
    return _this;
  }

  ConnectableSubscriber.prototype._error = function (err) {
    this._unsubscribe();

    _super.prototype._error.call(this, err);
  };

  ConnectableSubscriber.prototype._complete = function () {
    this.connectable._isComplete = true;

    this._unsubscribe();

    _super.prototype._complete.call(this);
  };

  ConnectableSubscriber.prototype._unsubscribe = function () {
    var connectable = this.connectable;

    if (connectable) {
      this.connectable = null;
      var connection = connectable._connection;
      connectable._refCount = 0;
      connectable._subject = null;
      connectable._connection = null;

      if (connection) {
        connection.unsubscribe();
      }
    }
  };

  return ConnectableSubscriber;
})(SubjectSubscriber);

/** PURE_IMPORTS_START tslib,_Subscriber,_Subscription,_Observable,_Subject PURE_IMPORTS_END */

var GroupedObservable = /*@__PURE__*/ (function (_super) {
  __extends(GroupedObservable, _super);

  function GroupedObservable(key, groupSubject, refCountSubscription) {
    var _this = _super.call(this) || this;

    _this.key = key;
    _this.groupSubject = groupSubject;
    _this.refCountSubscription = refCountSubscription;
    return _this;
  }

  GroupedObservable.prototype._subscribe = function (subscriber) {
    var subscription = new Subscription();

    var _a = this,
      refCountSubscription = _a.refCountSubscription,
      groupSubject = _a.groupSubject;

    if (refCountSubscription && !refCountSubscription.closed) {
      subscription.add(new InnerRefCountSubscription(refCountSubscription));
    }

    subscription.add(groupSubject.subscribe(subscriber));
    return subscription;
  };

  return GroupedObservable;
})(Observable);

var InnerRefCountSubscription = /*@__PURE__*/ (function (_super) {
  __extends(InnerRefCountSubscription, _super);

  function InnerRefCountSubscription(parent) {
    var _this = _super.call(this) || this;

    _this.parent = parent;
    parent.count++;
    return _this;
  }

  InnerRefCountSubscription.prototype.unsubscribe = function () {
    var parent = this.parent;

    if (!parent.closed && !this.closed) {
      _super.prototype.unsubscribe.call(this);

      parent.count -= 1;

      if (parent.count === 0 && parent.attemptedToUnsubscribe) {
        parent.unsubscribe();
      }
    }
  };

  return InnerRefCountSubscription;
})(Subscription);

/** PURE_IMPORTS_START tslib,_Subject,_util_ObjectUnsubscribedError PURE_IMPORTS_END */

var BehaviorSubject = /*@__PURE__*/ (function (_super) {
  __extends(BehaviorSubject, _super);

  function BehaviorSubject(_value) {
    var _this = _super.call(this) || this;

    _this._value = _value;
    return _this;
  }

  Object.defineProperty(BehaviorSubject.prototype, "value", {
    get: function get() {
      return this.getValue();
    },
    enumerable: true,
    configurable: true,
  });

  BehaviorSubject.prototype._subscribe = function (subscriber) {
    var subscription = _super.prototype._subscribe.call(this, subscriber);

    if (subscription && !subscription.closed) {
      subscriber.next(this._value);
    }

    return subscription;
  };

  BehaviorSubject.prototype.getValue = function () {
    if (this.hasError) {
      throw this.thrownError;
    } else if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else {
      return this._value;
    }
  };

  BehaviorSubject.prototype.next = function (value) {
    _super.prototype.next.call(this, (this._value = value));
  };

  return BehaviorSubject;
})(Subject);

/** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */

var Action = /*@__PURE__*/ (function (_super) {
  __extends(Action, _super);

  function Action(scheduler, work) {
    return _super.call(this) || this;
  }

  Action.prototype.schedule = function (state, delay) {
    return this;
  };

  return Action;
})(Subscription);

/** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */

var AsyncAction = /*@__PURE__*/ (function (_super) {
  __extends(AsyncAction, _super);

  function AsyncAction(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;

    _this.scheduler = scheduler;
    _this.work = work;
    _this.pending = false;
    return _this;
  }

  AsyncAction.prototype.schedule = function (state, delay) {
    if (delay === void 0) {
      delay = 0;
    }

    if (this.closed) {
      return this;
    }

    this.state = state;
    var id = this.id;
    var scheduler = this.scheduler;

    if (id != null) {
      this.id = this.recycleAsyncId(scheduler, id, delay);
    }

    this.pending = true;
    this.delay = delay;
    this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
    return this;
  };

  AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
    if (delay === void 0) {
      delay = 0;
    }

    return setInterval(scheduler.flush.bind(scheduler, this), delay);
  };

  AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
    if (delay === void 0) {
      delay = 0;
    }

    if (delay !== null && this.delay === delay && this.pending === false) {
      return id;
    }

    clearInterval(id);
    return undefined;
  };

  AsyncAction.prototype.execute = function (state, delay) {
    if (this.closed) {
      return new Error("executing a cancelled action");
    }

    this.pending = false;

    var error = this._execute(state, delay);

    if (error) {
      return error;
    } else if (this.pending === false && this.id != null) {
      this.id = this.recycleAsyncId(this.scheduler, this.id, null);
    }
  };

  AsyncAction.prototype._execute = function (state, delay) {
    var errored = false;
    var errorValue = undefined;

    try {
      this.work(state);
    } catch (e) {
      errored = true;
      errorValue = (!!e && e) || new Error(e);
    }

    if (errored) {
      this.unsubscribe();
      return errorValue;
    }
  };

  AsyncAction.prototype._unsubscribe = function () {
    var id = this.id;
    var scheduler = this.scheduler;
    var actions = scheduler.actions;
    var index = actions.indexOf(this);
    this.work = null;
    this.state = null;
    this.pending = false;
    this.scheduler = null;

    if (index !== -1) {
      actions.splice(index, 1);
    }

    if (id != null) {
      this.id = this.recycleAsyncId(scheduler, id, null);
    }

    this.delay = null;
  };

  return AsyncAction;
})(Action);

/** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */

var QueueAction = /*@__PURE__*/ (function (_super) {
  __extends(QueueAction, _super);

  function QueueAction(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;

    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }

  QueueAction.prototype.schedule = function (state, delay) {
    if (delay === void 0) {
      delay = 0;
    }

    if (delay > 0) {
      return _super.prototype.schedule.call(this, state, delay);
    }

    this.delay = delay;
    this.state = state;
    this.scheduler.flush(this);
    return this;
  };

  QueueAction.prototype.execute = function (state, delay) {
    return delay > 0 || this.closed
      ? _super.prototype.execute.call(this, state, delay)
      : this._execute(state, delay);
  };

  QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
    if (delay === void 0) {
      delay = 0;
    }

    if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
    }

    return scheduler.flush(this);
  };

  return QueueAction;
})(AsyncAction);

var Scheduler = /*@__PURE__*/ (function () {
  function Scheduler(SchedulerAction, now) {
    if (now === void 0) {
      now = Scheduler.now;
    }

    this.SchedulerAction = SchedulerAction;
    this.now = now;
  }

  Scheduler.prototype.schedule = function (work, delay, state) {
    if (delay === void 0) {
      delay = 0;
    }

    return new this.SchedulerAction(this, work).schedule(state, delay);
  };

  Scheduler.now = function () {
    return Date.now();
  };

  return Scheduler;
})();

/** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */

var AsyncScheduler = /*@__PURE__*/ (function (_super) {
  __extends(AsyncScheduler, _super);

  function AsyncScheduler(SchedulerAction, now) {
    if (now === void 0) {
      now = Scheduler.now;
    }

    var _this =
      _super.call(this, SchedulerAction, function () {
        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
          return AsyncScheduler.delegate.now();
        } else {
          return now();
        }
      }) || this;

    _this.actions = [];
    _this.active = false;
    _this.scheduled = undefined;
    return _this;
  }

  AsyncScheduler.prototype.schedule = function (work, delay, state) {
    if (delay === void 0) {
      delay = 0;
    }

    if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
      return AsyncScheduler.delegate.schedule(work, delay, state);
    } else {
      return _super.prototype.schedule.call(this, work, delay, state);
    }
  };

  AsyncScheduler.prototype.flush = function (action) {
    var actions = this.actions;

    if (this.active) {
      actions.push(action);
      return;
    }

    var error;
    this.active = true;

    do {
      if ((error = action.execute(action.state, action.delay))) {
        break;
      }
    } while ((action = actions.shift()));

    this.active = false;

    if (error) {
      while ((action = actions.shift())) {
        action.unsubscribe();
      }

      throw error;
    }
  };

  return AsyncScheduler;
})(Scheduler);

/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */

var QueueScheduler = /*@__PURE__*/ (function (_super) {
  __extends(QueueScheduler, _super);

  function QueueScheduler() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }

  return QueueScheduler;
})(AsyncScheduler);

/** PURE_IMPORTS_START _QueueAction,_QueueScheduler PURE_IMPORTS_END */
var queueScheduler = /*@__PURE__*/ new QueueScheduler(QueueAction);
var queue = queueScheduler;

/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
var EMPTY = /*@__PURE__*/ new Observable(function (subscriber) {
  return subscriber.complete();
});
function empty$1(scheduler) {
  return scheduler ? emptyScheduled(scheduler) : EMPTY;
}

function emptyScheduled(scheduler) {
  return new Observable(function (subscriber) {
    return scheduler.schedule(function () {
      return subscriber.complete();
    });
  });
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isScheduler(value) {
  return value && typeof value.schedule === "function";
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var subscribeToArray = function subscribeToArray(array) {
  return function (subscriber) {
    for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
      subscriber.next(array[i]);
    }

    subscriber.complete();
  };
};

/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
function scheduleArray(input, scheduler) {
  return new Observable(function (subscriber) {
    var sub = new Subscription();
    var i = 0;
    sub.add(
      scheduler.schedule(function () {
        if (i === input.length) {
          subscriber.complete();
          return;
        }

        subscriber.next(input[i++]);

        if (!subscriber.closed) {
          sub.add(this.schedule());
        }
      })
    );
    return sub;
  });
}

/** PURE_IMPORTS_START _Observable,_util_subscribeToArray,_scheduled_scheduleArray PURE_IMPORTS_END */
function fromArray(input, scheduler) {
  if (!scheduler) {
    return new Observable(subscribeToArray(input));
  } else {
    return scheduleArray(input, scheduler);
  }
}

/** PURE_IMPORTS_START _util_isScheduler,_fromArray,_scheduled_scheduleArray PURE_IMPORTS_END */
function of() {
  var args = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }

  var scheduler = args[args.length - 1];

  if (isScheduler(scheduler)) {
    args.pop();
    return scheduleArray(args, scheduler);
  } else {
    return fromArray(args);
  }
}

/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
function throwError(error, scheduler) {
  if (!scheduler) {
    return new Observable(function (subscriber) {
      return subscriber.error(error);
    });
  } else {
    return new Observable(function (subscriber) {
      return scheduler.schedule(dispatch, 0, {
        error: error,
        subscriber: subscriber,
      });
    });
  }
}

function dispatch(_a) {
  var error = _a.error,
    subscriber = _a.subscriber;
  subscriber.error(error);
}

/** PURE_IMPORTS_START _observable_empty,_observable_of,_observable_throwError PURE_IMPORTS_END */
var NotificationKind;
/*@__PURE__*/

(function (NotificationKind) {
  NotificationKind["NEXT"] = "N";
  NotificationKind["ERROR"] = "E";
  NotificationKind["COMPLETE"] = "C";
})(NotificationKind || (NotificationKind = {}));

var Notification = /*@__PURE__*/ (function () {
  function Notification(kind, value, error) {
    this.kind = kind;
    this.value = value;
    this.error = error;
    this.hasValue = kind === "N";
  }

  Notification.prototype.observe = function (observer) {
    switch (this.kind) {
      case "N":
        return observer.next && observer.next(this.value);

      case "E":
        return observer.error && observer.error(this.error);

      case "C":
        return observer.complete && observer.complete();
    }
  };

  Notification.prototype["do"] = function (next, error, complete) {
    var kind = this.kind;

    switch (kind) {
      case "N":
        return next && next(this.value);

      case "E":
        return error && error(this.error);

      case "C":
        return complete && complete();
    }
  };

  Notification.prototype.accept = function (nextOrObserver, error, complete) {
    if (nextOrObserver && typeof nextOrObserver.next === "function") {
      return this.observe(nextOrObserver);
    } else {
      return this["do"](nextOrObserver, error, complete);
    }
  };

  Notification.prototype.toObservable = function () {
    var kind = this.kind;

    switch (kind) {
      case "N":
        return of(this.value);

      case "E":
        return throwError(this.error);

      case "C":
        return empty$1();
    }

    throw new Error("unexpected notification kind value");
  };

  Notification.createNext = function (value) {
    if (typeof value !== "undefined") {
      return new Notification("N", value);
    }

    return Notification.undefinedValueNotification;
  };

  Notification.createError = function (err) {
    return new Notification("E", undefined, err);
  };

  Notification.createComplete = function () {
    return Notification.completeNotification;
  };

  Notification.completeNotification = new Notification("C");
  Notification.undefinedValueNotification = new Notification("N", undefined);
  return Notification;
})();

/** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */

var ObserveOnSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(ObserveOnSubscriber, _super);

  function ObserveOnSubscriber(destination, scheduler, delay) {
    if (delay === void 0) {
      delay = 0;
    }

    var _this = _super.call(this, destination) || this;

    _this.scheduler = scheduler;
    _this.delay = delay;
    return _this;
  }

  ObserveOnSubscriber.dispatch = function (arg) {
    var notification = arg.notification,
      destination = arg.destination;
    notification.observe(destination);
    this.unsubscribe();
  };

  ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
    var destination = this.destination;
    destination.add(
      this.scheduler.schedule(
        ObserveOnSubscriber.dispatch,
        this.delay,
        new ObserveOnMessage(notification, this.destination)
      )
    );
  };

  ObserveOnSubscriber.prototype._next = function (value) {
    this.scheduleMessage(Notification.createNext(value));
  };

  ObserveOnSubscriber.prototype._error = function (err) {
    this.scheduleMessage(Notification.createError(err));
    this.unsubscribe();
  };

  ObserveOnSubscriber.prototype._complete = function () {
    this.scheduleMessage(Notification.createComplete());
    this.unsubscribe();
  };

  return ObserveOnSubscriber;
})(Subscriber);

var ObserveOnMessage = /*@__PURE__*/ (function () {
  function ObserveOnMessage(notification, destination) {
    this.notification = notification;
    this.destination = destination;
  }

  return ObserveOnMessage;
})();

/** PURE_IMPORTS_START tslib,_Subject,_scheduler_queue,_Subscription,_operators_observeOn,_util_ObjectUnsubscribedError,_SubjectSubscription PURE_IMPORTS_END */

var ReplaySubject = /*@__PURE__*/ (function (_super) {
  __extends(ReplaySubject, _super);

  function ReplaySubject(bufferSize, windowTime, scheduler) {
    if (bufferSize === void 0) {
      bufferSize = Number.POSITIVE_INFINITY;
    }

    if (windowTime === void 0) {
      windowTime = Number.POSITIVE_INFINITY;
    }

    var _this = _super.call(this) || this;

    _this.scheduler = scheduler;
    _this._events = [];
    _this._infiniteTimeWindow = false;
    _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
    _this._windowTime = windowTime < 1 ? 1 : windowTime;

    if (windowTime === Number.POSITIVE_INFINITY) {
      _this._infiniteTimeWindow = true;
      _this.next = _this.nextInfiniteTimeWindow;
    } else {
      _this.next = _this.nextTimeWindow;
    }

    return _this;
  }

  ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
    var _events = this._events;

    _events.push(value);

    if (_events.length > this._bufferSize) {
      _events.shift();
    }

    _super.prototype.next.call(this, value);
  };

  ReplaySubject.prototype.nextTimeWindow = function (value) {
    this._events.push(new ReplayEvent(this._getNow(), value));

    this._trimBufferThenGetEvents();

    _super.prototype.next.call(this, value);
  };

  ReplaySubject.prototype._subscribe = function (subscriber) {
    var _infiniteTimeWindow = this._infiniteTimeWindow;

    var _events = _infiniteTimeWindow
      ? this._events
      : this._trimBufferThenGetEvents();

    var scheduler = this.scheduler;
    var len = _events.length;
    var subscription;

    if (this.closed) {
      throw new ObjectUnsubscribedError();
    } else if (this.isStopped || this.hasError) {
      subscription = Subscription.EMPTY;
    } else {
      this.observers.push(subscriber);
      subscription = new SubjectSubscription(this, subscriber);
    }

    if (scheduler) {
      subscriber.add(
        (subscriber = new ObserveOnSubscriber(subscriber, scheduler))
      );
    }

    if (_infiniteTimeWindow) {
      for (var i = 0; i < len && !subscriber.closed; i++) {
        subscriber.next(_events[i]);
      }
    } else {
      for (var i = 0; i < len && !subscriber.closed; i++) {
        subscriber.next(_events[i].value);
      }
    }

    if (this.hasError) {
      subscriber.error(this.thrownError);
    } else if (this.isStopped) {
      subscriber.complete();
    }

    return subscription;
  };

  ReplaySubject.prototype._getNow = function () {
    return (this.scheduler || queue).now();
  };

  ReplaySubject.prototype._trimBufferThenGetEvents = function () {
    var now = this._getNow();

    var _bufferSize = this._bufferSize;
    var _windowTime = this._windowTime;
    var _events = this._events;
    var eventsCount = _events.length;
    var spliceCount = 0;

    while (spliceCount < eventsCount) {
      if (now - _events[spliceCount].time < _windowTime) {
        break;
      }

      spliceCount++;
    }

    if (eventsCount > _bufferSize) {
      spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
    }

    if (spliceCount > 0) {
      _events.splice(0, spliceCount);
    }

    return _events;
  };

  return ReplaySubject;
})(Subject);

var ReplayEvent = /*@__PURE__*/ (function () {
  function ReplayEvent(time, value) {
    this.time = time;
    this.value = value;
  }

  return ReplayEvent;
})();

/** PURE_IMPORTS_START tslib,_Subject,_Subscription PURE_IMPORTS_END */

var AsyncSubject = /*@__PURE__*/ (function (_super) {
  __extends(AsyncSubject, _super);

  function AsyncSubject() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;

    _this.value = null;
    _this.hasNext = false;
    _this.hasCompleted = false;
    return _this;
  }

  AsyncSubject.prototype._subscribe = function (subscriber) {
    if (this.hasError) {
      subscriber.error(this.thrownError);
      return Subscription.EMPTY;
    } else if (this.hasCompleted && this.hasNext) {
      subscriber.next(this.value);
      subscriber.complete();
      return Subscription.EMPTY;
    }

    return _super.prototype._subscribe.call(this, subscriber);
  };

  AsyncSubject.prototype.next = function (value) {
    if (!this.hasCompleted) {
      this.value = value;
      this.hasNext = true;
    }
  };

  AsyncSubject.prototype.error = function (error) {
    if (!this.hasCompleted) {
      _super.prototype.error.call(this, error);
    }
  };

  AsyncSubject.prototype.complete = function () {
    this.hasCompleted = true;

    if (this.hasNext) {
      _super.prototype.next.call(this, this.value);
    }

    _super.prototype.complete.call(this);
  };

  return AsyncSubject;
})(Subject);

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var nextHandle = 1;

var RESOLVED = /*@__PURE__*/ (function () {
  return /*@__PURE__*/ Promise.resolve();
})();

var activeHandles = {};

function findAndClearHandle(handle) {
  if (handle in activeHandles) {
    delete activeHandles[handle];
    return true;
  }

  return false;
}

var Immediate = {
  setImmediate: function setImmediate(cb) {
    var handle = nextHandle++;
    activeHandles[handle] = true;
    RESOLVED.then(function () {
      return findAndClearHandle(handle) && cb();
    });
    return handle;
  },
  clearImmediate: function clearImmediate(handle) {
    findAndClearHandle(handle);
  },
};

/** PURE_IMPORTS_START tslib,_util_Immediate,_AsyncAction PURE_IMPORTS_END */

var AsapAction = /*@__PURE__*/ (function (_super) {
  __extends(AsapAction, _super);

  function AsapAction(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;

    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }

  AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
    if (delay === void 0) {
      delay = 0;
    }

    if (delay !== null && delay > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
    }

    scheduler.actions.push(this);
    return (
      scheduler.scheduled ||
      (scheduler.scheduled = Immediate.setImmediate(
        scheduler.flush.bind(scheduler, null)
      ))
    );
  };

  AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
    if (delay === void 0) {
      delay = 0;
    }

    if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
      return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
    }

    if (scheduler.actions.length === 0) {
      Immediate.clearImmediate(id);
      scheduler.scheduled = undefined;
    }

    return undefined;
  };

  return AsapAction;
})(AsyncAction);

/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */

var AsapScheduler = /*@__PURE__*/ (function (_super) {
  __extends(AsapScheduler, _super);

  function AsapScheduler() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }

  AsapScheduler.prototype.flush = function (action) {
    this.active = true;
    this.scheduled = undefined;
    var actions = this.actions;
    var error;
    var index = -1;
    var count = actions.length;
    action = action || actions.shift();

    do {
      if ((error = action.execute(action.state, action.delay))) {
        break;
      }
    } while (++index < count && (action = actions.shift()));

    this.active = false;

    if (error) {
      while (++index < count && (action = actions.shift())) {
        action.unsubscribe();
      }

      throw error;
    }
  };

  return AsapScheduler;
})(AsyncScheduler);

/** PURE_IMPORTS_START _AsapAction,_AsapScheduler PURE_IMPORTS_END */
var asapScheduler = /*@__PURE__*/ new AsapScheduler(AsapAction);
var asap = asapScheduler;

/** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
var asyncScheduler = /*@__PURE__*/ new AsyncScheduler(AsyncAction);
var async = asyncScheduler;

/** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */

var AnimationFrameAction = /*@__PURE__*/ (function (_super) {
  __extends(AnimationFrameAction, _super);

  function AnimationFrameAction(scheduler, work) {
    var _this = _super.call(this, scheduler, work) || this;

    _this.scheduler = scheduler;
    _this.work = work;
    return _this;
  }

  AnimationFrameAction.prototype.requestAsyncId = function (
    scheduler,
    id,
    delay
  ) {
    if (delay === void 0) {
      delay = 0;
    }

    if (delay !== null && delay > 0) {
      return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
    }

    scheduler.actions.push(this);
    return (
      scheduler.scheduled ||
      (scheduler.scheduled = requestAnimationFrame(function () {
        return scheduler.flush(null);
      }))
    );
  };

  AnimationFrameAction.prototype.recycleAsyncId = function (
    scheduler,
    id,
    delay
  ) {
    if (delay === void 0) {
      delay = 0;
    }

    if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
      return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
    }

    if (scheduler.actions.length === 0) {
      cancelAnimationFrame(id);
      scheduler.scheduled = undefined;
    }

    return undefined;
  };

  return AnimationFrameAction;
})(AsyncAction);

/** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */

var AnimationFrameScheduler = /*@__PURE__*/ (function (_super) {
  __extends(AnimationFrameScheduler, _super);

  function AnimationFrameScheduler() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }

  AnimationFrameScheduler.prototype.flush = function (action) {
    this.active = true;
    this.scheduled = undefined;
    var actions = this.actions;
    var error;
    var index = -1;
    var count = actions.length;
    action = action || actions.shift();

    do {
      if ((error = action.execute(action.state, action.delay))) {
        break;
      }
    } while (++index < count && (action = actions.shift()));

    this.active = false;

    if (error) {
      while (++index < count && (action = actions.shift())) {
        action.unsubscribe();
      }

      throw error;
    }
  };

  return AnimationFrameScheduler;
})(AsyncScheduler);

/** PURE_IMPORTS_START _AnimationFrameAction,_AnimationFrameScheduler PURE_IMPORTS_END */
var animationFrameScheduler = /*@__PURE__*/ new AnimationFrameScheduler(
  AnimationFrameAction
);
var animationFrame = animationFrameScheduler;

/** PURE_IMPORTS_START tslib,_AsyncAction,_AsyncScheduler PURE_IMPORTS_END */

var VirtualTimeScheduler = /*@__PURE__*/ (function (_super) {
  __extends(VirtualTimeScheduler, _super);

  function VirtualTimeScheduler(SchedulerAction, maxFrames) {
    if (SchedulerAction === void 0) {
      SchedulerAction = VirtualAction;
    }

    if (maxFrames === void 0) {
      maxFrames = Number.POSITIVE_INFINITY;
    }

    var _this =
      _super.call(this, SchedulerAction, function () {
        return _this.frame;
      }) || this;

    _this.maxFrames = maxFrames;
    _this.frame = 0;
    _this.index = -1;
    return _this;
  }

  VirtualTimeScheduler.prototype.flush = function () {
    var _a = this,
      actions = _a.actions,
      maxFrames = _a.maxFrames;

    var error, action;

    while ((action = actions[0]) && action.delay <= maxFrames) {
      actions.shift();
      this.frame = action.delay;

      if ((error = action.execute(action.state, action.delay))) {
        break;
      }
    }

    if (error) {
      while ((action = actions.shift())) {
        action.unsubscribe();
      }

      throw error;
    }
  };

  VirtualTimeScheduler.frameTimeFactor = 10;
  return VirtualTimeScheduler;
})(AsyncScheduler);

var VirtualAction = /*@__PURE__*/ (function (_super) {
  __extends(VirtualAction, _super);

  function VirtualAction(scheduler, work, index) {
    if (index === void 0) {
      index = scheduler.index += 1;
    }

    var _this = _super.call(this, scheduler, work) || this;

    _this.scheduler = scheduler;
    _this.work = work;
    _this.index = index;
    _this.active = true;
    _this.index = scheduler.index = index;
    return _this;
  }

  VirtualAction.prototype.schedule = function (state, delay) {
    if (delay === void 0) {
      delay = 0;
    }

    if (!this.id) {
      return _super.prototype.schedule.call(this, state, delay);
    }

    this.active = false;
    var action = new VirtualAction(this.scheduler, this.work);
    this.add(action);
    return action.schedule(state, delay);
  };

  VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
    if (delay === void 0) {
      delay = 0;
    }

    this.delay = scheduler.frame + delay;
    var actions = scheduler.actions;
    actions.push(this);
    actions.sort(VirtualAction.sortActions);
    return true;
  };

  VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
    return undefined;
  };

  VirtualAction.prototype._execute = function (state, delay) {
    if (this.active === true) {
      return _super.prototype._execute.call(this, state, delay);
    }
  };

  VirtualAction.sortActions = function (a, b) {
    if (a.delay === b.delay) {
      if (a.index === b.index) {
        return 0;
      } else if (a.index > b.index) {
        return 1;
      } else {
        return -1;
      }
    } else if (a.delay > b.delay) {
      return 1;
    } else {
      return -1;
    }
  };

  return VirtualAction;
})(AsyncAction);

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function noop() {}

/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
function isObservable(obj) {
  return (
    !!obj &&
    (obj instanceof Observable ||
      (typeof obj.lift === "function" && typeof obj.subscribe === "function"))
  );
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var ArgumentOutOfRangeErrorImpl = /*@__PURE__*/ (function () {
  function ArgumentOutOfRangeErrorImpl() {
    Error.call(this);
    this.message = "argument out of range";
    this.name = "ArgumentOutOfRangeError";
    return this;
  }

  ArgumentOutOfRangeErrorImpl.prototype = /*@__PURE__*/ Object.create(
    Error.prototype
  );
  return ArgumentOutOfRangeErrorImpl;
})();

var ArgumentOutOfRangeError = ArgumentOutOfRangeErrorImpl;

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var EmptyErrorImpl = /*@__PURE__*/ (function () {
  function EmptyErrorImpl() {
    Error.call(this);
    this.message = "no elements in sequence";
    this.name = "EmptyError";
    return this;
  }

  EmptyErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
  return EmptyErrorImpl;
})();

var EmptyError = EmptyErrorImpl;

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var TimeoutErrorImpl = /*@__PURE__*/ (function () {
  function TimeoutErrorImpl() {
    Error.call(this);
    this.message = "Timeout has occurred";
    this.name = "TimeoutError";
    return this;
  }

  TimeoutErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
  return TimeoutErrorImpl;
})();

var TimeoutError = TimeoutErrorImpl;

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function map(project, thisArg) {
  return function mapOperation(source) {
    if (typeof project !== "function") {
      throw new TypeError(
        "argument is not a function. Are you looking for `mapTo()`?"
      );
    }

    return source.lift(new MapOperator(project, thisArg));
  };
}

var MapOperator = /*@__PURE__*/ (function () {
  function MapOperator(project, thisArg) {
    this.project = project;
    this.thisArg = thisArg;
  }

  MapOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(
      new MapSubscriber(subscriber, this.project, this.thisArg)
    );
  };

  return MapOperator;
})();

var MapSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(MapSubscriber, _super);

  function MapSubscriber(destination, project, thisArg) {
    var _this = _super.call(this, destination) || this;

    _this.project = project;
    _this.count = 0;
    _this.thisArg = thisArg || _this;
    return _this;
  }

  MapSubscriber.prototype._next = function (value) {
    var result;

    try {
      result = this.project.call(this.thisArg, value, this.count++);
    } catch (err) {
      this.destination.error(err);
      return;
    }

    this.destination.next(result);
  };

  return MapSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isArray,_util_isScheduler PURE_IMPORTS_END */
function bindCallback(callbackFunc, resultSelector, scheduler) {
  if (resultSelector) {
    if (isScheduler(resultSelector)) {
      scheduler = resultSelector;
    } else {
      return function () {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        return bindCallback(callbackFunc, scheduler)
          .apply(void 0, args)
          .pipe(
            map(function (args) {
              return isArray(args)
                ? resultSelector.apply(void 0, args)
                : resultSelector(args);
            })
          );
      };
    }
  }

  return function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var context = this;
    var subject;
    var params = {
      context: context,
      subject: subject,
      callbackFunc: callbackFunc,
      scheduler: scheduler,
    };
    return new Observable(function (subscriber) {
      if (!scheduler) {
        if (!subject) {
          subject = new AsyncSubject();

          var handler = function handler() {
            var innerArgs = [];

            for (var _i = 0; _i < arguments.length; _i++) {
              innerArgs[_i] = arguments[_i];
            }

            subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
            subject.complete();
          };

          try {
            callbackFunc.apply(context, args.concat([handler]));
          } catch (err) {
            if (canReportError(subject)) {
              subject.error(err);
            } else {
              console.warn(err);
            }
          }
        }

        return subject.subscribe(subscriber);
      } else {
        var state = {
          args: args,
          subscriber: subscriber,
          params: params,
        };
        return scheduler.schedule(dispatch$1, 0, state);
      }
    });
  };
}

function dispatch$1(state) {
  var _this = this;
  var args = state.args,
    subscriber = state.subscriber,
    params = state.params;
  var callbackFunc = params.callbackFunc,
    context = params.context,
    scheduler = params.scheduler;
  var subject = params.subject;

  if (!subject) {
    subject = params.subject = new AsyncSubject();

    var handler = function handler() {
      var innerArgs = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        innerArgs[_i] = arguments[_i];
      }

      var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;

      _this.add(
        scheduler.schedule(dispatchNext, 0, {
          value: value,
          subject: subject,
        })
      );
    };

    try {
      callbackFunc.apply(context, args.concat([handler]));
    } catch (err) {
      subject.error(err);
    }
  }

  this.add(subject.subscribe(subscriber));
}

function dispatchNext(state) {
  var value = state.value,
    subject = state.subject;
  subject.next(value);
  subject.complete();
}

/** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isScheduler,_util_isArray PURE_IMPORTS_END */
function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
  if (resultSelector) {
    if (isScheduler(resultSelector)) {
      scheduler = resultSelector;
    } else {
      return function () {
        var args = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }

        return bindNodeCallback(callbackFunc, scheduler)
          .apply(void 0, args)
          .pipe(
            map(function (args) {
              return isArray(args)
                ? resultSelector.apply(void 0, args)
                : resultSelector(args);
            })
          );
      };
    }
  }

  return function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var params = {
      subject: undefined,
      args: args,
      callbackFunc: callbackFunc,
      scheduler: scheduler,
      context: this,
    };
    return new Observable(function (subscriber) {
      var context = params.context;
      var subject = params.subject;

      if (!scheduler) {
        if (!subject) {
          subject = params.subject = new AsyncSubject();

          var handler = function handler() {
            var innerArgs = [];

            for (var _i = 0; _i < arguments.length; _i++) {
              innerArgs[_i] = arguments[_i];
            }

            var err = innerArgs.shift();

            if (err) {
              subject.error(err);
              return;
            }

            subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
            subject.complete();
          };

          try {
            callbackFunc.apply(context, args.concat([handler]));
          } catch (err) {
            if (canReportError(subject)) {
              subject.error(err);
            } else {
              console.warn(err);
            }
          }
        }

        return subject.subscribe(subscriber);
      } else {
        return scheduler.schedule(dispatch$2, 0, {
          params: params,
          subscriber: subscriber,
          context: context,
        });
      }
    });
  };
}

function dispatch$2(state) {
  var _this = this;

  var params = state.params,
    subscriber = state.subscriber,
    context = state.context;
  var callbackFunc = params.callbackFunc,
    args = params.args,
    scheduler = params.scheduler;
  var subject = params.subject;

  if (!subject) {
    subject = params.subject = new AsyncSubject();

    var handler = function handler() {
      var innerArgs = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        innerArgs[_i] = arguments[_i];
      }

      var err = innerArgs.shift();

      if (err) {
        _this.add(
          scheduler.schedule(dispatchError, 0, {
            err: err,
            subject: subject,
          })
        );
      } else {
        var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;

        _this.add(
          scheduler.schedule(dispatchNext$1, 0, {
            value: value,
            subject: subject,
          })
        );
      }
    };

    try {
      callbackFunc.apply(context, args.concat([handler]));
    } catch (err) {
      this.add(
        scheduler.schedule(dispatchError, 0, {
          err: err,
          subject: subject,
        })
      );
    }
  }

  this.add(subject.subscribe(subscriber));
}

function dispatchNext$1(arg) {
  var value = arg.value,
    subject = arg.subject;
  subject.next(value);
  subject.complete();
}

function dispatchError(arg) {
  var err = arg.err,
    subject = arg.subject;
  subject.error(err);
}

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var OuterSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(OuterSubscriber, _super);

  function OuterSubscriber() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }

  OuterSubscriber.prototype.notifyNext = function (
    outerValue,
    innerValue,
    outerIndex,
    innerIndex,
    innerSub
  ) {
    this.destination.next(innerValue);
  };

  OuterSubscriber.prototype.notifyError = function (error, innerSub) {
    this.destination.error(error);
  };

  OuterSubscriber.prototype.notifyComplete = function (innerSub) {
    this.destination.complete();
  };

  return OuterSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

var InnerSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(InnerSubscriber, _super);

  function InnerSubscriber(parent, outerValue, outerIndex) {
    var _this = _super.call(this) || this;

    _this.parent = parent;
    _this.outerValue = outerValue;
    _this.outerIndex = outerIndex;
    _this.index = 0;
    return _this;
  }

  InnerSubscriber.prototype._next = function (value) {
    this.parent.notifyNext(
      this.outerValue,
      value,
      this.outerIndex,
      this.index++,
      this
    );
  };

  InnerSubscriber.prototype._error = function (error) {
    this.parent.notifyError(error, this);
    this.unsubscribe();
  };

  InnerSubscriber.prototype._complete = function () {
    this.parent.notifyComplete(this);
    this.unsubscribe();
  };

  return InnerSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
var subscribeToPromise = function subscribeToPromise(promise) {
  return function (subscriber) {
    promise
      .then(
        function (value) {
          if (!subscriber.closed) {
            subscriber.next(value);
            subscriber.complete();
          }
        },
        function (err) {
          return subscriber.error(err);
        }
      )
      .then(null, hostReportError);
    return subscriber;
  };
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function getSymbolIterator() {
  if (typeof Symbol !== "function" || !Symbol.iterator) {
    return "@@iterator";
  }

  return Symbol.iterator;
}
var iterator = /*@__PURE__*/ getSymbolIterator();

/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
var subscribeToIterable = function subscribeToIterable(iterable) {
  return function (subscriber) {
    var iterator$1 = iterable[iterator]();

    do {
      var item = void 0;

      try {
        item = iterator$1.next();
      } catch (err) {
        subscriber.error(err);
        return subscriber;
      }

      if (item.done) {
        subscriber.complete();
        break;
      }

      subscriber.next(item.value);

      if (subscriber.closed) {
        break;
      }
    } while (true);

    if (typeof iterator$1["return"] === "function") {
      subscriber.add(function () {
        if (iterator$1["return"]) {
          iterator$1["return"]();
        }
      });
    }

    return subscriber;
  };
};

/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
var subscribeToObservable = function subscribeToObservable(obj) {
  return function (subscriber) {
    var obs = obj[observable]();

    if (typeof obs.subscribe !== "function") {
      throw new TypeError(
        "Provided object does not correctly implement Symbol.observable"
      );
    } else {
      return obs.subscribe(subscriber);
    }
  };
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
var isArrayLike = function isArrayLike(x) {
  return x && typeof x.length === "number" && typeof x !== "function";
};

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function isPromise(value) {
  return (
    !!value &&
    typeof value.subscribe !== "function" &&
    typeof value.then === "function"
  );
}

/** PURE_IMPORTS_START _subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
var subscribeTo = function subscribeTo(result) {
  if (!!result && typeof result[observable] === "function") {
    return subscribeToObservable(result);
  } else if (isArrayLike(result)) {
    return subscribeToArray(result);
  } else if (isPromise(result)) {
    return subscribeToPromise(result);
  } else if (!!result && typeof result[iterator] === "function") {
    return subscribeToIterable(result);
  } else {
    var value = isObject(result) ? "an invalid object" : "'" + result + "'";
    var msg =
      "You provided " +
      value +
      " where a stream was expected." +
      " You can provide an Observable, Promise, Array, or Iterable.";
    throw new TypeError(msg);
  }
};

/** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo,_Observable PURE_IMPORTS_END */
function subscribeToResult(
  outerSubscriber,
  result,
  outerValue,
  outerIndex,
  innerSubscriber
) {
  if (innerSubscriber === void 0) {
    innerSubscriber = new InnerSubscriber(
      outerSubscriber,
      outerValue,
      outerIndex
    );
  }

  if (innerSubscriber.closed) {
    return undefined;
  }

  if (result instanceof Observable) {
    return result.subscribe(innerSubscriber);
  }

  return subscribeTo(result)(innerSubscriber);
}

/** PURE_IMPORTS_START tslib,_util_isScheduler,_util_isArray,_OuterSubscriber,_util_subscribeToResult,_fromArray PURE_IMPORTS_END */
var NONE = {};
function combineLatest() {
  var observables = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }

  var resultSelector = null;
  var scheduler = null;

  if (isScheduler(observables[observables.length - 1])) {
    scheduler = observables.pop();
  }

  if (typeof observables[observables.length - 1] === "function") {
    resultSelector = observables.pop();
  }

  if (observables.length === 1 && isArray(observables[0])) {
    observables = observables[0];
  }

  return fromArray(observables, scheduler).lift(
    new CombineLatestOperator(resultSelector)
  );
}

var CombineLatestOperator = /*@__PURE__*/ (function () {
  function CombineLatestOperator(resultSelector) {
    this.resultSelector = resultSelector;
  }

  CombineLatestOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(
      new CombineLatestSubscriber(subscriber, this.resultSelector)
    );
  };

  return CombineLatestOperator;
})();

var CombineLatestSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(CombineLatestSubscriber, _super);

  function CombineLatestSubscriber(destination, resultSelector) {
    var _this = _super.call(this, destination) || this;

    _this.resultSelector = resultSelector;
    _this.active = 0;
    _this.values = [];
    _this.observables = [];
    return _this;
  }

  CombineLatestSubscriber.prototype._next = function (observable) {
    this.values.push(NONE);
    this.observables.push(observable);
  };

  CombineLatestSubscriber.prototype._complete = function () {
    var observables = this.observables;
    var len = observables.length;

    if (len === 0) {
      this.destination.complete();
    } else {
      this.active = len;
      this.toRespond = len;

      for (var i = 0; i < len; i++) {
        var observable = observables[i];
        this.add(subscribeToResult(this, observable, observable, i));
      }
    }
  };

  CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
    if ((this.active -= 1) === 0) {
      this.destination.complete();
    }
  };

  CombineLatestSubscriber.prototype.notifyNext = function (
    outerValue,
    innerValue,
    outerIndex,
    innerIndex,
    innerSub
  ) {
    var values = this.values;
    var oldVal = values[outerIndex];
    var toRespond = !this.toRespond
      ? 0
      : oldVal === NONE
      ? --this.toRespond
      : this.toRespond;
    values[outerIndex] = innerValue;

    if (toRespond === 0) {
      if (this.resultSelector) {
        this._tryResultSelector(values);
      } else {
        this.destination.next(values.slice());
      }
    }
  };

  CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
    var result;

    try {
      result = this.resultSelector.apply(this, values);
    } catch (err) {
      this.destination.error(err);
      return;
    }

    this.destination.next(result);
  };

  return CombineLatestSubscriber;
})(OuterSubscriber);

/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable PURE_IMPORTS_END */
function scheduleObservable(input, scheduler) {
  return new Observable(function (subscriber) {
    var sub = new Subscription();
    sub.add(
      scheduler.schedule(function () {
        var observable$1 = input[observable]();
        sub.add(
          observable$1.subscribe({
            next: function next(value) {
              sub.add(
                scheduler.schedule(function () {
                  return subscriber.next(value);
                })
              );
            },
            error: function error(err) {
              sub.add(
                scheduler.schedule(function () {
                  return subscriber.error(err);
                })
              );
            },
            complete: function complete() {
              sub.add(
                scheduler.schedule(function () {
                  return subscriber.complete();
                })
              );
            },
          })
        );
      })
    );
    return sub;
  });
}

/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
function schedulePromise(input, scheduler) {
  return new Observable(function (subscriber) {
    var sub = new Subscription();
    sub.add(
      scheduler.schedule(function () {
        return input.then(
          function (value) {
            sub.add(
              scheduler.schedule(function () {
                subscriber.next(value);
                sub.add(
                  scheduler.schedule(function () {
                    return subscriber.complete();
                  })
                );
              })
            );
          },
          function (err) {
            sub.add(
              scheduler.schedule(function () {
                return subscriber.error(err);
              })
            );
          }
        );
      })
    );
    return sub;
  });
}

/** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator PURE_IMPORTS_END */
function scheduleIterable(input, scheduler) {
  if (!input) {
    throw new Error("Iterable cannot be null");
  }

  return new Observable(function (subscriber) {
    var sub = new Subscription();
    var iterator$1;
    sub.add(function () {
      if (iterator$1 && typeof iterator$1["return"] === "function") {
        iterator$1["return"]();
      }
    });
    sub.add(
      scheduler.schedule(function () {
        iterator$1 = input[iterator]();
        sub.add(
          scheduler.schedule(function () {
            if (subscriber.closed) {
              return;
            }

            var value;
            var done;

            try {
              var result = iterator$1.next();
              value = result.value;
              done = result.done;
            } catch (err) {
              subscriber.error(err);
              return;
            }

            if (done) {
              subscriber.complete();
            } else {
              subscriber.next(value);
              this.schedule();
            }
          })
        );
      })
    );
    return sub;
  });
}

/** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
function isInteropObservable(input) {
  return input && typeof input[observable] === "function";
}

/** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
function isIterable(input) {
  return input && typeof input[iterator] === "function";
}

function scheduled(input, scheduler) {
  if (input != null) {
    if (isInteropObservable(input)) {
      return scheduleObservable(input, scheduler);
    } else if (isPromise(input)) {
      return schedulePromise(input, scheduler);
    } else if (isArrayLike(input)) {
      return scheduleArray(input, scheduler);
    } else if (isIterable(input) || typeof input === "string") {
      return scheduleIterable(input, scheduler);
    }
  }

  throw new TypeError(
    ((input !== null && _typeof(input)) || input) + " is not observable"
  );
}

/** PURE_IMPORTS_START _Observable,_util_subscribeTo,_scheduled_scheduled PURE_IMPORTS_END */
function from(input, scheduler) {
  if (!scheduler) {
    if (input instanceof Observable) {
      return input;
    }

    return new Observable(subscribeTo(input));
  } else {
    return scheduled(input, scheduler);
  }
}

/** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_InnerSubscriber,_map,_observable_from PURE_IMPORTS_END */
function mergeMap(project, resultSelector, concurrent) {
  if (concurrent === void 0) {
    concurrent = Number.POSITIVE_INFINITY;
  }

  if (typeof resultSelector === "function") {
    return function (source) {
      return source.pipe(
        mergeMap(function (a, i) {
          return from(project(a, i)).pipe(
            map(function (b, ii) {
              return resultSelector(a, b, i, ii);
            })
          );
        }, concurrent)
      );
    };
  } else if (typeof resultSelector === "number") {
    concurrent = resultSelector;
  }

  return function (source) {
    return source.lift(new MergeMapOperator(project, concurrent));
  };
}

var MergeMapOperator = /*@__PURE__*/ (function () {
  function MergeMapOperator(project, concurrent) {
    if (concurrent === void 0) {
      concurrent = Number.POSITIVE_INFINITY;
    }

    this.project = project;
    this.concurrent = concurrent;
  }

  MergeMapOperator.prototype.call = function (observer, source) {
    return source.subscribe(
      new MergeMapSubscriber(observer, this.project, this.concurrent)
    );
  };

  return MergeMapOperator;
})();

var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(MergeMapSubscriber, _super);

  function MergeMapSubscriber(destination, project, concurrent) {
    if (concurrent === void 0) {
      concurrent = Number.POSITIVE_INFINITY;
    }

    var _this = _super.call(this, destination) || this;

    _this.project = project;
    _this.concurrent = concurrent;
    _this.hasCompleted = false;
    _this.buffer = [];
    _this.active = 0;
    _this.index = 0;
    return _this;
  }

  MergeMapSubscriber.prototype._next = function (value) {
    if (this.active < this.concurrent) {
      this._tryNext(value);
    } else {
      this.buffer.push(value);
    }
  };

  MergeMapSubscriber.prototype._tryNext = function (value) {
    var result;
    var index = this.index++;

    try {
      result = this.project(value, index);
    } catch (err) {
      this.destination.error(err);
      return;
    }

    this.active++;

    this._innerSub(result, value, index);
  };

  MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
    var innerSubscriber = new InnerSubscriber(this, value, index);
    var destination = this.destination;
    destination.add(innerSubscriber);
    var innerSubscription = subscribeToResult(
      this,
      ish,
      undefined,
      undefined,
      innerSubscriber
    );

    if (innerSubscription !== innerSubscriber) {
      destination.add(innerSubscription);
    }
  };

  MergeMapSubscriber.prototype._complete = function () {
    this.hasCompleted = true;

    if (this.active === 0 && this.buffer.length === 0) {
      this.destination.complete();
    }

    this.unsubscribe();
  };

  MergeMapSubscriber.prototype.notifyNext = function (
    outerValue,
    innerValue,
    outerIndex,
    innerIndex,
    innerSub
  ) {
    this.destination.next(innerValue);
  };

  MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
    var buffer = this.buffer;
    this.remove(innerSub);
    this.active--;

    if (buffer.length > 0) {
      this._next(buffer.shift());
    } else if (this.active === 0 && this.hasCompleted) {
      this.destination.complete();
    }
  };

  return MergeMapSubscriber;
})(OuterSubscriber);

/** PURE_IMPORTS_START _mergeMap,_util_identity PURE_IMPORTS_END */
function mergeAll(concurrent) {
  if (concurrent === void 0) {
    concurrent = Number.POSITIVE_INFINITY;
  }

  return mergeMap(identity, concurrent);
}

/** PURE_IMPORTS_START _mergeAll PURE_IMPORTS_END */
function concatAll() {
  return mergeAll(1);
}

/** PURE_IMPORTS_START _of,_operators_concatAll PURE_IMPORTS_END */
function concat() {
  var observables = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }

  return concatAll()(of.apply(void 0, observables));
}

/** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */
function defer(observableFactory) {
  return new Observable(function (subscriber) {
    var input;

    try {
      input = observableFactory();
    } catch (err) {
      subscriber.error(err);
      return undefined;
    }

    var source = input ? from(input) : empty$1();
    return source.subscribe(subscriber);
  });
}

/** PURE_IMPORTS_START _Observable,_util_isArray,_operators_map,_util_isObject,_from PURE_IMPORTS_END */
function forkJoin() {
  var sources = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }

  if (sources.length === 1) {
    var first_1 = sources[0];

    if (isArray(first_1)) {
      return forkJoinInternal(first_1, null);
    }

    if (
      isObject(first_1) &&
      Object.getPrototypeOf(first_1) === Object.prototype
    ) {
      var keys = Object.keys(first_1);
      return forkJoinInternal(
        keys.map(function (key) {
          return first_1[key];
        }),
        keys
      );
    }
  }

  if (typeof sources[sources.length - 1] === "function") {
    var resultSelector_1 = sources.pop();
    sources =
      sources.length === 1 && isArray(sources[0]) ? sources[0] : sources;
    return forkJoinInternal(sources, null).pipe(
      map(function (args) {
        return resultSelector_1.apply(void 0, args);
      })
    );
  }

  return forkJoinInternal(sources, null);
}

function forkJoinInternal(sources, keys) {
  return new Observable(function (subscriber) {
    var len = sources.length;

    if (len === 0) {
      subscriber.complete();
      return;
    }

    var values = new Array(len);
    var completed = 0;
    var emitted = 0;

    var _loop_1 = function _loop_1(i) {
      var source = from(sources[i]);
      var hasValue = false;
      subscriber.add(
        source.subscribe({
          next: function next(value) {
            if (!hasValue) {
              hasValue = true;
              emitted++;
            }

            values[i] = value;
          },
          error: function error(err) {
            return subscriber.error(err);
          },
          complete: function complete() {
            completed++;

            if (completed === len || !hasValue) {
              if (emitted === len) {
                subscriber.next(
                  keys
                    ? keys.reduce(function (result, key, i) {
                        return (result[key] = values[i]), result;
                      }, {})
                    : values
                );
              }

              subscriber.complete();
            }
          },
        })
      );
    };

    for (var i = 0; i < len; i++) {
      _loop_1(i);
    }
  });
}

/** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */

function fromEvent(target, eventName, options, resultSelector) {
  if (isFunction(options)) {
    resultSelector = options;
    options = undefined;
  }

  if (resultSelector) {
    return fromEvent(target, eventName, options).pipe(
      map(function (args) {
        return isArray(args)
          ? resultSelector.apply(void 0, args)
          : resultSelector(args);
      })
    );
  }

  return new Observable(function (subscriber) {
    function handler(e) {
      if (arguments.length > 1) {
        subscriber.next(Array.prototype.slice.call(arguments));
      } else {
        subscriber.next(e);
      }
    }

    setupSubscription(target, eventName, handler, subscriber, options);
  });
}

function setupSubscription(sourceObj, eventName, handler, subscriber, options) {
  var unsubscribe;

  if (isEventTarget(sourceObj)) {
    var source_1 = sourceObj;
    sourceObj.addEventListener(eventName, handler, options);

    unsubscribe = function unsubscribe() {
      return source_1.removeEventListener(eventName, handler, options);
    };
  } else if (isJQueryStyleEventEmitter(sourceObj)) {
    var source_2 = sourceObj;
    sourceObj.on(eventName, handler);

    unsubscribe = function unsubscribe() {
      return source_2.off(eventName, handler);
    };
  } else if (isNodeStyleEventEmitter(sourceObj)) {
    var source_3 = sourceObj;
    sourceObj.addListener(eventName, handler);

    unsubscribe = function unsubscribe() {
      return source_3.removeListener(eventName, handler);
    };
  } else if (sourceObj && sourceObj.length) {
    for (var i = 0, len = sourceObj.length; i < len; i++) {
      setupSubscription(sourceObj[i], eventName, handler, subscriber, options);
    }
  } else {
    throw new TypeError("Invalid event target");
  }

  subscriber.add(unsubscribe);
}

function isNodeStyleEventEmitter(sourceObj) {
  return (
    sourceObj &&
    typeof sourceObj.addListener === "function" &&
    typeof sourceObj.removeListener === "function"
  );
}

function isJQueryStyleEventEmitter(sourceObj) {
  return (
    sourceObj &&
    typeof sourceObj.on === "function" &&
    typeof sourceObj.off === "function"
  );
}

function isEventTarget(sourceObj) {
  return (
    sourceObj &&
    typeof sourceObj.addEventListener === "function" &&
    typeof sourceObj.removeEventListener === "function"
  );
}

/** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */
function fromEventPattern(addHandler, removeHandler, resultSelector) {
  if (resultSelector) {
    return fromEventPattern(addHandler, removeHandler).pipe(
      map(function (args) {
        return isArray(args)
          ? resultSelector.apply(void 0, args)
          : resultSelector(args);
      })
    );
  }

  return new Observable(function (subscriber) {
    var handler = function handler() {
      var e = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        e[_i] = arguments[_i];
      }

      return subscriber.next(e.length === 1 ? e[0] : e);
    };

    var retValue;

    try {
      retValue = addHandler(handler);
    } catch (err) {
      subscriber.error(err);
      return undefined;
    }

    if (!isFunction(removeHandler)) {
      return undefined;
    }

    return function () {
      return removeHandler(handler, retValue);
    };
  });
}

/** PURE_IMPORTS_START _Observable,_util_identity,_util_isScheduler PURE_IMPORTS_END */
function generate(
  initialStateOrOptions,
  condition,
  iterate,
  resultSelectorOrObservable,
  scheduler
) {
  var resultSelector;
  var initialState;

  if (arguments.length == 1) {
    var options = initialStateOrOptions;
    initialState = options.initialState;
    condition = options.condition;
    iterate = options.iterate;
    resultSelector = options.resultSelector || identity;
    scheduler = options.scheduler;
  } else if (
    resultSelectorOrObservable === undefined ||
    isScheduler(resultSelectorOrObservable)
  ) {
    initialState = initialStateOrOptions;
    resultSelector = identity;
    scheduler = resultSelectorOrObservable;
  } else {
    initialState = initialStateOrOptions;
    resultSelector = resultSelectorOrObservable;
  }

  return new Observable(function (subscriber) {
    var state = initialState;

    if (scheduler) {
      return scheduler.schedule(dispatch$3, 0, {
        subscriber: subscriber,
        iterate: iterate,
        condition: condition,
        resultSelector: resultSelector,
        state: state,
      });
    }

    do {
      if (condition) {
        var conditionResult = void 0;

        try {
          conditionResult = condition(state);
        } catch (err) {
          subscriber.error(err);
          return undefined;
        }

        if (!conditionResult) {
          subscriber.complete();
          break;
        }
      }

      var value = void 0;

      try {
        value = resultSelector(state);
      } catch (err) {
        subscriber.error(err);
        return undefined;
      }

      subscriber.next(value);

      if (subscriber.closed) {
        break;
      }

      try {
        state = iterate(state);
      } catch (err) {
        subscriber.error(err);
        return undefined;
      }
    } while (true);

    return undefined;
  });
}

function dispatch$3(state) {
  var subscriber = state.subscriber,
    condition = state.condition;

  if (subscriber.closed) {
    return undefined;
  }

  if (state.needIterate) {
    try {
      state.state = state.iterate(state.state);
    } catch (err) {
      subscriber.error(err);
      return undefined;
    }
  } else {
    state.needIterate = true;
  }

  if (condition) {
    var conditionResult = void 0;

    try {
      conditionResult = condition(state.state);
    } catch (err) {
      subscriber.error(err);
      return undefined;
    }

    if (!conditionResult) {
      subscriber.complete();
      return undefined;
    }

    if (subscriber.closed) {
      return undefined;
    }
  }

  var value;

  try {
    value = state.resultSelector(state.state);
  } catch (err) {
    subscriber.error(err);
    return undefined;
  }

  if (subscriber.closed) {
    return undefined;
  }

  subscriber.next(value);

  if (subscriber.closed) {
    return undefined;
  }

  return this.schedule(state);
}

/** PURE_IMPORTS_START _defer,_empty PURE_IMPORTS_END */
function iif(condition, trueResult, falseResult) {
  if (trueResult === void 0) {
    trueResult = EMPTY;
  }

  if (falseResult === void 0) {
    falseResult = EMPTY;
  }

  return defer(function () {
    return condition() ? trueResult : falseResult;
  });
}

/** PURE_IMPORTS_START _isArray PURE_IMPORTS_END */
function isNumeric(val) {
  return !isArray(val) && val - parseFloat(val) + 1 >= 0;
}

/** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric PURE_IMPORTS_END */
function interval(period, scheduler) {
  if (period === void 0) {
    period = 0;
  }

  if (scheduler === void 0) {
    scheduler = async;
  }

  if (!isNumeric(period) || period < 0) {
    period = 0;
  }

  if (!scheduler || typeof scheduler.schedule !== "function") {
    scheduler = async;
  }

  return new Observable(function (subscriber) {
    subscriber.add(
      scheduler.schedule(dispatch$4, period, {
        subscriber: subscriber,
        counter: 0,
        period: period,
      })
    );
    return subscriber;
  });
}

function dispatch$4(state) {
  var subscriber = state.subscriber,
    counter = state.counter,
    period = state.period;
  subscriber.next(counter);
  this.schedule(
    {
      subscriber: subscriber,
      counter: counter + 1,
      period: period,
    },
    period
  );
}

/** PURE_IMPORTS_START _Observable,_util_isScheduler,_operators_mergeAll,_fromArray PURE_IMPORTS_END */
function merge() {
  var observables = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }

  var concurrent = Number.POSITIVE_INFINITY;
  var scheduler = null;
  var last = observables[observables.length - 1];

  if (isScheduler(last)) {
    scheduler = observables.pop();

    if (
      observables.length > 1 &&
      typeof observables[observables.length - 1] === "number"
    ) {
      concurrent = observables.pop();
    }
  } else if (typeof last === "number") {
    concurrent = observables.pop();
  }

  if (
    scheduler === null &&
    observables.length === 1 &&
    observables[0] instanceof Observable
  ) {
    return observables[0];
  }

  return mergeAll(concurrent)(fromArray(observables, scheduler));
}

/** PURE_IMPORTS_START _Observable,_util_noop PURE_IMPORTS_END */
var NEVER = /*@__PURE__*/ new Observable(noop);
function never() {
  return NEVER;
}

/** PURE_IMPORTS_START _Observable,_from,_util_isArray,_empty PURE_IMPORTS_END */
function onErrorResumeNext() {
  var sources = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    sources[_i] = arguments[_i];
  }

  if (sources.length === 0) {
    return EMPTY;
  }

  var first = sources[0],
    remainder = sources.slice(1);

  if (sources.length === 1 && isArray(first)) {
    return onErrorResumeNext.apply(void 0, first);
  }

  return new Observable(function (subscriber) {
    var subNext = function subNext() {
      return subscriber.add(
        onErrorResumeNext.apply(void 0, remainder).subscribe(subscriber)
      );
    };

    return from(first).subscribe({
      next: function next(value) {
        subscriber.next(value);
      },
      error: subNext,
      complete: subNext,
    });
  });
}

/** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */
function pairs(obj, scheduler) {
  if (!scheduler) {
    return new Observable(function (subscriber) {
      var keys = Object.keys(obj);

      for (var i = 0; i < keys.length && !subscriber.closed; i++) {
        var key = keys[i];

        if (obj.hasOwnProperty(key)) {
          subscriber.next([key, obj[key]]);
        }
      }

      subscriber.complete();
    });
  } else {
    return new Observable(function (subscriber) {
      var keys = Object.keys(obj);
      var subscription = new Subscription();
      subscription.add(
        scheduler.schedule(dispatch$5, 0, {
          keys: keys,
          index: 0,
          subscriber: subscriber,
          subscription: subscription,
          obj: obj,
        })
      );
      return subscription;
    });
  }
}
function dispatch$5(state) {
  var keys = state.keys,
    index = state.index,
    subscriber = state.subscriber,
    subscription = state.subscription,
    obj = state.obj;

  if (!subscriber.closed) {
    if (index < keys.length) {
      var key = keys[index];
      subscriber.next([key, obj[key]]);
      subscription.add(
        this.schedule({
          keys: keys,
          index: index + 1,
          subscriber: subscriber,
          subscription: subscription,
          obj: obj,
        })
      );
    } else {
      subscriber.complete();
    }
  }
}

/** PURE_IMPORTS_START  PURE_IMPORTS_END */
function not(pred, thisArg) {
  function notPred() {
    return !notPred.pred.apply(notPred.thisArg, arguments);
  }

  notPred.pred = pred;
  notPred.thisArg = thisArg;
  return notPred;
}

/** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
function filter(predicate, thisArg) {
  return function filterOperatorFunction(source) {
    return source.lift(new FilterOperator(predicate, thisArg));
  };
}

var FilterOperator = /*@__PURE__*/ (function () {
  function FilterOperator(predicate, thisArg) {
    this.predicate = predicate;
    this.thisArg = thisArg;
  }

  FilterOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(
      new FilterSubscriber(subscriber, this.predicate, this.thisArg)
    );
  };

  return FilterOperator;
})();

var FilterSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(FilterSubscriber, _super);

  function FilterSubscriber(destination, predicate, thisArg) {
    var _this = _super.call(this, destination) || this;

    _this.predicate = predicate;
    _this.thisArg = thisArg;
    _this.count = 0;
    return _this;
  }

  FilterSubscriber.prototype._next = function (value) {
    var result;

    try {
      result = this.predicate.call(this.thisArg, value, this.count++);
    } catch (err) {
      this.destination.error(err);
      return;
    }

    if (result) {
      this.destination.next(value);
    }
  };

  return FilterSubscriber;
})(Subscriber);

/** PURE_IMPORTS_START _util_not,_util_subscribeTo,_operators_filter,_Observable PURE_IMPORTS_END */
function partition(source, predicate, thisArg) {
  return [
    filter(predicate, thisArg)(new Observable(subscribeTo(source))),
    filter(not(predicate, thisArg))(new Observable(subscribeTo(source))),
  ];
}

/** PURE_IMPORTS_START tslib,_util_isArray,_fromArray,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
function race() {
  var observables = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }

  if (observables.length === 1) {
    if (isArray(observables[0])) {
      observables = observables[0];
    } else {
      return observables[0];
    }
  }

  return fromArray(observables, undefined).lift(new RaceOperator());
}

var RaceOperator = /*@__PURE__*/ (function () {
  function RaceOperator() {}

  RaceOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(new RaceSubscriber(subscriber));
  };

  return RaceOperator;
})();

var RaceSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(RaceSubscriber, _super);

  function RaceSubscriber(destination) {
    var _this = _super.call(this, destination) || this;

    _this.hasFirst = false;
    _this.observables = [];
    _this.subscriptions = [];
    return _this;
  }

  RaceSubscriber.prototype._next = function (observable) {
    this.observables.push(observable);
  };

  RaceSubscriber.prototype._complete = function () {
    var observables = this.observables;
    var len = observables.length;

    if (len === 0) {
      this.destination.complete();
    } else {
      for (var i = 0; i < len && !this.hasFirst; i++) {
        var observable = observables[i];
        var subscription = subscribeToResult(this, observable, observable, i);

        if (this.subscriptions) {
          this.subscriptions.push(subscription);
        }

        this.add(subscription);
      }

      this.observables = null;
    }
  };

  RaceSubscriber.prototype.notifyNext = function (
    outerValue,
    innerValue,
    outerIndex,
    innerIndex,
    innerSub
  ) {
    if (!this.hasFirst) {
      this.hasFirst = true;

      for (var i = 0; i < this.subscriptions.length; i++) {
        if (i !== outerIndex) {
          var subscription = this.subscriptions[i];
          subscription.unsubscribe();
          this.remove(subscription);
        }
      }

      this.subscriptions = null;
    }

    this.destination.next(innerValue);
  };

  return RaceSubscriber;
})(OuterSubscriber);

/** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
function range(start, count, scheduler) {
  if (start === void 0) {
    start = 0;
  }

  return new Observable(function (subscriber) {
    if (count === undefined) {
      count = start;
      start = 0;
    }

    var index = 0;
    var current = start;

    if (scheduler) {
      return scheduler.schedule(dispatch$6, 0, {
        index: index,
        count: count,
        start: start,
        subscriber: subscriber,
      });
    } else {
      do {
        if (index++ >= count) {
          subscriber.complete();
          break;
        }

        subscriber.next(current++);

        if (subscriber.closed) {
          break;
        }
      } while (true);
    }

    return undefined;
  });
}
function dispatch$6(state) {
  var start = state.start,
    index = state.index,
    count = state.count,
    subscriber = state.subscriber;

  if (index >= count) {
    subscriber.complete();
    return;
  }

  subscriber.next(start);

  if (subscriber.closed) {
    return;
  }

  state.index = index + 1;
  state.start = start + 1;
  this.schedule(state);
}

/** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */
function timer(dueTime, periodOrScheduler, scheduler) {
  if (dueTime === void 0) {
    dueTime = 0;
  }

  var period = -1;

  if (isNumeric(periodOrScheduler)) {
    period = (Number(periodOrScheduler) < 1 && 1) || Number(periodOrScheduler);
  } else if (isScheduler(periodOrScheduler)) {
    scheduler = periodOrScheduler;
  }

  if (!isScheduler(scheduler)) {
    scheduler = async;
  }

  return new Observable(function (subscriber) {
    var due = isNumeric(dueTime) ? dueTime : +dueTime - scheduler.now();
    return scheduler.schedule(dispatch$7, due, {
      index: 0,
      period: period,
      subscriber: subscriber,
    });
  });
}

function dispatch$7(state) {
  var index = state.index,
    period = state.period,
    subscriber = state.subscriber;
  subscriber.next(index);

  if (subscriber.closed) {
    return;
  } else if (period === -1) {
    return subscriber.complete();
  }

  state.index = index + 1;
  this.schedule(state, period);
}

/** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */
function using(resourceFactory, observableFactory) {
  return new Observable(function (subscriber) {
    var resource;

    try {
      resource = resourceFactory();
    } catch (err) {
      subscriber.error(err);
      return undefined;
    }

    var result;

    try {
      result = observableFactory(resource);
    } catch (err) {
      subscriber.error(err);
      return undefined;
    }

    var source = result ? from(result) : EMPTY;
    var subscription = source.subscribe(subscriber);
    return function () {
      subscription.unsubscribe();

      if (resource) {
        resource.unsubscribe();
      }
    };
  });
}

/** PURE_IMPORTS_START tslib,_fromArray,_util_isArray,_Subscriber,_OuterSubscriber,_util_subscribeToResult,_.._internal_symbol_iterator PURE_IMPORTS_END */
function zip() {
  var observables = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    observables[_i] = arguments[_i];
  }

  var resultSelector = observables[observables.length - 1];

  if (typeof resultSelector === "function") {
    observables.pop();
  }

  return fromArray(observables, undefined).lift(
    new ZipOperator(resultSelector)
  );
}

var ZipOperator = /*@__PURE__*/ (function () {
  function ZipOperator(resultSelector) {
    this.resultSelector = resultSelector;
  }

  ZipOperator.prototype.call = function (subscriber, source) {
    return source.subscribe(new ZipSubscriber(subscriber, this.resultSelector));
  };

  return ZipOperator;
})();

var ZipSubscriber = /*@__PURE__*/ (function (_super) {
  __extends(ZipSubscriber, _super);

  function ZipSubscriber(destination, resultSelector, values) {
    if (values === void 0) {
      values = Object.create(null);
    }

    var _this = _super.call(this, destination) || this;

    _this.iterators = [];
    _this.active = 0;
    _this.resultSelector =
      typeof resultSelector === "function" ? resultSelector : null;
    _this.values = values;
    return _this;
  }

  ZipSubscriber.prototype._next = function (value) {
    var iterators = this.iterators;

    if (isArray(value)) {
      iterators.push(new StaticArrayIterator(value));
    } else if (typeof value[iterator] === "function") {
      iterators.push(new StaticIterator(value[iterator]()));
    } else {
      iterators.push(new ZipBufferIterator(this.destination, this, value));
    }
  };

  ZipSubscriber.prototype._complete = function () {
    var iterators = this.iterators;
    var len = iterators.length;
    this.unsubscribe();

    if (len === 0) {
      this.destination.complete();
      return;
    }

    this.active = len;

    for (var i = 0; i < len; i++) {
      var iterator = iterators[i];

      if (iterator.stillUnsubscribed) {
        var destination = this.destination;
        destination.add(iterator.subscribe(iterator, i));
      } else {
        this.active--;
      }
    }
  };

  ZipSubscriber.prototype.notifyInactive = function () {
    this.active--;

    if (this.active === 0) {
      this.destination.complete();
    }
  };

  ZipSubscriber.prototype.checkIterators = function () {
    var iterators = this.iterators;
    var len = iterators.length;
    var destination = this.destination;

    for (var i = 0; i < len; i++) {
      var iterator = iterators[i];

      if (typeof iterator.hasValue === "function" && !iterator.hasValue()) {
        return;
      }
    }

    var shouldComplete = false;
    var args = [];

    for (var i = 0; i < len; i++) {
      var iterator = iterators[i];
      var result = iterator.next();

      if (iterator.hasCompleted()) {
        shouldComplete = true;
      }

      if (result.done) {
        destination.complete();
        return;
      }

      args.push(result.value);
    }

    if (this.resultSelector) {
      this._tryresultSelector(args);
    } else {
      destination.next(args);
    }

    if (shouldComplete) {
      destination.complete();
    }
  };

  ZipSubscriber.prototype._tryresultSelector = function (args) {
    var result;

    try {
      result = this.resultSelector.apply(this, args);
    } catch (err) {
      this.destination.error(err);
      return;
    }

    this.destination.next(result);
  };

  return ZipSubscriber;
})(Subscriber);

var StaticIterator = /*@__PURE__*/ (function () {
  function StaticIterator(iterator) {
    this.iterator = iterator;
    this.nextResult = iterator.next();
  }

  StaticIterator.prototype.hasValue = function () {
    return true;
  };

  StaticIterator.prototype.next = function () {
    var result = this.nextResult;
    this.nextResult = this.iterator.next();
    return result;
  };

  StaticIterator.prototype.hasCompleted = function () {
    var nextResult = this.nextResult;
    return nextResult && nextResult.done;
  };

  return StaticIterator;
})();

var StaticArrayIterator = /*@__PURE__*/ (function () {
  function StaticArrayIterator(array) {
    this.array = array;
    this.index = 0;
    this.length = 0;
    this.length = array.length;
  }

  StaticArrayIterator.prototype[iterator] = function () {
    return this;
  };

  StaticArrayIterator.prototype.next = function (value) {
    var i = this.index++;
    var array = this.array;
    return i < this.length
      ? {
          value: array[i],
          done: false,
        }
      : {
          value: null,
          done: true,
        };
  };

  StaticArrayIterator.prototype.hasValue = function () {
    return this.array.length > this.index;
  };

  StaticArrayIterator.prototype.hasCompleted = function () {
    return this.array.length === this.index;
  };

  return StaticArrayIterator;
})();

var ZipBufferIterator = /*@__PURE__*/ (function (_super) {
  __extends(ZipBufferIterator, _super);

  function ZipBufferIterator(destination, parent, observable) {
    var _this = _super.call(this, destination) || this;

    _this.parent = parent;
    _this.observable = observable;
    _this.stillUnsubscribed = true;
    _this.buffer = [];
    _this.isComplete = false;
    return _this;
  }

  ZipBufferIterator.prototype[iterator] = function () {
    return this;
  };

  ZipBufferIterator.prototype.next = function () {
    var buffer = this.buffer;

    if (buffer.length === 0 && this.isComplete) {
      return {
        value: null,
        done: true,
      };
    } else {
      return {
        value: buffer.shift(),
        done: false,
      };
    }
  };

  ZipBufferIterator.prototype.hasValue = function () {
    return this.buffer.length > 0;
  };

  ZipBufferIterator.prototype.hasCompleted = function () {
    return this.buffer.length === 0 && this.isComplete;
  };

  ZipBufferIterator.prototype.notifyComplete = function () {
    if (this.buffer.length > 0) {
      this.isComplete = true;
      this.parent.notifyInactive();
    } else {
      this.destination.complete();
    }
  };

  ZipBufferIterator.prototype.notifyNext = function (
    outerValue,
    innerValue,
    outerIndex,
    innerIndex,
    innerSub
  ) {
    this.buffer.push(innerValue);
    this.parent.checkIterators();
  };

  ZipBufferIterator.prototype.subscribe = function (value, index) {
    return subscribeToResult(this, this.observable, this, index);
  };

  return ZipBufferIterator;
})(OuterSubscriber);

/** PURE_IMPORTS_START  PURE_IMPORTS_END */

var _esm5 = /*#__PURE__*/ Object.freeze({
  __proto__: null,
  Observable: Observable,
  ConnectableObservable: ConnectableObservable,
  GroupedObservable: GroupedObservable,
  observable: observable,
  Subject: Subject,
  BehaviorSubject: BehaviorSubject,
  ReplaySubject: ReplaySubject,
  AsyncSubject: AsyncSubject,
  asap: asap,
  asapScheduler: asapScheduler,
  async: async,
  asyncScheduler: asyncScheduler,
  queue: queue,
  queueScheduler: queueScheduler,
  animationFrame: animationFrame,
  animationFrameScheduler: animationFrameScheduler,
  VirtualTimeScheduler: VirtualTimeScheduler,
  VirtualAction: VirtualAction,
  Scheduler: Scheduler,
  Subscription: Subscription,
  Subscriber: Subscriber,
  Notification: Notification,
  get NotificationKind() {
    return NotificationKind;
  },
  pipe: pipe,
  noop: noop,
  identity: identity,
  isObservable: isObservable,
  ArgumentOutOfRangeError: ArgumentOutOfRangeError,
  EmptyError: EmptyError,
  ObjectUnsubscribedError: ObjectUnsubscribedError,
  UnsubscriptionError: UnsubscriptionError,
  TimeoutError: TimeoutError,
  bindCallback: bindCallback,
  bindNodeCallback: bindNodeCallback,
  combineLatest: combineLatest,
  concat: concat,
  defer: defer,
  empty: empty$1,
  forkJoin: forkJoin,
  from: from,
  fromEvent: fromEvent,
  fromEventPattern: fromEventPattern,
  generate: generate,
  iif: iif,
  interval: interval,
  merge: merge,
  never: never,
  of: of,
  onErrorResumeNext: onErrorResumeNext,
  pairs: pairs,
  partition: partition,
  race: race,
  range: range,
  throwError: throwError,
  timer: timer,
  using: using,
  zip: zip,
  scheduled: scheduled,
  EMPTY: EMPTY,
  NEVER: NEVER,
  config: config,
});

var lib = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true,
  });

  function createCommonjsModule(fn, module) {
    return (
      (module = {
        exports: {},
      }),
      fn(module, module.exports),
      module.exports
    );
  }

  var _typeof_1 = createCommonjsModule(function (module) {
    function _typeof(obj) {
      "@babel/helpers - typeof";

      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        module.exports = _typeof = function _typeof(obj) {
          return typeof obj;
        };
      } else {
        module.exports = _typeof = function _typeof(obj) {
          return obj &&
            typeof Symbol === "function" &&
            obj.constructor === Symbol &&
            obj !== Symbol.prototype
            ? "symbol"
            : typeof obj;
        };
      }

      return _typeof(obj);
    }

    module.exports = _typeof;
  });
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  /* global Reflect, Promise */

  var _extendStatics = function extendStatics(d, b) {
    _extendStatics =
      Object.setPrototypeOf ||
      ({
        __proto__: [],
      } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) {
          if (b.hasOwnProperty(p)) d[p] = b[p];
        }
      };

    return _extendStatics(d, b);
  };

  function __extends(d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype =
      b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  }

  var _assign = function __assign() {
    _assign =
      Object.assign ||
      function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }

        return t;
      };

    return _assign.apply(this, arguments);
  };

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var arrayWithHoles = _arrayWithHoles;

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
      return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  var iterableToArrayLimit = _iterableToArrayLimit;

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  var arrayLikeToArray = _arrayLikeToArray;

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
      return arrayLikeToArray(o, minLen);
  }

  var unsupportedIterableToArray = _unsupportedIterableToArray;

  function _nonIterableRest() {
    throw new TypeError(
      "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }

  var nonIterableRest = _nonIterableRest;

  function _slicedToArray(arr, i) {
    return (
      arrayWithHoles(arr) ||
      iterableToArrayLimit(arr, i) ||
      unsupportedIterableToArray(arr, i) ||
      nonIterableRest()
    );
  }

  var slicedToArray = _slicedToArray;
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  /* global Reflect, Promise */

  var _extendStatics$1 = function extendStatics(d, b) {
    _extendStatics$1 =
      Object.setPrototypeOf ||
      ({
        __proto__: [],
      } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) {
          if (b.hasOwnProperty(p)) d[p] = b[p];
        }
      };

    return _extendStatics$1(d, b);
  };

  function __extends$1(d, b) {
    _extendStatics$1(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype =
      b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  }

  var _assign$1 = function __assign() {
    _assign$1 =
      Object.assign ||
      function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }

        return t;
      };

    return _assign$1.apply(this, arguments);
  };

  function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
      s += arguments[i].length;
    }

    for (var r = Array(s), k = 0, i = 0; i < il; i++) {
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
        r[k] = a[j];
      }
    }

    return r;
  }

  var assert = function assert(predicate, msg) {
    if (!predicate) {
      throw new Error(msg);
    }
  };

  var isDefined = function isDefined(val) {
    return typeof val !== "undefined";
  };

  var assertDefined = function assertDefined(val) {
    var msg =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "Expect to be defined";
    assert(isDefined(val), msg);
  };

  var isString = function isString(val) {
    return typeof val === "string" || val instanceof String;
  };

  var assertString = function assertString(val) {
    var msg =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "Expected to be a string";
    assert(isDefined(val) && isString(val), msg);
  };

  var assertNonEmptyString = function assertNonEmptyString(val) {
    var msg =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "Expected to be non empty string";
    assertString(val, msg);
    assert(val.length > 0, msg);
  };

  var isArray = function isArray(val) {
    return Array.isArray(val);
  };

  var isNonEmptyArray = function isNonEmptyArray(val) {
    return isArray(val) && val.length > 0;
  };

  var assertArray = function assertArray(val) {
    var msg =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "Expected to be an array";
    assert(isArray(val), msg);
  };

  var asserNotEmptytArray = function asserNotEmptytArray(val) {
    var msg =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "Expected to be an array";
    assert(isNonEmptyArray(val), msg);
  };

  var isObject = function isObject(val) {
    return Object.prototype.toString.call(val) === "[object Object]";
  };

  var assertObject = function assertObject(val) {
    var msg =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "Expected to be an object";
    assert(isObject(val), msg);
  };

  var assertNonEmptyObject = function assertNonEmptyObject(val) {
    var msg =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "Expected to be non empty object";
    assertObject(val, msg);
    assert(Object.keys(val).length > 0, msg);
  };

  var isOneOf = function isOneOf(collection, val) {
    if (isArray(collection)) {
      return collection.includes(val);
    }

    if (isObject(collection)) {
      return Object.values(collection).includes(val);
    }

    return false;
  };

  var assertOneOf = function assertOneOf(collection, val) {
    var msg =
      arguments.length > 2 && arguments[2] !== undefined
        ? arguments[2]
        : "Expected to be one of the collection elements";
    assert(isOneOf(collection, val), msg);
  };

  var isFunction = function isFunction(val) {
    return (
      typeof val === "function" &&
      !/^class\s/.test(Function.prototype.toString.call(val))
    );
  };

  var assertFunction = function assertFunction(val) {
    var msg =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "Expected to be a function";
    assert(isFunction(val), msg);
  };

  var isNumber = function isNumber(val) {
    return typeof val === "number" && !isNaN(val);
  };

  var assertNumber = function assertNumber(val) {
    var msg =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "Expected to be a number";
    assert(isNumber(val), msg);
  };

  var NOT_VALID_PROTOCOL = "Not a valid protocol";
  var NOT_VALID_ADDRESS = "Address must be of type object";
  var NOT_VALID_HOST = "Not a valid host";
  var NOT_VALID_PATH = "Not a valid path";
  var NOT_VALID_PORT = "Not a valid port";
  var ASYNC_MODEL_TYPES = {
    REQUEST_RESPONSE: "requestResponse",
    REQUEST_STREAM: "requestStream",
  };
  var SERVICE_NAME_NOT_PROVIDED =
    "MS0020 - Invalid format, definition must contain valid serviceName";
  var DEFINITION_MISSING_METHODS =
    "MS0021 - Invalid format, definition must contain valid methods";
  var INVALID_METHODS =
    "MS0022 - Invalid format, definition must contain valid methods";

  var getServiceNameInvalid = function getServiceNameInvalid(serviceName) {
    return "MS0023 - Invalid format, serviceName must be not empty string but received type ".concat(
      _typeof_1(serviceName)
    );
  };

  var getIncorrectMethodValueError = function getIncorrectMethodValueError(
    qualifier
  ) {
    return "Method value for ".concat(
      qualifier,
      " definition should be non empty object"
    );
  };

  var getAsynModelNotProvidedError = function getAsynModelNotProvidedError(
    qualifier
  ) {
    return "Async model is not provided in service definition for ".concat(
      qualifier
    );
  };

  var getInvalidAsyncModelError = function getInvalidAsyncModelError(
    qualifier
  ) {
    return "Invalid async model in service definition for ".concat(qualifier);
  };

  var validateAddress = function validateAddress(address) {
    var isOptional =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (isOptional && typeof address === "undefined") {
      return true;
    }

    assertNonEmptyObject(address, NOT_VALID_ADDRESS);
    var host = address.host,
      path = address.path,
      protocol = address.protocol;
    var port = address.port;
    port = isString(port) ? Number(port) : port;
    assertString(host, NOT_VALID_HOST);
    assertString(path, NOT_VALID_PATH);
    assertNumber(port, NOT_VALID_PORT);
    assertString(protocol, NOT_VALID_PROTOCOL);
    assert(isOneOf(["pm", "ws", "wss", "tcp"], protocol), NOT_VALID_PROTOCOL);
    return true;
  };
  /**
   * address is <protocol>://<host>:<port>/<path>
   */

  var getFullAddress = function getFullAddress(address) {
    validateAddress(address, false);
    var host = address.host,
      path = address.path,
      port = address.port,
      protocol = address.protocol;
    return ""
      .concat(protocol, "://")
      .concat(host, ":")
      .concat(port, "/")
      .concat(path);
  };

  var getAddress = function getAddress(address) {
    var newAddress = {};
    address = buildAddress({
      key: "protocol",
      optionalValue: "pm",
      delimiter: "://",
      str: address,
      newAddress: newAddress,
    });
    address = buildAddress({
      key: "host",
      optionalValue: "defaultHost",
      delimiter: ":",
      str: address,
      newAddress: newAddress,
    });
    address = buildAddress({
      key: "port",
      optionalValue: 8080,
      delimiter: "/",
      str: address,
      newAddress: newAddress,
    });
    newAddress.path = address;
    return newAddress;
  };

  var buildAddress = function buildAddress(_ref) {
    var key = _ref.key,
      optionalValue = _ref.optionalValue,
      delimiter = _ref.delimiter,
      newAddress = _ref.newAddress,
      str = _ref.str;

    var _str$split = str.split(delimiter),
      _str$split2 = slicedToArray(_str$split, 2),
      v1 = _str$split2[0],
      rest = _str$split2[1];

    if (!rest) {
      rest = v1;
      v1 = optionalValue;
    }

    newAddress[key] = v1;
    return rest;
  };

  var isNodejs = function isNodejs() {
    try {
      // common api for main threat or worker in the browser
      return !navigator;
    } catch (e) {
      return false;
    }
  };

  var workersMap = {};
  var registeredIframes = {};
  var iframes = [];
  /**
   * check from which iframe the event arrived,
   * @param ev
   */

  var registerIframe = function registerIframe(ev) {
    iframes.some(function (iframe) {
      if (ev.source === iframe.contentWindow) {
        registeredIframes[
          ev.data.detail.whoAmI || ev.data.detail.origin
        ] = iframe;
      }

      return ev.source === iframe.contentWindow;
    });
  };

  var initialize = function initialize() {
    if (!isNodejs()) {
      // @ts-ignore
      if (
        typeof WorkerGlobalScope !== "undefined" &&
        self instanceof WorkerGlobalScope
      ) {
        console.warn("Don't use this on webworkers, only on the main thread");
      } else {
        addEventListener("message", function (ev) {
          if (ev && ev.data && !ev.data.workerId) {
            ev.data.type === "ConnectIframe" && registerIframe(ev);
            var detail = ev.data.detail;

            if (detail) {
              ev.data.workerId = 1;
              var propogateTo =
                workersMap[detail.to] || workersMap[detail.address]; // discoveryEvents || rsocketEvents

              if (propogateTo) {
                // @ts-ignore
                propogateTo.postMessage(ev.data, ev.ports);
              }

              var iframe =
                registeredIframes[detail.to] ||
                registeredIframes[detail.address];

              if (iframe) {
                iframe.contentWindow.postMessage(ev.data, "*", ev.ports);
              }
            }
          }
        });
      }
    }
  };

  function workerEventHandler(ev) {
    if (ev.data && ev.data.detail && ev.data.type) {
      var detail = ev.data.detail;

      if (!ev.data.workerId) {
        ev.data.workerId = 1;

        if (ev.data.type === "ConnectWorkerEvent") {
          if (detail.whoAmI) {
            // @ts-ignore
            workersMap[detail.whoAmI] = this;
          }
        } else {
          var propogateTo = workersMap[detail.to] || workersMap[detail.address]; // discoveryEvents || rsocketEvents

          if (propogateTo) {
            // @ts-ignore
            propogateTo.postMessage(ev.data, ev.ports);
          } else {
            // @ts-ignore
            postMessage(ev.data, "*", ev.ports);
          }
        }
      }
    }
  }

  var addWorker = function addWorker(worker) {
    worker.addEventListener("message", workerEventHandler.bind(worker));
  };

  var removeWorker = function removeWorker(worker) {
    worker.removeEventListener("message", workerEventHandler.bind(worker));
  };

  var addIframe = function addIframe(iframe) {
    iframes.push(iframe);
  };

  var colorsMap = {};

  var getRandomColor = function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";

    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  };

  var saveToLogs = function saveToLogs(identifier, msg, extra, debug) {
    var type =
      arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "log";

    if (!colorsMap[identifier]) {
      colorsMap[identifier] = getRandomColor();
    } // tslint:disable

    if (debug) {
      var logColor = "color:".concat(colorsMap[identifier]);
      extra &&
        console[type](
          "%c******** address: ".concat(identifier, "********"),
          logColor
        );
      console[type](msg);
      extra &&
        Object.keys(extra).forEach(function (key) {
          if (Array.isArray(extra[key])) {
            Object.values(extra[key]).forEach(function (props) {
              console[type](
                ""
                  .concat(key, ": ")
                  .concat(JSON.stringify(props.qualifier || props, null, 2))
              );
            });
          } else {
            console[type](
              "".concat(key, ": ").concat(JSON.stringify(extra[key], null, 2))
            );
          }
        });
    } // tslint:enable
  };

  var getQualifier = function getQualifier(_ref2) {
    var serviceName = _ref2.serviceName,
      methodName = _ref2.methodName;
    return "".concat(serviceName, "/").concat(methodName);
  };

  var validateServiceDefinition = function validateServiceDefinition(
    definition
  ) {
    assertNonEmptyObject(definition);
    var serviceName = definition.serviceName,
      methods = definition.methods;
    assertDefined(serviceName, SERVICE_NAME_NOT_PROVIDED);
    assertNonEmptyString(serviceName, getServiceNameInvalid(serviceName));
    assertDefined(methods, DEFINITION_MISSING_METHODS);
    assertNonEmptyObject(methods, INVALID_METHODS);
    Object.keys(methods).forEach(function (methodName) {
      assertNonEmptyString(methodName);
      var qualifier = getQualifier({
        serviceName: serviceName,
        methodName: methodName,
      });
      validateAsyncModel(qualifier, methods[methodName]);
    });
  };

  var validateAsyncModel = function validateAsyncModel(qualifier, val) {
    assertNonEmptyObject(val, getIncorrectMethodValueError(qualifier));
    var asyncModel = val.asyncModel;
    assertDefined(asyncModel, getAsynModelNotProvidedError(qualifier));
    assertOneOf(
      ASYNC_MODEL_TYPES,
      asyncModel,
      getInvalidAsyncModelError(qualifier)
    );
  }; // polyfill MessagePort and MessageChannel

  var MessagePortPolyfill = /*#__PURE__*/ (function () {
    function MessagePortPolyfill(whoami) {
      classCallCheck(this, MessagePortPolyfill);
      this.onmessage = null;
      this.onmessageerror = null;
      this.otherPort = null;
      this.onmessageListeners = [];
      this.queue = [];
      this.otherSideStart = false;
      this.whoami = whoami;
    }

    createClass(MessagePortPolyfill, [
      {
        key: "dispatchEvent",
        value: function dispatchEvent(event) {
          if (this.onmessage) {
            this.onmessage(event);
          }

          this.onmessageListeners.forEach(function (listener) {
            return listener(event);
          });
          return true;
        },
      },
      {
        key: "postMessage",
        value: function postMessage(message, ports) {
          var event = {
            ports: ports,
            data: message,
          };

          if (!this.otherPort) {
            return;
          }

          if (this.otherSideStart) {
            this.otherPort.dispatchEvent(event);
          } else {
            this.queue.push(event);
          }
        },
      },
      {
        key: "addEventListener",
        value: function addEventListener(type, listener) {
          if (type !== "message") {
            return;
          }

          if (
            typeof listener !== "function" ||
            this.onmessageListeners.indexOf(listener) !== -1
          ) {
            return;
          }

          this.onmessageListeners.push(listener);
        },
      },
      {
        key: "removeEventListener",
        value: function removeEventListener(type, listener) {
          if (type !== "message") {
            return;
          }

          var index = this.onmessageListeners.indexOf(listener);

          if (index === -1) {
            return;
          }

          this.onmessageListeners.splice(index, 1);
        },
      },
      {
        key: "start",
        value: function start() {
          var _this2 = this;

          setTimeout(function () {
            return (
              _this2.otherPort &&
              _this2.otherPort.startSending.apply(_this2.otherPort, [])
            );
          }, 0);
        },
      },
      {
        key: "close",
        value: function close() {
          var _this3 = this;

          setTimeout(function () {
            return (
              _this3.otherPort &&
              _this3.otherPort.stopSending.apply(_this3.otherPort, [])
            );
          }, 0);
        },
      },
      {
        key: "startSending",
        value: function startSending() {
          var _this4 = this;

          this.otherSideStart = true;
          this.queue.forEach(function (event) {
            return _this4.otherPort && _this4.otherPort.dispatchEvent(event);
          });
        },
      },
      {
        key: "stopSending",
        value: function stopSending() {
          this.otherSideStart = false;
          this.queue.length = 0;
        },
      },
    ]);
    return MessagePortPolyfill;
  })(); // tslint:disable-next-line

  var MessageChannelPolyfill = function MessageChannelPolyfill() {
    classCallCheck(this, MessageChannelPolyfill);
    this.port1 = new MessagePortPolyfill("client");
    this.port2 = new MessagePortPolyfill("server");
    this.port1.otherPort = this.port2;
    this.port2.otherPort = this.port1;
  };

  var globalObj =
    typeof window !== "undefined" && window.Math === Math
      ? window
      : typeof self !== "undefined" && self.Math === Math
      ? self
      : Function("return this")();

  function applyMessageChannelPolyfill() {
    globalObj.MessagePort = MessagePortPolyfill;
    globalObj.MessageChannel = MessageChannelPolyfill;
  }

  if (!globalObj.MessagePort || !globalObj.MessageChannel) {
    applyMessageChannelPolyfill();
  }

  var workers = !isNodejs()
    ? {
        addWorker: addWorker,
        removeWorker: removeWorker,
        initialize: initialize,
        addIframe: addIframe,
      }
    : {};
  var INVALID_ITEMS_TO_PUBLISH = "itemsToPublish are not of type Array";
  var NODEJS_MUST_PROVIDE_CLUSTER_IMPL =
    "Must provide cluster when running on nodejs";

  var getAddressCollision = function getAddressCollision(address, seedAddress) {
    return (
      "address " +
      address +
      " must be different from the seed Address " +
      seedAddress
    );
  };

  var getDiscoverySuccessfullyDestroyedMessage = function getDiscoverySuccessfullyDestroyedMessage(
    address
  ) {
    return getFullAddress(address) + " has been removed";
  };

  var createDiscovery = function createDiscovery(options) {
    var address = options.address,
      itemsToPublish = options.itemsToPublish,
      seedAddress = options.seedAddress,
      debug = options.debug;
    var joinCluster = options.cluster;
    var discoveredItemsSubject = new _esm5.ReplaySubject();

    if (!joinCluster) {
      saveToLogs(
        getFullAddress(address),
        NODEJS_MUST_PROVIDE_CLUSTER_IMPL,
        {},
        debug,
        "warn"
      );
      discoveredItemsSubject.complete();
      return {
        destroy: function destroy() {
          return Promise.resolve(NODEJS_MUST_PROVIDE_CLUSTER_IMPL);
        },
        discoveredItems$: function discoveredItems$() {
          return discoveredItemsSubject.asObservable();
        },
      };
    }

    var membersState = {};
    validateAddress(address, false);

    if (seedAddress) {
      seedAddress.forEach(function (seed) {
        validateAddress(seed, false);
        validateAddressCollision(address, seed);
      });
    }

    assertArray(itemsToPublish, INVALID_ITEMS_TO_PUBLISH);
    var cluster = joinCluster({
      address: address,
      seedAddress: seedAddress,
      itemsToPublish: itemsToPublish,
      debug: false,
    });
    var clusterListener = cluster.listen$();
    var subscription;
    return Object.freeze({
      destroy: function destroy() {
        subscription && subscription.unsubscribe();
        discoveredItemsSubject.complete();
        return new Promise(function (resolve, reject) {
          cluster
            .destroy()
            .then(function () {
              return resolve(getDiscoverySuccessfullyDestroyedMessage(address));
            })
            ["catch"](function (error) {
              return reject(error);
            });
        });
      },
      discoveredItems$: function discoveredItems$() {
        cluster
          .getCurrentMembersData()
          .then(function (currentMembersState) {
            var members = Object.keys(currentMembersState);
            members.forEach(function (member) {
              var memberItem = currentMembersState[member];

              if (memberItem.length === 0) {
                discoveredItemsSubject.next({
                  type: "IDLE",
                  items: [],
                });
              } else {
                if (!membersState[member]) {
                  membersState[member] = true;
                  discoveredItemsSubject.next({
                    type: "REGISTERED",
                    items: memberItem,
                  });
                }
              }
            });
          })
          ["catch"](function (error) {
            return discoveredItemsSubject.error(error);
          });
        subscription = clusterListener.subscribe(
          function (clusterEvent) {
            var type = clusterEvent.type,
              items = clusterEvent.items,
              from = clusterEvent.from;

            if (items.length > 0) {
              if (type === "REMOVED" && membersState[from]) {
                membersState[from] = false;
                discoveredItemsSubject.next({
                  type: "UNREGISTERED",
                  items: items,
                });
              }

              if (type !== "REMOVED" && !membersState[from]) {
                membersState[from] = true;
                discoveredItemsSubject.next({
                  type: "REGISTERED",
                  items: items,
                });
              }
            }
          },
          function (error) {
            return discoveredItemsSubject.error(error);
          },
          function () {
            return discoveredItemsSubject.complete();
          }
        );
        return discoveredItemsSubject.asObservable();
      },
    });
  };

  var validateAddressCollision = function validateAddressCollision(
    address,
    seedAddress
  ) {
    var fullAddress = getFullAddress(address);
    var fullSeedAddress = getFullAddress(seedAddress);

    if (fullAddress === fullSeedAddress) {
      throw new Error(getAddressCollision(fullAddress, fullSeedAddress));
    }
  };

  var ASYNC_MODEL_TYPES$1 = ASYNC_MODEL_TYPES;
  var MICROSERVICE_NOT_EXISTS = "MS0000 - microservice does not exists";
  var MESSAGE_NOT_PROVIDED = "MS0001 - Message has not been provided";
  var MESSAGE_DATA_NOT_PROVIDED = "MS0002 - Message data has not been provided";
  var MESSAGE_QUALIFIER_NOT_PROVIDED =
    "MS0003 - Message qualifier has not been provided";
  var INVALID_MESSAGE = "MS0004 - Message should not to be empty object";
  var INVALID_QUALIFIER =
    "MS0005 - qualifier expected to be service/method format";
  var SERVICE_DEFINITION_NOT_PROVIDED = "MS0006 - Service missing definition";
  var WRONG_DATA_FORMAT_IN_MESSAGE =
    "MS0007 - Message format error: data must be Array";
  var SERVICES_IS_NOT_ARRAY =
    "MS0008 - Not valid format, services must be an Array";
  var SERVICE_IS_NOT_OBJECT =
    "MS0009 - Not valid format, service must be an Object";
  var MICROSERVICE_OPTIONS_IS_NOT_OBJECT =
    "MS0000 - Not valid format, MicroserviceOptions must be an Object";
  var QUALIFIER_IS_NOT_STRING = "MS0011 - qualifier should not be empty string";
  var TRANSPORT_NOT_PROVIDED = "MS0013 - Transport provider is not define";
  var ROUTER_NOT_PROVIDED = "MS0024 - Router is not define";
  var INVALID_ASYNC_MODEL = "MS0028 - invalid async model";

  var getServiceMethodIsMissingError = function getServiceMethodIsMissingError(
    methodName
  ) {
    return (
      "MS0014 - service method '" +
      methodName +
      "' missing in the serviceDefinition"
    );
  };

  var getNotFoundByRouterError = function getNotFoundByRouterError(
    whoAmI,
    qualifier
  ) {
    return (
      "MS0015 - " +
      whoAmI +
      " can't find services that match the give criteria: '" +
      JSON.stringify(qualifier) +
      "'"
    );
  };

  var getAsyncModelMissmatch = function getAsyncModelMissmatch(
    expectedAsyncModel,
    receivedAsyncModel
  ) {
    return (
      "MS0016 - asyncModel does not match, expect " +
      expectedAsyncModel +
      ", but received " +
      receivedAsyncModel
    );
  };

  var getMethodNotFoundError = function getMethodNotFoundError(message) {
    return "Can't find method " + message.qualifier;
  };

  var getInvalidMethodReferenceError = function getInvalidMethodReferenceError(
    qualifier
  ) {
    return (
      "MS0017 - service (" +
      qualifier +
      ") has valid definition but reference is not a function."
    );
  };

  var getServiceReferenceNotProvidedError = function getServiceReferenceNotProvidedError(
    serviceName
  ) {
    return (
      "MS0018 - service does not uphold the contract, " +
      serviceName +
      " is not provided"
    );
  };

  var getInvalidServiceReferenceError = function getInvalidServiceReferenceError(
    serviceName
  ) {
    return (
      "MS0019 - Not valid format, " +
      serviceName +
      " reference must be an Object"
    );
  };

  var getIncorrectServiceImplementForPromise = function getIncorrectServiceImplementForPromise(
    whoAmI,
    qualifier
  ) {
    return (
      "MS0025 - " +
      whoAmI +
      "'s service '" +
      qualifier +
      "' define as Promise but service return not Promise"
    );
  };

  var getIncorrectServiceImplementForObservable = function getIncorrectServiceImplementForObservable(
    whoAmI,
    qualifier
  ) {
    return (
      "MS0026 - " +
      whoAmI +
      "'s service '" +
      qualifier +
      "' define as Observable but service return not Observable"
    );
  };

  var getIncorrectServiceInvoke = function getIncorrectServiceInvoke(
    whoAmI,
    qualifier
  ) {
    return (
      "MS0027 - " +
      whoAmI +
      "'s " +
      qualifier +
      " has no valid response, expect Promise or Observable"
    );
  };

  var NO_PROXY_SUPPORT =
    "MS0029 - Proxy not supported, please add Proxy polyfill";

  var validateMicroserviceOptions = function validateMicroserviceOptions(
    microserviceOptions
  ) {
    assertObject(microserviceOptions, MICROSERVICE_OPTIONS_IS_NOT_OBJECT);
    var services = microserviceOptions.services,
      seedAddress = microserviceOptions.seedAddress,
      address = microserviceOptions.address;

    if (typeof seedAddress !== "undefined") {
      asserNotEmptytArray(seedAddress, NOT_VALID_ADDRESS);
      seedAddress.forEach(function (seed) {
        validateAddress(seed, true);
      });
    }

    validateAddress(address, true);
    validateMicroserviceServices(services);
  };

  var validateMicroserviceServices = function validateMicroserviceServices(
    services
  ) {
    assertArray(services, SERVICES_IS_NOT_ARRAY);
    services.forEach(validateService);
  };

  var validateService = function validateService(service) {
    assertNonEmptyObject(service, SERVICE_IS_NOT_OBJECT);
    var definition = service.definition,
      reference = service.reference;
    assertDefined(definition, SERVICE_DEFINITION_NOT_PROVIDED);
    validateServiceDefinition(definition);
    var serviceName = definition.serviceName;
    assertDefined(reference, getServiceReferenceNotProvidedError(serviceName));
  };

  var validateServiceReference = function validateServiceReference(
    reference,
    definition
  ) {
    var serviceName = definition.serviceName;
    assertObject(reference, getInvalidServiceReferenceError(serviceName));
    Object.keys(definition.methods).forEach(function (methodName) {
      var qualifier = getQualifier({
        serviceName: serviceName,
        methodName: methodName,
      });
      var staticMethodRef =
        reference.constructor && reference.constructor[methodName];
      assertFunction(
        reference[methodName] || staticMethodRef,
        getInvalidMethodReferenceError(qualifier)
      );
    });
  };

  var validateMessage = function validateMessage(message) {
    assertDefined(message, MESSAGE_NOT_PROVIDED);
    assertNonEmptyObject(message, INVALID_MESSAGE);
    var data = message.data,
      qualifier = message.qualifier;
    assertDefined(qualifier, MESSAGE_QUALIFIER_NOT_PROVIDED);
    validateQualifier(qualifier);
    assertDefined(data, MESSAGE_DATA_NOT_PROVIDED);
    assertArray(data, WRONG_DATA_FORMAT_IN_MESSAGE);
  };

  var validateQualifier = function validateQualifier(value) {
    assertNonEmptyString(value, QUALIFIER_IS_NOT_STRING);
    var parts = value.split("/");
    assert(parts.length === 2, INVALID_QUALIFIER);
    assertNonEmptyString(parts[0], INVALID_QUALIFIER);
    assertNonEmptyString(parts[1], INVALID_QUALIFIER);
  };

  var validateDiscoveryInstance = function validateDiscoveryInstance(
    discovery
  ) {
    assertDefined(discovery, "");
    var discoveredItems$ = discovery.discoveredItems$,
      destroy = discovery.destroy;
    assertDefined(discoveredItems$, "");
    assertDefined(destroy, "");
  };

  var serviceCallError = function serviceCallError(_a) {
    var errorMessage = _a.errorMessage,
      microserviceContext = _a.microserviceContext;
    var error = new Error(errorMessage);

    if (microserviceContext) {
      var whoAmI = microserviceContext.whoAmI,
        debug = microserviceContext.debug;
      saveToLogs(whoAmI, errorMessage, {}, debug, "warn");
    }

    return error;
  };

  var throwException = function throwException(asyncModel, message) {
    if (asyncModel === ASYNC_MODEL_TYPES$1.REQUEST_RESPONSE) {
      return Promise.reject(message);
    } else {
      return new _esm5.Observable(function (obs) {
        obs.error(message);
      });
    }
  };

  var localCall = function localCall(_a) {
    var localService = _a.localService,
      asyncModel = _a.asyncModel,
      message = _a.message,
      microserviceContext = _a.microserviceContext;
    var reference = localService.reference,
      asyncModelProvider = localService.asyncModel;
    var method = reference && reference[localService.methodName];

    if (!method) {
      return throwException(
        asyncModel,
        serviceCallError({
          errorMessage: getMethodNotFoundError(message),
          microserviceContext: microserviceContext,
        })
      );
    }

    if (asyncModelProvider !== asyncModel) {
      return throwException(
        asyncModel,
        serviceCallError({
          errorMessage: getAsyncModelMissmatch(asyncModel, asyncModelProvider),
          microserviceContext: microserviceContext,
        })
      );
    }

    var invoke = method.apply(void 0, message.data);

    if (_typeof_1(invoke) !== "object" || !invoke) {
      return throwException(
        asyncModel,
        serviceCallError({
          errorMessage: getIncorrectServiceInvoke(
            microserviceContext.whoAmI,
            message.qualifier
          ),
          microserviceContext: microserviceContext,
        })
      );
    }

    switch (asyncModel) {
      case ASYNC_MODEL_TYPES$1.REQUEST_STREAM:
        return new _esm5.Observable(function (obs) {
          if (isFunction(invoke.subscribe)) {
            var s_1 = invoke.subscribe(
              function () {
                var data = [];

                for (var _i = 0; _i < arguments.length; _i++) {
                  data[_i] = arguments[_i];
                }

                return obs.next.apply(obs, data);
              },
              function (err) {
                return obs.error(err);
              },
              function () {
                return obs.complete();
              }
            );
            return function () {
              return s_1.unsubscribe();
            };
          }

          obs.error(
            serviceCallError({
              errorMessage: getIncorrectServiceImplementForObservable(
                microserviceContext.whoAmI,
                message.qualifier
              ),
              microserviceContext: microserviceContext,
            })
          );
        });

      case ASYNC_MODEL_TYPES$1.REQUEST_RESPONSE:
        return new Promise(function (resolve, reject) {
          isFunction(invoke.then)
            ? invoke.then(resolve)["catch"](reject)
            : reject(
                serviceCallError({
                  errorMessage: getIncorrectServiceImplementForPromise(
                    microserviceContext.whoAmI,
                    message.qualifier
                  ),
                  microserviceContext: microserviceContext,
                })
              );
        });

      default:
        return throwException(
          asyncModel,
          serviceCallError({
            errorMessage: INVALID_ASYNC_MODEL,
            microserviceContext: microserviceContext,
          })
        );
    }
  };

  var loggerUtil = function loggerUtil(whoAmI, debug) {
    return function (msg, type) {
      saveToLogs(whoAmI, msg, {}, debug, type);
    };
  };

  var remoteCall = function remoteCall(options) {
    var asyncModel = options.asyncModel,
      transportClient = options.transportClient,
      microserviceContext = options.microserviceContext,
      message = options.message;
    var logger = loggerUtil(
      microserviceContext.whoAmI,
      microserviceContext.debug
    );

    switch (asyncModel) {
      case ASYNC_MODEL_TYPES$1.REQUEST_STREAM:
        var canceled_1 = false;

        var cancel_1 = function cancel_1() {
          canceled_1 = true;
        };

        return new _esm5.Observable(function (obs) {
          getValidEndpoint(options)
            .then(function (endpoint) {
              transportClient
                .start({
                  remoteAddress: endpoint.address,
                  logger: logger,
                })
                .then(function (_a) {
                  var requestStream = _a.requestStream;

                  if (canceled_1) {
                    return;
                  }

                  var sub = requestStream(message).subscribe(
                    function (data) {
                      return obs.next(data);
                    },
                    function (err) {
                      return obs.error(err);
                    },
                    function () {
                      return obs.complete();
                    }
                  );

                  cancel_1 = function cancel_1() {
                    return sub.unsubscribe();
                  };
                })
                ["catch"](function (error) {
                  return obs.error(error);
                });
            })
            ["catch"](function (error) {
              return obs.error(error);
            });
          return function () {
            return cancel_1();
          };
        });

      case ASYNC_MODEL_TYPES$1.REQUEST_RESPONSE:
        return new Promise(function (resolve, reject) {
          getValidEndpoint(options)
            .then(function (endpoint) {
              transportClient
                .start({
                  remoteAddress: endpoint.address,
                  logger: logger,
                })
                .then(function (_a) {
                  var requestResponse = _a.requestResponse;
                  requestResponse(message)
                    .then(function (response) {
                      return resolve(response);
                    })
                    ["catch"](function (e) {
                      return reject(e);
                    });
                })
                ["catch"](function (e) {
                  return reject(e);
                });
            })
            ["catch"](function (e) {
              return reject(e);
            });
        });

      default:
        throw new Error("invalid async model");
    }
  };

  var getValidEndpoint = function getValidEndpoint(_a) {
    var router = _a.router,
      microserviceContext = _a.microserviceContext,
      message = _a.message,
      asyncModel = _a.asyncModel,
      transportClient = _a.transportClient;
    return new Promise(function (resolve, reject) {
      router({
        lookUp: microserviceContext.remoteRegistry.lookUp,
        message: message,
      })
        .then(function (endPoint) {
          var asyncModelProvider = endPoint.asyncModel;

          if (asyncModelProvider !== asyncModel) {
            reject(
              serviceCallError({
                errorMessage: getAsyncModelMissmatch(
                  asyncModel,
                  asyncModelProvider
                ),
                microserviceContext: microserviceContext,
              })
            );
          }

          if (!transportClient) {
            reject(
              serviceCallError({
                errorMessage: TRANSPORT_NOT_PROVIDED,
                microserviceContext: microserviceContext,
              })
            );
          }

          resolve(endPoint);
        })
        ["catch"](function () {
          reject(
            serviceCallError({
              errorMessage: getNotFoundByRouterError(
                microserviceContext.whoAmI,
                message.qualifier
              ),
              microserviceContext: microserviceContext,
            })
          );
        });
    });
  };

  var getServiceCall = function getServiceCall(options) {
    var router = options.router,
      microserviceContext = options.microserviceContext,
      transportClient = options.transportClient;
    return function (_a) {
      var message = _a.message,
        asyncModel = _a.asyncModel;

      try {
        validateMessage(message);
      } catch (e) {
        var err = serviceCallError({
          errorMessage: e.message,
          microserviceContext: microserviceContext,
        });
        return asyncModel === ASYNC_MODEL_TYPES$1.REQUEST_RESPONSE
          ? Promise.reject(err)
          : _esm5.throwError(err);
      }

      var localService = microserviceContext.localRegistry.lookUp({
        qualifier: message.qualifier,
      });
      return localService
        ? localCall({
            localService: localService,
            asyncModel: asyncModel,
            message: message,
            microserviceContext: microserviceContext,
          })
        : remoteCall({
            router: router,
            microserviceContext: microserviceContext,
            message: message,
            asyncModel: asyncModel,
            transportClient: transportClient,
          });
    };
  };

  var _createServiceCall = function createServiceCall(options) {
    var router = options.router,
      microserviceContext = options.microserviceContext,
      transportClient = options.transportClient;

    if (!microserviceContext) {
      throw new Error(MICROSERVICE_NOT_EXISTS);
    }

    var serviceCall = getServiceCall({
      router: router,
      microserviceContext: microserviceContext,
      transportClient: transportClient,
    });
    return Object.freeze({
      requestStream: function requestStream(message) {
        return serviceCall({
          message: message,
          asyncModel: ASYNC_MODEL_TYPES$1.REQUEST_STREAM,
        });
      },
      requestResponse: function requestResponse(message) {
        return serviceCall({
          message: message,
          asyncModel: ASYNC_MODEL_TYPES$1.REQUEST_RESPONSE,
        });
      },
    });
  };

  var createRemoteRegistry = function createRemoteRegistry() {
    var remoteRegistryMap = {};
    return Object.freeze({
      lookUp: function lookUp(_a) {
        var qualifier = _a.qualifier;

        if (!remoteRegistryMap) {
          throw new Error(MICROSERVICE_NOT_EXISTS);
        }

        return remoteRegistryMap[qualifier] || [];
      },
      createEndPoints: function createEndPoints(options) {
        if (!remoteRegistryMap) {
          throw new Error(MICROSERVICE_NOT_EXISTS);
        }

        return getEndpointsFromServices(options); // all services => endPoints[]
      },
      update: function update(_a) {
        var type = _a.type,
          items = _a.items;

        if (type === "IDLE") {
          return;
        }

        if (!remoteRegistryMap) {
          throw new Error(MICROSERVICE_NOT_EXISTS);
        }

        remoteRegistryMap = updatedRemoteRegistry({
          type: type,
          items: items,
          remoteRegistryMap: remoteRegistryMap,
        });
      },
      destroy: function destroy() {
        remoteRegistryMap = null;
      },
    });
  }; // Helpers

  var getEndpointsFromServices = function getEndpointsFromServices(options) {
    var services = options.services,
      address = options.address;
    return services && address
      ? services.reduce(function (res, service) {
          return __spreadArrays(
            res,
            getEndpointsFromService({
              service: service,
              address: address,
            })
          );
        }, [])
      : [];
  };

  var updatedRemoteRegistry = function updatedRemoteRegistry(_a) {
    var type = _a.type,
      items = _a.items,
      remoteRegistryMap = _a.remoteRegistryMap;

    switch (type) {
      case "REGISTERED":
        remoteRegistryMap = items.reduce(function (res, endpoint) {
          var _a;

          return _assign$1(
            _assign$1({}, res),
            ((_a = {}),
            (_a[endpoint.qualifier] = __spreadArrays(
              res[endpoint.qualifier] || [],
              [endpoint]
            )),
            _a)
          );
        }, remoteRegistryMap || {});
        break;

      case "UNREGISTERED":
        items.forEach(function (unregisteredEndpoint) {
          remoteRegistryMap[unregisteredEndpoint.qualifier] = remoteRegistryMap[
            unregisteredEndpoint.qualifier
          ].filter(function (registryEndpoint) {
            return (
              getFullAddress(registryEndpoint.address) !==
              getFullAddress(unregisteredEndpoint.address)
            );
          });
        });
        break;
    }

    return _assign$1({}, remoteRegistryMap);
  };

  var getEndpointsFromService = function getEndpointsFromService(_a) {
    var service = _a.service,
      address = _a.address;
    var definition = service.definition;
    var serviceName = definition.serviceName,
      methods = definition.methods;
    return (
      Object.keys(methods).map(function (methodName) {
        return {
          qualifier: getQualifier({
            serviceName: serviceName,
            methodName: methodName,
          }),
          serviceName: serviceName,
          methodName: methodName,
          asyncModel: methods[methodName].asyncModel,
          address: address,
        };
      }) || []
    );
  };

  var getReferencePointer = function getReferencePointer(_a) {
    var reference = _a.reference,
      methodName = _a.methodName;
    var methodRef = reference[methodName];

    if (methodRef) {
      return methodRef.bind(reference);
    } // static method

    return reference.constructor && reference.constructor[methodName];
  };

  var flatteningServices = function flatteningServices(_a) {
    var services = _a.services,
      serviceFactoryOptions = _a.serviceFactoryOptions;
    return services && Array.isArray(services)
      ? services.map(function (service) {
          var reference = service.reference,
            definition = service.definition;

          if (isFunction(reference)) {
            var ref = reference(serviceFactoryOptions);
            validateServiceReference(ref, definition);
            return {
              reference: ref,
              definition: definition,
            };
          } else {
            validateServiceReference(reference, definition);
            return {
              reference: reference,
              definition: definition,
            };
          }
        })
      : services;
  };

  var createLocalRegistry = function createLocalRegistry() {
    var localRegistryMap = {};
    return Object.freeze({
      lookUp: function lookUp(_a) {
        var qualifier = _a.qualifier;

        if (!localRegistryMap) {
          throw new Error(MICROSERVICE_NOT_EXISTS);
        }

        return localRegistryMap[qualifier] || null;
      },
      add: function add(_a) {
        var _b = _a.services,
          services = _b === void 0 ? [] : _b;

        if (!localRegistryMap) {
          throw new Error(MICROSERVICE_NOT_EXISTS);
        }

        var references = getReferenceFromServices({
          services: services,
        });
        localRegistryMap = getUpdatedLocalRegistry({
          localRegistryMap: localRegistryMap,
          references: references,
        });
      },
      destroy: function destroy() {
        localRegistryMap = null;
      },
    });
  }; // Helpers

  var getReferenceFromServices = function getReferenceFromServices(_a) {
    var _b = _a.services,
      services = _b === void 0 ? [] : _b;
    return services.reduce(function (res, service) {
      return __spreadArrays(
        res,
        getReferenceFromService({
          service: service,
        })
      );
    }, []);
  };

  var getUpdatedLocalRegistry = function getUpdatedLocalRegistry(_a) {
    var localRegistryMap = _a.localRegistryMap,
      references = _a.references;
    return _assign$1(
      _assign$1({}, localRegistryMap),
      references.reduce(function (res, reference) {
        var _a;

        return _assign$1(
          _assign$1({}, res),
          ((_a = {}), (_a[reference.qualifier] = reference), _a)
        );
      }, localRegistryMap || {})
    );
  };

  var getReferenceFromService = function getReferenceFromService(_a) {
    var service = _a.service;
    var data = [];
    var definition = service.definition,
      reference = service.reference;
    var serviceName = definition.serviceName,
      methods = definition.methods;
    Object.keys(methods).forEach(function (methodName) {
      var _a;

      var qualifier = getQualifier({
        serviceName: serviceName,
        methodName: methodName,
      });
      data.push({
        qualifier: qualifier,
        serviceName: serviceName,
        methodName: methodName,
        asyncModel: methods[methodName].asyncModel,
        reference:
          ((_a = {}),
          (_a[methodName] = getReferencePointer({
            reference: reference,
            methodName: methodName,
          })),
          _a),
      });
    });
    return data;
  };
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  function isFunction$1(x) {
    return typeof x === "function";
  }
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  var _enable_super_gross_mode_that_will_cause_bad_things = false;
  var config = {
    Promise: undefined,

    set useDeprecatedSynchronousErrorHandling(value) {
      if (value) {
        var error = /*@__PURE__*/ new Error();
        /*@__PURE__*/

        console.warn(
          "DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n" +
            error.stack
        );
      }

      _enable_super_gross_mode_that_will_cause_bad_things = value;
    },

    get useDeprecatedSynchronousErrorHandling() {
      return _enable_super_gross_mode_that_will_cause_bad_things;
    },
  };
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  function hostReportError(err) {
    setTimeout(function () {
      throw err;
    }, 0);
  }
  /** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */

  var empty = {
    closed: true,
    next: function next(value) {},
    error: function error(err) {
      if (config.useDeprecatedSynchronousErrorHandling) {
        throw err;
      } else {
        hostReportError(err);
      }
    },
    complete: function complete() {},
  };
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  var isArray$1 = /*@__PURE__*/ (function () {
    return (
      Array.isArray ||
      function (x) {
        return x && typeof x.length === "number";
      }
    );
  })();
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  function isObject$1(x) {
    return x !== null && _typeof_1(x) === "object";
  }
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  var UnsubscriptionErrorImpl = /*@__PURE__*/ (function () {
    function UnsubscriptionErrorImpl(errors) {
      Error.call(this);
      this.message = errors
        ? errors.length +
          " errors occurred during unsubscription:\n" +
          errors
            .map(function (err, i) {
              return i + 1 + ") " + err.toString();
            })
            .join("\n  ")
        : "";
      this.name = "UnsubscriptionError";
      this.errors = errors;
      return this;
    }

    UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(
      Error.prototype
    );
    return UnsubscriptionErrorImpl;
  })();

  var UnsubscriptionError = UnsubscriptionErrorImpl;
  /** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */

  var Subscription = /*@__PURE__*/ (function () {
    function Subscription(unsubscribe) {
      this.closed = false;
      this._parentOrParents = null;
      this._subscriptions = null;

      if (unsubscribe) {
        this._unsubscribe = unsubscribe;
      }
    }

    Subscription.prototype.unsubscribe = function () {
      var errors;

      if (this.closed) {
        return;
      }

      var _a = this,
        _parentOrParents = _a._parentOrParents,
        _unsubscribe = _a._unsubscribe,
        _subscriptions = _a._subscriptions;

      this.closed = true;
      this._parentOrParents = null;
      this._subscriptions = null;

      if (_parentOrParents instanceof Subscription) {
        _parentOrParents.remove(this);
      } else if (_parentOrParents !== null) {
        for (var index = 0; index < _parentOrParents.length; ++index) {
          var parent_1 = _parentOrParents[index];
          parent_1.remove(this);
        }
      }

      if (isFunction$1(_unsubscribe)) {
        try {
          _unsubscribe.call(this);
        } catch (e) {
          errors =
            e instanceof UnsubscriptionError
              ? flattenUnsubscriptionErrors(e.errors)
              : [e];
        }
      }

      if (isArray$1(_subscriptions)) {
        var index = -1;
        var len = _subscriptions.length;

        while (++index < len) {
          var sub = _subscriptions[index];

          if (isObject$1(sub)) {
            try {
              sub.unsubscribe();
            } catch (e) {
              errors = errors || [];

              if (e instanceof UnsubscriptionError) {
                errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
              } else {
                errors.push(e);
              }
            }
          }
        }
      }

      if (errors) {
        throw new UnsubscriptionError(errors);
      }
    };

    Subscription.prototype.add = function (teardown) {
      var subscription = teardown;

      if (!teardown) {
        return Subscription.EMPTY;
      }

      switch (_typeof_1(teardown)) {
        case "function":
          subscription = new Subscription(teardown);

        case "object":
          if (
            subscription === this ||
            subscription.closed ||
            typeof subscription.unsubscribe !== "function"
          ) {
            return subscription;
          } else if (this.closed) {
            subscription.unsubscribe();
            return subscription;
          } else if (!(subscription instanceof Subscription)) {
            var tmp = subscription;
            subscription = new Subscription();
            subscription._subscriptions = [tmp];
          }

          break;

        default: {
          throw new Error(
            "unrecognized teardown " + teardown + " added to Subscription."
          );
        }
      }

      var _parentOrParents = subscription._parentOrParents;

      if (_parentOrParents === null) {
        subscription._parentOrParents = this;
      } else if (_parentOrParents instanceof Subscription) {
        if (_parentOrParents === this) {
          return subscription;
        }

        subscription._parentOrParents = [_parentOrParents, this];
      } else if (_parentOrParents.indexOf(this) === -1) {
        _parentOrParents.push(this);
      } else {
        return subscription;
      }

      var subscriptions = this._subscriptions;

      if (subscriptions === null) {
        this._subscriptions = [subscription];
      } else {
        subscriptions.push(subscription);
      }

      return subscription;
    };

    Subscription.prototype.remove = function (subscription) {
      var subscriptions = this._subscriptions;

      if (subscriptions) {
        var subscriptionIndex = subscriptions.indexOf(subscription);

        if (subscriptionIndex !== -1) {
          subscriptions.splice(subscriptionIndex, 1);
        }
      }
    };

    Subscription.EMPTY = (function (empty) {
      empty.closed = true;
      return empty;
    })(new Subscription());

    return Subscription;
  })();

  function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) {
      return errs.concat(err instanceof UnsubscriptionError ? err.errors : err);
    }, []);
  }
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  var rxSubscriber = /*@__PURE__*/ (function () {
    return typeof Symbol === "function"
      ? /*@__PURE__*/ Symbol("rxSubscriber")
      : "@@rxSubscriber_" + /*@__PURE__*/ Math.random();
  })();
  /** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */

  var Subscriber = /*@__PURE__*/ (function (_super) {
    __extends$1(Subscriber, _super);

    function Subscriber(destinationOrNext, error, complete) {
      var _this = _super.call(this) || this;

      _this.syncErrorValue = null;
      _this.syncErrorThrown = false;
      _this.syncErrorThrowable = false;
      _this.isStopped = false;

      switch (arguments.length) {
        case 0:
          _this.destination = empty;
          break;

        case 1:
          if (!destinationOrNext) {
            _this.destination = empty;
            break;
          }

          if (_typeof_1(destinationOrNext) === "object") {
            if (destinationOrNext instanceof Subscriber) {
              _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
              _this.destination = destinationOrNext;
              destinationOrNext.add(_this);
            } else {
              _this.syncErrorThrowable = true;
              _this.destination = new SafeSubscriber(_this, destinationOrNext);
            }

            break;
          }

        default:
          _this.syncErrorThrowable = true;
          _this.destination = new SafeSubscriber(
            _this,
            destinationOrNext,
            error,
            complete
          );
          break;
      }

      return _this;
    }

    Subscriber.prototype[rxSubscriber] = function () {
      return this;
    };

    Subscriber.create = function (next, error, complete) {
      var subscriber = new Subscriber(next, error, complete);
      subscriber.syncErrorThrowable = false;
      return subscriber;
    };

    Subscriber.prototype.next = function (value) {
      if (!this.isStopped) {
        this._next(value);
      }
    };

    Subscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        this.isStopped = true;

        this._error(err);
      }
    };

    Subscriber.prototype.complete = function () {
      if (!this.isStopped) {
        this.isStopped = true;

        this._complete();
      }
    };

    Subscriber.prototype.unsubscribe = function () {
      if (this.closed) {
        return;
      }

      this.isStopped = true;

      _super.prototype.unsubscribe.call(this);
    };

    Subscriber.prototype._next = function (value) {
      this.destination.next(value);
    };

    Subscriber.prototype._error = function (err) {
      this.destination.error(err);
      this.unsubscribe();
    };

    Subscriber.prototype._complete = function () {
      this.destination.complete();
      this.unsubscribe();
    };

    Subscriber.prototype._unsubscribeAndRecycle = function () {
      var _parentOrParents = this._parentOrParents;
      this._parentOrParents = null;
      this.unsubscribe();
      this.closed = false;
      this.isStopped = false;
      this._parentOrParents = _parentOrParents;
      return this;
    };

    return Subscriber;
  })(Subscription);

  var SafeSubscriber = /*@__PURE__*/ (function (_super) {
    __extends$1(SafeSubscriber, _super);

    function SafeSubscriber(
      _parentSubscriber,
      observerOrNext,
      error,
      complete
    ) {
      var _this = _super.call(this) || this;

      _this._parentSubscriber = _parentSubscriber;
      var next;
      var context = _this;

      if (isFunction$1(observerOrNext)) {
        next = observerOrNext;
      } else if (observerOrNext) {
        next = observerOrNext.next;
        error = observerOrNext.error;
        complete = observerOrNext.complete;

        if (observerOrNext !== empty) {
          context = Object.create(observerOrNext);

          if (isFunction$1(context.unsubscribe)) {
            _this.add(context.unsubscribe.bind(context));
          }

          context.unsubscribe = _this.unsubscribe.bind(_this);
        }
      }

      _this._context = context;
      _this._next = next;
      _this._error = error;
      _this._complete = complete;
      return _this;
    }

    SafeSubscriber.prototype.next = function (value) {
      if (!this.isStopped && this._next) {
        var _parentSubscriber = this._parentSubscriber;

        if (
          !config.useDeprecatedSynchronousErrorHandling ||
          !_parentSubscriber.syncErrorThrowable
        ) {
          this.__tryOrUnsub(this._next, value);
        } else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
          this.unsubscribe();
        }
      }
    };

    SafeSubscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        var _parentSubscriber = this._parentSubscriber;
        var useDeprecatedSynchronousErrorHandling =
          config.useDeprecatedSynchronousErrorHandling;

        if (this._error) {
          if (
            !useDeprecatedSynchronousErrorHandling ||
            !_parentSubscriber.syncErrorThrowable
          ) {
            this.__tryOrUnsub(this._error, err);

            this.unsubscribe();
          } else {
            this.__tryOrSetError(_parentSubscriber, this._error, err);

            this.unsubscribe();
          }
        } else if (!_parentSubscriber.syncErrorThrowable) {
          this.unsubscribe();

          if (useDeprecatedSynchronousErrorHandling) {
            throw err;
          }

          hostReportError(err);
        } else {
          if (useDeprecatedSynchronousErrorHandling) {
            _parentSubscriber.syncErrorValue = err;
            _parentSubscriber.syncErrorThrown = true;
          } else {
            hostReportError(err);
          }

          this.unsubscribe();
        }
      }
    };

    SafeSubscriber.prototype.complete = function () {
      var _this = this;

      if (!this.isStopped) {
        var _parentSubscriber = this._parentSubscriber;

        if (this._complete) {
          var wrappedComplete = function wrappedComplete() {
            return _this._complete.call(_this._context);
          };

          if (
            !config.useDeprecatedSynchronousErrorHandling ||
            !_parentSubscriber.syncErrorThrowable
          ) {
            this.__tryOrUnsub(wrappedComplete);

            this.unsubscribe();
          } else {
            this.__tryOrSetError(_parentSubscriber, wrappedComplete);

            this.unsubscribe();
          }
        } else {
          this.unsubscribe();
        }
      }
    };

    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
      try {
        fn.call(this._context, value);
      } catch (err) {
        this.unsubscribe();

        if (config.useDeprecatedSynchronousErrorHandling) {
          throw err;
        } else {
          hostReportError(err);
        }
      }
    };

    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
      if (!config.useDeprecatedSynchronousErrorHandling) {
        throw new Error("bad call");
      }

      try {
        fn.call(this._context, value);
      } catch (err) {
        if (config.useDeprecatedSynchronousErrorHandling) {
          parent.syncErrorValue = err;
          parent.syncErrorThrown = true;
          return true;
        } else {
          hostReportError(err);
          return true;
        }
      }

      return false;
    };

    SafeSubscriber.prototype._unsubscribe = function () {
      var _parentSubscriber = this._parentSubscriber;
      this._context = null;
      this._parentSubscriber = null;

      _parentSubscriber.unsubscribe();
    };

    return SafeSubscriber;
  })(Subscriber);
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  function noop() {}
  /** PURE_IMPORTS_START tslib,_Subscriber,_util_noop,_util_isFunction PURE_IMPORTS_END */

  function tap(nextOrObserver, error, complete) {
    return function tapOperatorFunction(source) {
      return source.lift(new DoOperator(nextOrObserver, error, complete));
    };
  }

  var DoOperator = /*@__PURE__*/ (function () {
    function DoOperator(nextOrObserver, error, complete) {
      this.nextOrObserver = nextOrObserver;
      this.error = error;
      this.complete = complete;
    }

    DoOperator.prototype.call = function (subscriber, source) {
      return source.subscribe(
        new TapSubscriber(
          subscriber,
          this.nextOrObserver,
          this.error,
          this.complete
        )
      );
    };

    return DoOperator;
  })();

  var TapSubscriber = /*@__PURE__*/ (function (_super) {
    __extends$1(TapSubscriber, _super);

    function TapSubscriber(destination, observerOrNext, error, complete) {
      var _this = _super.call(this, destination) || this;

      _this._tapNext = noop;
      _this._tapError = noop;
      _this._tapComplete = noop;
      _this._tapError = error || noop;
      _this._tapComplete = complete || noop;

      if (isFunction$1(observerOrNext)) {
        _this._context = _this;
        _this._tapNext = observerOrNext;
      } else if (observerOrNext) {
        _this._context = observerOrNext;
        _this._tapNext = observerOrNext.next || noop;
        _this._tapError = observerOrNext.error || noop;
        _this._tapComplete = observerOrNext.complete || noop;
      }

      return _this;
    }

    TapSubscriber.prototype._next = function (value) {
      try {
        this._tapNext.call(this._context, value);
      } catch (err) {
        this.destination.error(err);
        return;
      }

      this.destination.next(value);
    };

    TapSubscriber.prototype._error = function (err) {
      try {
        this._tapError.call(this._context, err);
      } catch (err) {
        this.destination.error(err);
        return;
      }

      this.destination.error(err);
    };

    TapSubscriber.prototype._complete = function () {
      try {
        this._tapComplete.call(this._context);
      } catch (err) {
        this.destination.error(err);
        return;
      }

      return this.destination.complete();
    };

    return TapSubscriber;
  })(Subscriber);

  var getProxy = function getProxy(_a) {
    var serviceCall = _a.serviceCall,
      serviceDefinition = _a.serviceDefinition; // workaround to support old browsers

    var obj = {};
    Object.keys(serviceDefinition.methods).forEach(function (key) {
      return (obj[key] = function () {
        throw Error(NO_PROXY_SUPPORT);
      });
    });
    return new Proxy(obj, {
      get: preServiceCall({
        serviceDefinition: serviceDefinition,
        serviceCall: serviceCall,
      }),
    });
  };

  var preServiceCall = function preServiceCall(_a) {
    var serviceCall = _a.serviceCall,
      serviceDefinition = _a.serviceDefinition;
    return function (target, prop) {
      if (!serviceDefinition.methods[prop]) {
        throw new Error(getServiceMethodIsMissingError(prop));
      }

      var asyncModel = serviceDefinition.methods[prop].asyncModel;
      return function () {
        var data = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          data[_i] = arguments[_i];
        }

        var message = {
          qualifier: getQualifier({
            serviceName: serviceDefinition.serviceName,
            methodName: prop,
          }),
          data: data,
        };
        return serviceCall({
          message: message,
          asyncModel: asyncModel,
        });
      };
    };
  };

  var _createProxy = function createProxy(proxyOptions) {
    var router = proxyOptions.router,
      serviceDefinition = proxyOptions.serviceDefinition,
      microserviceContext = proxyOptions.microserviceContext,
      transportClient = proxyOptions.transportClient;

    if (!microserviceContext) {
      throw new Error(MICROSERVICE_NOT_EXISTS);
    }

    validateServiceDefinition(serviceDefinition);
    return getProxy({
      serviceCall: getServiceCall({
        router: router,
        microserviceContext: microserviceContext,
        transportClient: transportClient,
      }),
      serviceDefinition: serviceDefinition,
    });
  };

  var _destroy = function destroy(options) {
    var discovery = options.discovery,
      serverStop = options.serverStop,
      transportClientDestroy = options.transportClientDestroy;
    var microserviceContext = options.microserviceContext;

    if (!microserviceContext) {
      throw new Error(MICROSERVICE_NOT_EXISTS);
    }

    var logger = loggerUtil(
      microserviceContext.whoAmI,
      microserviceContext.debug
    );
    return new Promise(function (resolve, reject) {
      if (microserviceContext) {
        var localRegistry = microserviceContext.localRegistry,
          remoteRegistry = microserviceContext.remoteRegistry;
        localRegistry.destroy();
        remoteRegistry.destroy();
        transportClientDestroy({
          address: microserviceContext.whoAmI,
          logger: logger,
        });
      }

      serverStop && serverStop();
      discovery &&
        discovery.destroy().then(function () {
          resolve("");
          microserviceContext = null;
        });
    });
  };

  var setMicroserviceInstance = function setMicroserviceInstance(options) {
    var transportClient = options.transportClient,
      serverStop = options.serverStop,
      discoveryInstance = options.discoveryInstance,
      debug = options.debug,
      defaultRouter = options.defaultRouter,
      microserviceContext = options.microserviceContext;
    var remoteRegistry = microserviceContext.remoteRegistry;
    discoveryInstance &&
      discoveryInstance
        .discoveredItems$()
        .pipe(printLogs(microserviceContext.whoAmI, debug))
        .subscribe(remoteRegistry.update);
    var serviceFactoryOptions = getServiceFactoryOptions({
      microserviceContext: microserviceContext,
      transportClient: transportClient,
      defaultRouter: defaultRouter,
    });
    return Object.freeze(
      _assign$1(
        {
          destroy: function destroy() {
            return _destroy({
              microserviceContext: microserviceContext,
              discovery: discoveryInstance,
              serverStop: serverStop,
              transportClientDestroy: transportClient.destroy,
            });
          },
        },
        serviceFactoryOptions
      )
    );
  };

  var getServiceFactoryOptions = function getServiceFactoryOptions(_a) {
    var microserviceContext = _a.microserviceContext,
      transportClient = _a.transportClient,
      defaultRouter = _a.defaultRouter;
    return {
      createProxy: function createProxy(_a) {
        var serviceDefinition = _a.serviceDefinition,
          _b = _a.router,
          router = _b === void 0 ? defaultRouter : _b;
        return _createProxy({
          serviceDefinition: serviceDefinition,
          router: router,
          microserviceContext: microserviceContext,
          transportClient: transportClient,
        });
      },
      createServiceCall: function createServiceCall(_a) {
        var _b = _a.router,
          router = _b === void 0 ? defaultRouter : _b;
        return _createServiceCall({
          router: router,
          microserviceContext: microserviceContext,
          transportClient: transportClient,
        });
      },
    };
  };

  var printLogs = function printLogs(whoAmI, debug) {
    return tap(function (_a) {
      var _b;

      var type = _a.type,
        items = _a.items;
      return (
        type !== "IDLE" &&
        saveToLogs(
          whoAmI,
          "microservice received an updated",
          ((_b = {}),
          (_b[type] = items.map(function (item) {
            return item.qualifier;
          })),
          _b),
          debug
        )
      );
    });
  };

  var createMicroservice = function createMicroservice(options) {
    var microserviceOptions = _assign$1(
      {
        defaultRouter: function defaultRouter() {
          throw new Error(ROUTER_NOT_PROVIDED);
        },
        services: [],
        debug: false,
        transport: {
          clientTransport: {
            start: function start() {
              throw new Error("client transport not provided");
            },
          },
          serverTransport: function serverTransport() {
            throw new Error("server transport not provided");
          },
        },
      },
      options
    );

    if (isString(microserviceOptions.address)) {
      microserviceOptions = _assign$1(_assign$1({}, microserviceOptions), {
        address: getAddress(microserviceOptions.address),
      });
    }

    microserviceOptions = _assign$1(_assign$1({}, microserviceOptions), {
      seedAddress: !!microserviceOptions.seedAddress
        ? multiSeedSupport(microserviceOptions.seedAddress)
        : microserviceOptions.seedAddress,
    });
    validateMicroserviceOptions(microserviceOptions);
    var cluster = microserviceOptions.cluster,
      debug = microserviceOptions.debug;
    var transport = microserviceOptions.transport;
    var address = microserviceOptions.address;
    var seedAddress = microserviceOptions.seedAddress;
    var transportClient = transport.clientTransport;
    var fallBackAddress = address || getAddress(Date.now().toString()); // tslint:disable-next-line

    var microserviceContext = createMicroserviceContext({
      address: fallBackAddress,
      debug: debug || false,
    });
    var remoteRegistry = microserviceContext.remoteRegistry,
      localRegistry = microserviceContext.localRegistry;
    var serviceFactoryOptions = getServiceFactoryOptions({
      microserviceContext: microserviceContext,
      transportClient: transportClient,
      defaultRouter: microserviceOptions.defaultRouter,
    });
    var services = microserviceOptions
      ? flatteningServices({
          services: microserviceOptions.services,
          serviceFactoryOptions: serviceFactoryOptions,
        })
      : [];
    localRegistry.add({
      services: services,
      address: address,
    }); // if address is not available then microservice can't share services

    var endPointsToPublishInCluster = address
      ? remoteRegistry.createEndPoints({
          services: services,
          address: address,
        }) || []
      : [];
    var discoveryInstance = createDiscovery({
      address: fallBackAddress,
      itemsToPublish: endPointsToPublishInCluster,
      seedAddress: seedAddress,
      cluster: cluster,
      debug: debug,
    });
    discoveryInstance && validateDiscoveryInstance(discoveryInstance); // if address is not available then microservice can't start a server and get serviceCall requests

    var serverStop =
      address && transport
        ? transport.serverTransport({
            logger: loggerUtil(
              microserviceContext.whoAmI,
              microserviceContext.debug
            ),
            localAddress: address,
            serviceCall: _createServiceCall({
              router: microserviceOptions.defaultRouter,
              microserviceContext: microserviceContext,
              transportClient: transportClient,
            }),
          })
        : function () {};
    return setMicroserviceInstance({
      microserviceContext: microserviceContext,
      transportClient: transportClient,
      discoveryInstance: discoveryInstance,
      serverStop: serverStop,
      debug: debug,
      defaultRouter: microserviceOptions.defaultRouter,
    });
  };

  var createMicroserviceContext = function createMicroserviceContext(_a) {
    var address = _a.address,
      debug = _a.debug;
    var remoteRegistry = createRemoteRegistry();
    var localRegistry = createLocalRegistry();
    return {
      remoteRegistry: remoteRegistry,
      localRegistry: localRegistry,
      debug: debug,
      whoAmI: getFullAddress(address),
    };
  };

  var multiSeedSupport = function multiSeedSupport(seedAddress) {
    var seeds = [];

    if (!isArray(seedAddress)) {
      seeds = isString(seedAddress) ? [getAddress(seedAddress)] : [seedAddress];
    } else {
      seeds = seedAddress.map(function (val) {
        return isString(val) ? getAddress(val) : val;
      });
    }

    return seeds;
  };

  var __assign = function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }

        return t;
      };

    return __assign.apply(this, arguments);
  };
  /*
   * Subject for poor
   */

  var Subject =
    /** @class */
    (function () {
      function Subject() {
        this.values = {};
        this.subscribers = [];
      }

      Subject.prototype.next = function (value) {
        this.values = __assign({}, value);
        this.notify();
      };

      Subject.prototype.subscribe = function (fn) {
        var _this = this;

        this.subscribers.push(fn);
        fn(__assign({}, this.values));
        return function () {
          _this.subscribers = _this.subscribers.filter(function (s) {
            return s !== fn;
          });
        };
      };

      Subject.prototype.notify = function () {
        for (var _i = 0, _a = this.subscribers; _i < _a.length; _i++) {
          var sub = _a[_i];
          sub(__assign({}, this.values));
        }
      };

      return Subject;
    })();

  function join(s1, s2) {
    return {
      subscribe: function subscribe(fn) {
        var s = new Subject();
        var uns1 = s1.subscribe(function (i) {
          return s.next(i);
        });
        var uns2 = s2.subscribe(function (i) {
          return s.next(i);
        });
        var uns = s.subscribe(fn);
        return function () {
          uns1();
          uns2();
          uns();
        };
      },
    };
  }

  function eachDelta(sbj) {
    return {
      subscribe: function subscribe(fn) {
        var oldState = {};

        var notify = function notify(s) {
          return fn(s);
        };

        return sbj.subscribe(function (state) {
          for (var key in state) {
            if (!oldState[key] || oldState[key] !== state[key]) {
              notify({
                key: key,
                value: state[key],
              });
            }
          }

          for (var key in oldState) {
            if (!state[key]) {
              notify({
                key: key,
                value: undefined,
              });
            }
          }

          oldState = state;
        });
      },
    };
  }

  function map(mapFn, sbj) {
    return {
      subscribe: function subscribe(fn) {
        return sbj.subscribe(function (val) {
          fn(mapFn(val));
        });
      },
    };
  }

  var __assign$1 = function () {
    __assign$1 =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }

        return t;
      };

    return __assign$1.apply(this, arguments);
  };
  /**
   * @class Node
   * Node represents current Node and holds all "peers" (channel to other Nodes)
   */

  var Node =
    /** @class */
    (function () {
      function Node() {
        /**
         * @property id
         * Node id
         */
        this.id =
          Math.random().toString() +
          "-" +
          Math.random().toString() +
          "-" +
          Math.random().toString() +
          "-" +
          Math.random().toString();
        this.peers = {};
        this.peers$ = new Subject();
        /**
         * Peer removal right now is not needed
         * Right now we create Node for every process
         * There isn't any use case we are doing that the process will be remove
         * At the moment it won't clear up the memory
         *
         * @method remove
         * Remove peer from node
         *
         * @param id
         */
        // public remove(id: string) {
        //   delete this.peers[id];
        //   this.peers$.next(this.peers);
        // }
      }
      /**
       * @method Subscribe
       * Notify each time new peer register in node
       * It's also send all peers joined before subscription started
       * @param fn notification handler
       */

      Node.prototype.subscribe = function (fn) {
        // Peers act like unique reply subject
        return map(function (o) {
          return {
            id: o.key,
            port: o.value,
          };
        }, eachDelta(this.peers$)).subscribe(fn);
      };
      /**
       * @Method get
       * Get all peers
       */

      Node.prototype.get = function () {
        return __assign$1({}, this.peers);
      };
      /**
       * @method add
       * Add new new peer to node
       *
       * @param id
       * @param port
       */

      Node.prototype.add = function (id, port) {
        this.peers[id] = port;
        this.peers$.next(this.peers);
      };

      return Node;
    })();

  var EVENT = {
    addChannel: "addChannel",
    channelInit: "channelInit",
    registerAddress: "registerAddress",
    unregisterAddress: "unregisterAddress",
    connect: "connect",
    incomingServerConnection: "incomingServerConnection",
    incomingClientConnection: "incomingClientConnection",
  };

  var __assign$2 = function () {
    __assign$2 =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }

        return t;
      };

    return __assign$2.apply(this, arguments);
  };

  function createConnectionServer() {
    var peer = new Node();
    var addresses = {};
    var address$ = new Subject(); // tslint:disable-next-line:no-console

    var debug = function debug() {};

    function handleUnRegisterAddress(e) {
      if (
        e.data.type === EVENT.unregisterAddress &&
        e.data.address &&
        e.data.peerId
      ) {
        debug("unregister address", e.data.address);
        delete addresses[e.data.address];
        return true;
      }

      return false;
    }

    function handleRegisterAddress(e) {
      if (
        e.data.type === EVENT.registerAddress &&
        e.data.address &&
        e.data.peerId
      ) {
        debug("register address", e.data.address);
        addresses[e.data.address] = e.data.peerId;
        address$.next({
          address: e.data.address,
          peerId: e.data.peerId,
        });
        return true;
      }

      return false;
    }

    function handleConnect(e) {
      if (
        e.data.type === EVENT.connect &&
        e.data.sourceNodeId &&
        e.data.remoteAddress
      ) {
        join(address$, peer).subscribe(function () {
          var peers = peer.get();

          if (peers[e.data.sourceNodeId] && addresses[e.data.remoteAddress]) {
            debug(EVENT.connect, e.data.remoteAddress, e.data.sourceNodeId);
            var ch = new MessageChannel();
            var ev = {
              remoteAddress: e.data.remoteAddress,
              connectionId: e.data.connectionId,
              sourceNodeId: e.data.sourceNodeId,
            };
            peers[e.data.sourceNodeId].postMessage(
              __assign$2(__assign$2({}, ev), {
                type: EVENT.incomingClientConnection,
              }),
              [ch.port2]
            );
            peers[addresses[e.data.remoteAddress]].postMessage(
              __assign$2(__assign$2({}, ev), {
                type: EVENT.incomingServerConnection,
              }),
              [ch.port1]
            );
          }
        });
        return true;
      }

      return false;
    }

    function eventHandler(e) {
      if (e && e.data) {
        handleConnect(e) ||
          handleRegisterAddress(e) ||
          handleUnRegisterAddress(e);
      }
    }

    var unsubscribe = peer.subscribe(function (_a) {
      var port = _a.port;
      port.addEventListener("message", eventHandler);
    });
    return {
      /**
       * @method channelHandler
       * Handle incoming channels
       *
       * @param e event
       */
      channelHandler: function channelHandler(e) {
        if (e.data.type === EVENT.addChannel) {
          peer.add(e.data.nodeId, e.ports[0]);
          e.ports[0].start();
          e.ports[0].postMessage({
            type: EVENT.channelInit,
            nodeId: e.data.nodeId,
          });
        }
      },
      shutdown: function shutdown() {
        unsubscribe();
        var peers = peer.get();

        for (var id in peers) {
          peers[id].removeEventListener("message", eventHandler);
        }
      },
    };
  }

  var __assign$3 = function () {
    __assign$3 =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }

        return t;
      };

    return __assign$3.apply(this, arguments);
  };

  function createConnectionClient() {
    var peer = new Node();
    var listeners = {}; // tslint:disable-next-line:no-console

    var debug = function debug() {};

    peer.subscribe(function (_a) {
      var port = _a.port;
      port.addEventListener("message", function (e) {
        if (e && e.data) {
          if (
            e.data.type === EVENT.incomingServerConnection &&
            e.data.remoteAddress &&
            listeners[e.data.remoteAddress] &&
            e.ports[0]
          ) {
            var l_1 = function l_1(msg) {
              debug("invoke", e.data.remoteAddress);
              listeners[e.data.remoteAddress](msg, e.ports[0]);
            };

            e.ports[0].addEventListener("message", l_1);

            var clean = function clean() {
              e.ports[0].removeEventListener("message", l_1);
              e.ports[0].close();
            };

            if (Array.isArray(listeners[e.data.remoteAddress].cleanFns)) {
              // @ts-ignore
              listeners[e.data.remoteAddress].cleanFns.push(clean);
            }

            e.ports[0].start();
          }
        }
      });
    });
    return {
      createChannel: function createChannel(pm, timeout) {
        if (timeout === void 0) {
          timeout = 5000;
        }

        var endTime = Date.now() + timeout;
        return new Promise(function (resolve, reject) {
          var tryCreate = function tryCreate() {
            var ch = new MessageChannel();
            var to = setTimeout(function () {
              ch.port1.close();
              ch.port2.close();

              if (Date.now() < endTime) {
                tryCreate();
              } else {
                reject();
              }
            }, 100);
            pm(
              {
                type: EVENT.addChannel,
                nodeId: peer.id,
              },
              [ch.port1]
            );
            ch.port2.addEventListener("message", function (e) {
              if (e.data.type === EVENT.channelInit) {
                peer.add(e.data.nodeId, ch.port2);
                clearTimeout(to);
                resolve();
              }
            });
            ch.port2.start();
          };

          tryCreate();
        });
      },
      listen: function listen(addr, fn) {
        listeners[addr] = fn;
        listeners[addr].cleanFns = [];
        var sub = peer.subscribe(function (_a) {
          var port = _a.port;
          port.postMessage({
            type: EVENT.registerAddress,
            peerId: peer.id,
            address: addr,
          });
        });
        return function () {
          sub();

          for (
            var _i = 0, _a = listeners[addr].cleanFns || [];
            _i < _a.length;
            _i++
          ) {
            var clean = _a[_i];
            clean();
          }

          delete listeners[addr];
          var peers = peer.get();

          for (var p in peers) {
            peers[p].postMessage({
              type: EVENT.unregisterAddress,
              peerId: peer.id,
              address: addr,
            });
          }
        };
      },
      connect: function connect(addr, to) {
        if (to === void 0) {
          to = 5000;
        }

        return new Promise(function (resolve, reject) {
          var conn = {
            remoteAddress: addr,
            sourceNodeId: peer.id,
            connectionId: Date.now() + "-" + Math.random(),
          };

          var clearEvents = function clearEvents() {
            var peers = peer.get();

            for (var key in peers) {
              peers[key].removeEventListener("message", incomingConn);
            }
          };

          var timeout = setTimeout(function () {
            unsubscribe();
            clearEvents();
            reject("connection timeout");
          }, to);

          var incomingConn = function incomingConn(e) {
            if (
              e &&
              e.data &&
              e.data.connectionId === conn.connectionId &&
              e.ports[0]
            ) {
              clearEvents();
              clearTimeout(timeout);
              e.ports[0].start();
              resolve(e.ports[0]);
            }
          };

          var unsubscribe = peer.subscribe(function (_a) {
            var id = _a.id,
              port = _a.port;
            port.addEventListener("message", incomingConn);
            port.postMessage(
              __assign$3(__assign$3({}, conn), {
                type: EVENT.connect,
              }),
              []
            );
          });
        });
      },
    };
  }

  function bootstrap(window, worker) {
    var server = createConnectionServer();
    var client = createConnectionClient(); // @ts-ignore

    if (typeof Worker !== "undefined") {
      var W_1 = Worker; // @ts-ignore
      // tslint:disable-next-line:only-arrow-functions

      Worker = function Worker(url, options) {
        if (options === void 0) {
          options = {};
        }

        var w = new W_1(url, options);
        w.addEventListener("message", server.channelHandler);
        return w;
      };
    } // worker

    if (typeof worker !== "undefined") {
      var localChannel = new MessageChannel();
      localChannel.port1.start();
      localChannel.port2.start();
      worker.addEventListener("message", server.channelHandler);
      localChannel.port2.addEventListener("message", server.channelHandler);
      client
        .createChannel(localChannel.port1.postMessage.bind(localChannel.port1))
        ["catch"](function () {});
      client
        .createChannel(worker.postMessage.bind(worker))
        ["catch"](function () {}); // iframe
    } else if (window && window.top && window.top !== window.self) {
      client
        .createChannel(function (msg, port) {
          return window.postMessage.bind(window)(msg, "*", port);
        })
        ["catch"](function () {});
      client
        .createChannel(function (msg, port) {
          return window.top.postMessage.bind(window.top)(msg, "*", port);
        })
        ["catch"](function () {});
      window.addEventListener("message", server.channelHandler);
    } // main
    else {
      client
        .createChannel(function (msg, port) {
          return window.postMessage(msg, "*", port);
        })
        ["catch"](function () {});
      window.addEventListener("message", server.channelHandler);
    }

    return client;
  }

  var win;
  var worker; // @ts-ignore

  if (typeof window !== "undefined") {
    // @ts-ignore
    win = window;
  } // @ts-ignore

  if (typeof WorkerGlobalScope !== "undefined") {
    // @ts-ignore
    worker = self;
  }

  var client = bootstrap(win, worker);
  var connect = client.connect;
  var listen = client.listen;
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  function isFunction$2(x) {
    return typeof x === "function";
  }
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  var _enable_super_gross_mode_that_will_cause_bad_things$1 = false;
  var config$1 = {
    Promise: undefined,

    set useDeprecatedSynchronousErrorHandling(value) {
      if (value) {
        var error = /*@__PURE__*/ new Error();
        /*@__PURE__*/

        console.warn(
          "DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n" +
            error.stack
        );
      }

      _enable_super_gross_mode_that_will_cause_bad_things$1 = value;
    },

    get useDeprecatedSynchronousErrorHandling() {
      return _enable_super_gross_mode_that_will_cause_bad_things$1;
    },
  };
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  function hostReportError$1(err) {
    setTimeout(function () {
      throw err;
    }, 0);
  }
  /** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */

  var empty$1 = {
    closed: true,
    next: function next(value) {},
    error: function error(err) {
      if (config$1.useDeprecatedSynchronousErrorHandling) {
        throw err;
      } else {
        hostReportError$1(err);
      }
    },
    complete: function complete() {},
  };
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  var isArray$2 = /*@__PURE__*/ (function () {
    return (
      Array.isArray ||
      function (x) {
        return x && typeof x.length === "number";
      }
    );
  })();
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  function isObject$2(x) {
    return x !== null && _typeof_1(x) === "object";
  }
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  var UnsubscriptionErrorImpl$1 = /*@__PURE__*/ (function () {
    function UnsubscriptionErrorImpl(errors) {
      Error.call(this);
      this.message = errors
        ? errors.length +
          " errors occurred during unsubscription:\n" +
          errors
            .map(function (err, i) {
              return i + 1 + ") " + err.toString();
            })
            .join("\n  ")
        : "";
      this.name = "UnsubscriptionError";
      this.errors = errors;
      return this;
    }

    UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(
      Error.prototype
    );
    return UnsubscriptionErrorImpl;
  })();

  var UnsubscriptionError$1 = UnsubscriptionErrorImpl$1;

  var Subscription$1 = /*@__PURE__*/ (function () {
    function Subscription(unsubscribe) {
      this.closed = false;
      this._parentOrParents = null;
      this._subscriptions = null;

      if (unsubscribe) {
        this._unsubscribe = unsubscribe;
      }
    }

    Subscription.prototype.unsubscribe = function () {
      var errors;

      if (this.closed) {
        return;
      }

      var _a = this,
        _parentOrParents = _a._parentOrParents,
        _unsubscribe = _a._unsubscribe,
        _subscriptions = _a._subscriptions;

      this.closed = true;
      this._parentOrParents = null;
      this._subscriptions = null;

      if (_parentOrParents instanceof Subscription) {
        _parentOrParents.remove(this);
      } else if (_parentOrParents !== null) {
        for (var index = 0; index < _parentOrParents.length; ++index) {
          var parent_1 = _parentOrParents[index];
          parent_1.remove(this);
        }
      }

      if (isFunction$2(_unsubscribe)) {
        try {
          _unsubscribe.call(this);
        } catch (e) {
          errors =
            e instanceof UnsubscriptionError$1
              ? flattenUnsubscriptionErrors$1(e.errors)
              : [e];
        }
      }

      if (isArray$2(_subscriptions)) {
        var index = -1;
        var len = _subscriptions.length;

        while (++index < len) {
          var sub = _subscriptions[index];

          if (isObject$2(sub)) {
            try {
              sub.unsubscribe();
            } catch (e) {
              errors = errors || [];

              if (e instanceof UnsubscriptionError$1) {
                errors = errors.concat(flattenUnsubscriptionErrors$1(e.errors));
              } else {
                errors.push(e);
              }
            }
          }
        }
      }

      if (errors) {
        throw new UnsubscriptionError$1(errors);
      }
    };

    Subscription.prototype.add = function (teardown) {
      var subscription = teardown;

      if (!teardown) {
        return Subscription.EMPTY;
      }

      switch (_typeof_1(teardown)) {
        case "function":
          subscription = new Subscription(teardown);

        case "object":
          if (
            subscription === this ||
            subscription.closed ||
            typeof subscription.unsubscribe !== "function"
          ) {
            return subscription;
          } else if (this.closed) {
            subscription.unsubscribe();
            return subscription;
          } else if (!(subscription instanceof Subscription)) {
            var tmp = subscription;
            subscription = new Subscription();
            subscription._subscriptions = [tmp];
          }

          break;

        default: {
          throw new Error(
            "unrecognized teardown " + teardown + " added to Subscription."
          );
        }
      }

      var _parentOrParents = subscription._parentOrParents;

      if (_parentOrParents === null) {
        subscription._parentOrParents = this;
      } else if (_parentOrParents instanceof Subscription) {
        if (_parentOrParents === this) {
          return subscription;
        }

        subscription._parentOrParents = [_parentOrParents, this];
      } else if (_parentOrParents.indexOf(this) === -1) {
        _parentOrParents.push(this);
      } else {
        return subscription;
      }

      var subscriptions = this._subscriptions;

      if (subscriptions === null) {
        this._subscriptions = [subscription];
      } else {
        subscriptions.push(subscription);
      }

      return subscription;
    };

    Subscription.prototype.remove = function (subscription) {
      var subscriptions = this._subscriptions;

      if (subscriptions) {
        var subscriptionIndex = subscriptions.indexOf(subscription);

        if (subscriptionIndex !== -1) {
          subscriptions.splice(subscriptionIndex, 1);
        }
      }
    };

    Subscription.EMPTY = (function (empty) {
      empty.closed = true;
      return empty;
    })(new Subscription());

    return Subscription;
  })();

  function flattenUnsubscriptionErrors$1(errors) {
    return errors.reduce(function (errs, err) {
      return errs.concat(
        err instanceof UnsubscriptionError$1 ? err.errors : err
      );
    }, []);
  }
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  var rxSubscriber$1 = /*@__PURE__*/ (function () {
    return typeof Symbol === "function"
      ? /*@__PURE__*/ Symbol("rxSubscriber")
      : "@@rxSubscriber_" + /*@__PURE__*/ Math.random();
  })();

  var Subscriber$1 = /*@__PURE__*/ (function (_super) {
    __extends(Subscriber, _super);

    function Subscriber(destinationOrNext, error, complete) {
      var _this = _super.call(this) || this;

      _this.syncErrorValue = null;
      _this.syncErrorThrown = false;
      _this.syncErrorThrowable = false;
      _this.isStopped = false;

      switch (arguments.length) {
        case 0:
          _this.destination = empty$1;
          break;

        case 1:
          if (!destinationOrNext) {
            _this.destination = empty$1;
            break;
          }

          if (_typeof_1(destinationOrNext) === "object") {
            if (destinationOrNext instanceof Subscriber) {
              _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
              _this.destination = destinationOrNext;
              destinationOrNext.add(_this);
            } else {
              _this.syncErrorThrowable = true;
              _this.destination = new SafeSubscriber$1(
                _this,
                destinationOrNext
              );
            }

            break;
          }

        default:
          _this.syncErrorThrowable = true;
          _this.destination = new SafeSubscriber$1(
            _this,
            destinationOrNext,
            error,
            complete
          );
          break;
      }

      return _this;
    }

    Subscriber.prototype[rxSubscriber$1] = function () {
      return this;
    };

    Subscriber.create = function (next, error, complete) {
      var subscriber = new Subscriber(next, error, complete);
      subscriber.syncErrorThrowable = false;
      return subscriber;
    };

    Subscriber.prototype.next = function (value) {
      if (!this.isStopped) {
        this._next(value);
      }
    };

    Subscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        this.isStopped = true;

        this._error(err);
      }
    };

    Subscriber.prototype.complete = function () {
      if (!this.isStopped) {
        this.isStopped = true;

        this._complete();
      }
    };

    Subscriber.prototype.unsubscribe = function () {
      if (this.closed) {
        return;
      }

      this.isStopped = true;

      _super.prototype.unsubscribe.call(this);
    };

    Subscriber.prototype._next = function (value) {
      this.destination.next(value);
    };

    Subscriber.prototype._error = function (err) {
      this.destination.error(err);
      this.unsubscribe();
    };

    Subscriber.prototype._complete = function () {
      this.destination.complete();
      this.unsubscribe();
    };

    Subscriber.prototype._unsubscribeAndRecycle = function () {
      var _parentOrParents = this._parentOrParents;
      this._parentOrParents = null;
      this.unsubscribe();
      this.closed = false;
      this.isStopped = false;
      this._parentOrParents = _parentOrParents;
      return this;
    };

    return Subscriber;
  })(Subscription$1);

  var SafeSubscriber$1 = /*@__PURE__*/ (function (_super) {
    __extends(SafeSubscriber, _super);

    function SafeSubscriber(
      _parentSubscriber,
      observerOrNext,
      error,
      complete
    ) {
      var _this = _super.call(this) || this;

      _this._parentSubscriber = _parentSubscriber;
      var next;
      var context = _this;

      if (isFunction$2(observerOrNext)) {
        next = observerOrNext;
      } else if (observerOrNext) {
        next = observerOrNext.next;
        error = observerOrNext.error;
        complete = observerOrNext.complete;

        if (observerOrNext !== empty$1) {
          context = Object.create(observerOrNext);

          if (isFunction$2(context.unsubscribe)) {
            _this.add(context.unsubscribe.bind(context));
          }

          context.unsubscribe = _this.unsubscribe.bind(_this);
        }
      }

      _this._context = context;
      _this._next = next;
      _this._error = error;
      _this._complete = complete;
      return _this;
    }

    SafeSubscriber.prototype.next = function (value) {
      if (!this.isStopped && this._next) {
        var _parentSubscriber = this._parentSubscriber;

        if (
          !config$1.useDeprecatedSynchronousErrorHandling ||
          !_parentSubscriber.syncErrorThrowable
        ) {
          this.__tryOrUnsub(this._next, value);
        } else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
          this.unsubscribe();
        }
      }
    };

    SafeSubscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        var _parentSubscriber = this._parentSubscriber;
        var useDeprecatedSynchronousErrorHandling =
          config$1.useDeprecatedSynchronousErrorHandling;

        if (this._error) {
          if (
            !useDeprecatedSynchronousErrorHandling ||
            !_parentSubscriber.syncErrorThrowable
          ) {
            this.__tryOrUnsub(this._error, err);

            this.unsubscribe();
          } else {
            this.__tryOrSetError(_parentSubscriber, this._error, err);

            this.unsubscribe();
          }
        } else if (!_parentSubscriber.syncErrorThrowable) {
          this.unsubscribe();

          if (useDeprecatedSynchronousErrorHandling) {
            throw err;
          }

          hostReportError$1(err);
        } else {
          if (useDeprecatedSynchronousErrorHandling) {
            _parentSubscriber.syncErrorValue = err;
            _parentSubscriber.syncErrorThrown = true;
          } else {
            hostReportError$1(err);
          }

          this.unsubscribe();
        }
      }
    };

    SafeSubscriber.prototype.complete = function () {
      var _this = this;

      if (!this.isStopped) {
        var _parentSubscriber = this._parentSubscriber;

        if (this._complete) {
          var wrappedComplete = function wrappedComplete() {
            return _this._complete.call(_this._context);
          };

          if (
            !config$1.useDeprecatedSynchronousErrorHandling ||
            !_parentSubscriber.syncErrorThrowable
          ) {
            this.__tryOrUnsub(wrappedComplete);

            this.unsubscribe();
          } else {
            this.__tryOrSetError(_parentSubscriber, wrappedComplete);

            this.unsubscribe();
          }
        } else {
          this.unsubscribe();
        }
      }
    };

    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
      try {
        fn.call(this._context, value);
      } catch (err) {
        this.unsubscribe();

        if (config$1.useDeprecatedSynchronousErrorHandling) {
          throw err;
        } else {
          hostReportError$1(err);
        }
      }
    };

    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
      if (!config$1.useDeprecatedSynchronousErrorHandling) {
        throw new Error("bad call");
      }

      try {
        fn.call(this._context, value);
      } catch (err) {
        if (config$1.useDeprecatedSynchronousErrorHandling) {
          parent.syncErrorValue = err;
          parent.syncErrorThrown = true;
          return true;
        } else {
          hostReportError$1(err);
          return true;
        }
      }

      return false;
    };

    SafeSubscriber.prototype._unsubscribe = function () {
      var _parentSubscriber = this._parentSubscriber;
      this._context = null;
      this._parentSubscriber = null;

      _parentSubscriber.unsubscribe();
    };

    return SafeSubscriber;
  })(Subscriber$1);
  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

  var OuterSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(OuterSubscriber, _super);

    function OuterSubscriber() {
      return (_super !== null && _super.apply(this, arguments)) || this;
    }

    OuterSubscriber.prototype.notifyNext = function (
      outerValue,
      innerValue,
      outerIndex,
      innerIndex,
      innerSub
    ) {
      this.destination.next(innerValue);
    };

    OuterSubscriber.prototype.notifyError = function (error, innerSub) {
      this.destination.error(error);
    };

    OuterSubscriber.prototype.notifyComplete = function (innerSub) {
      this.destination.complete();
    };

    return OuterSubscriber;
  })(Subscriber$1);
  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

  var InnerSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(InnerSubscriber, _super);

    function InnerSubscriber(parent, outerValue, outerIndex) {
      var _this = _super.call(this) || this;

      _this.parent = parent;
      _this.outerValue = outerValue;
      _this.outerIndex = outerIndex;
      _this.index = 0;
      return _this;
    }

    InnerSubscriber.prototype._next = function (value) {
      this.parent.notifyNext(
        this.outerValue,
        value,
        this.outerIndex,
        this.index++,
        this
      );
    };

    InnerSubscriber.prototype._error = function (error) {
      this.parent.notifyError(error, this);
      this.unsubscribe();
    };

    InnerSubscriber.prototype._complete = function () {
      this.parent.notifyComplete(this);
      this.unsubscribe();
    };

    return InnerSubscriber;
  })(Subscriber$1);
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  var subscribeToArray = function subscribeToArray(array) {
    return function (subscriber) {
      for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
        subscriber.next(array[i]);
      }

      subscriber.complete();
    };
  };
  /** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */

  var subscribeToPromise = function subscribeToPromise(promise) {
    return function (subscriber) {
      promise
        .then(
          function (value) {
            if (!subscriber.closed) {
              subscriber.next(value);
              subscriber.complete();
            }
          },
          function (err) {
            return subscriber.error(err);
          }
        )
        .then(null, hostReportError$1);
      return subscriber;
    };
  };
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  function getSymbolIterator() {
    if (typeof Symbol !== "function" || !Symbol.iterator) {
      return "@@iterator";
    }

    return Symbol.iterator;
  }

  var iterator = /*@__PURE__*/ getSymbolIterator();
  /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */

  var subscribeToIterable = function subscribeToIterable(iterable) {
    return function (subscriber) {
      var iterator$1 = iterable[iterator]();

      do {
        var item = void 0;

        try {
          item = iterator$1.next();
        } catch (err) {
          subscriber.error(err);
          return subscriber;
        }

        if (item.done) {
          subscriber.complete();
          break;
        }

        subscriber.next(item.value);

        if (subscriber.closed) {
          break;
        }
      } while (true);

      if (typeof iterator$1["return"] === "function") {
        subscriber.add(function () {
          if (iterator$1["return"]) {
            iterator$1["return"]();
          }
        });
      }

      return subscriber;
    };
  };
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  var observable = /*@__PURE__*/ (function () {
    return (
      (typeof Symbol === "function" && Symbol.observable) || "@@observable"
    );
  })();
  /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */

  var subscribeToObservable = function subscribeToObservable(obj) {
    return function (subscriber) {
      var obs = obj[observable]();

      if (typeof obs.subscribe !== "function") {
        throw new TypeError(
          "Provided object does not correctly implement Symbol.observable"
        );
      } else {
        return obs.subscribe(subscriber);
      }
    };
  };
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  var isArrayLike = function isArrayLike(x) {
    return x && typeof x.length === "number" && typeof x !== "function";
  };
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  function isPromise(value) {
    return (
      !!value &&
      typeof value.subscribe !== "function" &&
      typeof value.then === "function"
    );
  }
  /** PURE_IMPORTS_START _subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */

  var subscribeTo = function subscribeTo(result) {
    if (!!result && typeof result[observable] === "function") {
      return subscribeToObservable(result);
    } else if (isArrayLike(result)) {
      return subscribeToArray(result);
    } else if (isPromise(result)) {
      return subscribeToPromise(result);
    } else if (!!result && typeof result[iterator] === "function") {
      return subscribeToIterable(result);
    } else {
      var value = isObject$2(result) ? "an invalid object" : "'" + result + "'";
      var msg =
        "You provided " +
        value +
        " where a stream was expected." +
        " You can provide an Observable, Promise, Array, or Iterable.";
      throw new TypeError(msg);
    }
  };
  /** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */

  function canReportError(observer) {
    while (observer) {
      var _a = observer,
        closed_1 = _a.closed,
        destination = _a.destination,
        isStopped = _a.isStopped;

      if (closed_1 || isStopped) {
        return false;
      } else if (destination && destination instanceof Subscriber$1) {
        observer = destination;
      } else {
        observer = null;
      }
    }

    return true;
  }
  /** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */

  function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
      if (nextOrObserver instanceof Subscriber$1) {
        return nextOrObserver;
      }

      if (nextOrObserver[rxSubscriber$1]) {
        return nextOrObserver[rxSubscriber$1]();
      }
    }

    if (!nextOrObserver && !error && !complete) {
      return new Subscriber$1(empty$1);
    }

    return new Subscriber$1(nextOrObserver, error, complete);
  }
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  function identity(x) {
    return x;
  }
  /** PURE_IMPORTS_START _identity PURE_IMPORTS_END */

  function pipeFromArray(fns) {
    if (fns.length === 0) {
      return identity;
    }

    if (fns.length === 1) {
      return fns[0];
    }

    return function piped(input) {
      return fns.reduce(function (prev, fn) {
        return fn(prev);
      }, input);
    };
  }
  /** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */

  var Observable = /*@__PURE__*/ (function () {
    function Observable(subscribe) {
      this._isScalar = false;

      if (subscribe) {
        this._subscribe = subscribe;
      }
    }

    Observable.prototype.lift = function (operator) {
      var observable = new Observable();
      observable.source = this;
      observable.operator = operator;
      return observable;
    };

    Observable.prototype.subscribe = function (
      observerOrNext,
      error,
      complete
    ) {
      var operator = this.operator;
      var sink = toSubscriber(observerOrNext, error, complete);

      if (operator) {
        sink.add(operator.call(sink, this.source));
      } else {
        sink.add(
          this.source ||
            (config$1.useDeprecatedSynchronousErrorHandling &&
              !sink.syncErrorThrowable)
            ? this._subscribe(sink)
            : this._trySubscribe(sink)
        );
      }

      if (config$1.useDeprecatedSynchronousErrorHandling) {
        if (sink.syncErrorThrowable) {
          sink.syncErrorThrowable = false;

          if (sink.syncErrorThrown) {
            throw sink.syncErrorValue;
          }
        }
      }

      return sink;
    };

    Observable.prototype._trySubscribe = function (sink) {
      try {
        return this._subscribe(sink);
      } catch (err) {
        if (config$1.useDeprecatedSynchronousErrorHandling) {
          sink.syncErrorThrown = true;
          sink.syncErrorValue = err;
        }

        if (canReportError(sink)) {
          sink.error(err);
        } else {
          console.warn(err);
        }
      }
    };

    Observable.prototype.forEach = function (next, promiseCtor) {
      var _this = this;

      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function (resolve, reject) {
        var subscription;
        subscription = _this.subscribe(
          function (value) {
            try {
              next(value);
            } catch (err) {
              reject(err);

              if (subscription) {
                subscription.unsubscribe();
              }
            }
          },
          reject,
          resolve
        );
      });
    };

    Observable.prototype._subscribe = function (subscriber) {
      var source = this.source;
      return source && source.subscribe(subscriber);
    };

    Observable.prototype[observable] = function () {
      return this;
    };

    Observable.prototype.pipe = function () {
      var operations = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        operations[_i] = arguments[_i];
      }

      if (operations.length === 0) {
        return this;
      }

      return pipeFromArray(operations)(this);
    };

    Observable.prototype.toPromise = function (promiseCtor) {
      var _this = this;

      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function (resolve, reject) {
        var value;

        _this.subscribe(
          function (x) {
            return (value = x);
          },
          function (err) {
            return reject(err);
          },
          function () {
            return resolve(value);
          }
        );
      });
    };

    Observable.create = function (subscribe) {
      return new Observable(subscribe);
    };

    return Observable;
  })();

  function getPromiseCtor(promiseCtor) {
    if (!promiseCtor) {
      promiseCtor = Promise;
    }

    if (!promiseCtor) {
      throw new Error("no Promise impl found");
    }

    return promiseCtor;
  }
  /** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo,_Observable PURE_IMPORTS_END */

  function subscribeToResult(
    outerSubscriber,
    result,
    outerValue,
    outerIndex,
    innerSubscriber
  ) {
    if (innerSubscriber === void 0) {
      innerSubscriber = new InnerSubscriber(
        outerSubscriber,
        outerValue,
        outerIndex
      );
    }

    if (innerSubscriber.closed) {
      return undefined;
    }

    if (result instanceof Observable) {
      return result.subscribe(innerSubscriber);
    }

    return subscribeTo(result)(innerSubscriber);
  }
  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_InnerSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

  function catchError(selector) {
    return function catchErrorOperatorFunction(source) {
      var operator = new CatchOperator(selector);
      var caught = source.lift(operator);
      return (operator.caught = caught);
    };
  }

  var CatchOperator = /*@__PURE__*/ (function () {
    function CatchOperator(selector) {
      this.selector = selector;
    }

    CatchOperator.prototype.call = function (subscriber, source) {
      return source.subscribe(
        new CatchSubscriber(subscriber, this.selector, this.caught)
      );
    };

    return CatchOperator;
  })();

  var CatchSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(CatchSubscriber, _super);

    function CatchSubscriber(destination, selector, caught) {
      var _this = _super.call(this, destination) || this;

      _this.selector = selector;
      _this.caught = caught;
      return _this;
    }

    CatchSubscriber.prototype.error = function (err) {
      if (!this.isStopped) {
        var result = void 0;

        try {
          result = this.selector(err, this.caught);
        } catch (err2) {
          _super.prototype.error.call(this, err2);

          return;
        }

        this._unsubscribeAndRecycle();

        var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
        this.add(innerSubscriber);
        var innerSubscription = subscribeToResult(
          this,
          result,
          undefined,
          undefined,
          innerSubscriber
        );

        if (innerSubscription !== innerSubscriber) {
          this.add(innerSubscription);
        }
      }
    };

    return CatchSubscriber;
  })(OuterSubscriber);
  /** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */

  function scheduleArray(input, scheduler) {
    return new Observable(function (subscriber) {
      var sub = new Subscription$1();
      var i = 0;
      sub.add(
        scheduler.schedule(function () {
          if (i === input.length) {
            subscriber.complete();
            return;
          }

          subscriber.next(input[i++]);

          if (!subscriber.closed) {
            sub.add(this.schedule());
          }
        })
      );
      return sub;
    });
  }
  /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable PURE_IMPORTS_END */

  function scheduleObservable(input, scheduler) {
    return new Observable(function (subscriber) {
      var sub = new Subscription$1();
      sub.add(
        scheduler.schedule(function () {
          var observable$1 = input[observable]();
          sub.add(
            observable$1.subscribe({
              next: function next(value) {
                sub.add(
                  scheduler.schedule(function () {
                    return subscriber.next(value);
                  })
                );
              },
              error: function error(err) {
                sub.add(
                  scheduler.schedule(function () {
                    return subscriber.error(err);
                  })
                );
              },
              complete: function complete() {
                sub.add(
                  scheduler.schedule(function () {
                    return subscriber.complete();
                  })
                );
              },
            })
          );
        })
      );
      return sub;
    });
  }
  /** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */

  function schedulePromise(input, scheduler) {
    return new Observable(function (subscriber) {
      var sub = new Subscription$1();
      sub.add(
        scheduler.schedule(function () {
          return input.then(
            function (value) {
              sub.add(
                scheduler.schedule(function () {
                  subscriber.next(value);
                  sub.add(
                    scheduler.schedule(function () {
                      return subscriber.complete();
                    })
                  );
                })
              );
            },
            function (err) {
              sub.add(
                scheduler.schedule(function () {
                  return subscriber.error(err);
                })
              );
            }
          );
        })
      );
      return sub;
    });
  }
  /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator PURE_IMPORTS_END */

  function scheduleIterable(input, scheduler) {
    if (!input) {
      throw new Error("Iterable cannot be null");
    }

    return new Observable(function (subscriber) {
      var sub = new Subscription$1();
      var iterator$1;
      sub.add(function () {
        if (iterator$1 && typeof iterator$1["return"] === "function") {
          iterator$1["return"]();
        }
      });
      sub.add(
        scheduler.schedule(function () {
          iterator$1 = input[iterator]();
          sub.add(
            scheduler.schedule(function () {
              if (subscriber.closed) {
                return;
              }

              var value;
              var done;

              try {
                var result = iterator$1.next();
                value = result.value;
                done = result.done;
              } catch (err) {
                subscriber.error(err);
                return;
              }

              if (done) {
                subscriber.complete();
              } else {
                subscriber.next(value);
                this.schedule();
              }
            })
          );
        })
      );
      return sub;
    });
  }
  /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */

  function isInteropObservable(input) {
    return input && typeof input[observable] === "function";
  }
  /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */

  function isIterable(input) {
    return input && typeof input[iterator] === "function";
  }

  function scheduled(input, scheduler) {
    if (input != null) {
      if (isInteropObservable(input)) {
        return scheduleObservable(input, scheduler);
      } else if (isPromise(input)) {
        return schedulePromise(input, scheduler);
      } else if (isArrayLike(input)) {
        return scheduleArray(input, scheduler);
      } else if (isIterable(input) || typeof input === "string") {
        return scheduleIterable(input, scheduler);
      }
    }

    throw new TypeError(
      ((input !== null && _typeof_1(input)) || input) + " is not observable"
    );
  }
  /** PURE_IMPORTS_START _Observable,_util_subscribeTo,_scheduled_scheduled PURE_IMPORTS_END */

  function from(input, scheduler) {
    if (!scheduler) {
      if (input instanceof Observable) {
        return input;
      }

      return new Observable(subscribeTo(input));
    } else {
      return scheduled(input, scheduler);
    }
  }
  /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */

  function map$1(project, thisArg) {
    return function mapOperation(source) {
      if (typeof project !== "function") {
        throw new TypeError(
          "argument is not a function. Are you looking for `mapTo()`?"
        );
      }

      return source.lift(new MapOperator(project, thisArg));
    };
  }

  var MapOperator = /*@__PURE__*/ (function () {
    function MapOperator(project, thisArg) {
      this.project = project;
      this.thisArg = thisArg;
    }

    MapOperator.prototype.call = function (subscriber, source) {
      return source.subscribe(
        new MapSubscriber(subscriber, this.project, this.thisArg)
      );
    };

    return MapOperator;
  })();

  var MapSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(MapSubscriber, _super);

    function MapSubscriber(destination, project, thisArg) {
      var _this = _super.call(this, destination) || this;

      _this.project = project;
      _this.count = 0;
      _this.thisArg = thisArg || _this;
      return _this;
    }

    MapSubscriber.prototype._next = function (value) {
      var result;

      try {
        result = this.project.call(this.thisArg, value, this.count++);
      } catch (err) {
        this.destination.error(err);
        return;
      }

      this.destination.next(result);
    };

    return MapSubscriber;
  })(Subscriber$1);
  /** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_InnerSubscriber,_map,_observable_from PURE_IMPORTS_END */

  function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) {
      concurrent = Number.POSITIVE_INFINITY;
    }

    if (typeof resultSelector === "function") {
      return function (source) {
        return source.pipe(
          mergeMap(function (a, i) {
            return from(project(a, i)).pipe(
              map$1(function (b, ii) {
                return resultSelector(a, b, i, ii);
              })
            );
          }, concurrent)
        );
      };
    } else if (typeof resultSelector === "number") {
      concurrent = resultSelector;
    }

    return function (source) {
      return source.lift(new MergeMapOperator(project, concurrent));
    };
  }

  var MergeMapOperator = /*@__PURE__*/ (function () {
    function MergeMapOperator(project, concurrent) {
      if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
      }

      this.project = project;
      this.concurrent = concurrent;
    }

    MergeMapOperator.prototype.call = function (observer, source) {
      return source.subscribe(
        new MergeMapSubscriber(observer, this.project, this.concurrent)
      );
    };

    return MergeMapOperator;
  })();

  var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(MergeMapSubscriber, _super);

    function MergeMapSubscriber(destination, project, concurrent) {
      if (concurrent === void 0) {
        concurrent = Number.POSITIVE_INFINITY;
      }

      var _this = _super.call(this, destination) || this;

      _this.project = project;
      _this.concurrent = concurrent;
      _this.hasCompleted = false;
      _this.buffer = [];
      _this.active = 0;
      _this.index = 0;
      return _this;
    }

    MergeMapSubscriber.prototype._next = function (value) {
      if (this.active < this.concurrent) {
        this._tryNext(value);
      } else {
        this.buffer.push(value);
      }
    };

    MergeMapSubscriber.prototype._tryNext = function (value) {
      var result;
      var index = this.index++;

      try {
        result = this.project(value, index);
      } catch (err) {
        this.destination.error(err);
        return;
      }

      this.active++;

      this._innerSub(result, value, index);
    };

    MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
      var innerSubscriber = new InnerSubscriber(this, value, index);
      var destination = this.destination;
      destination.add(innerSubscriber);
      var innerSubscription = subscribeToResult(
        this,
        ish,
        undefined,
        undefined,
        innerSubscriber
      );

      if (innerSubscription !== innerSubscriber) {
        destination.add(innerSubscription);
      }
    };

    MergeMapSubscriber.prototype._complete = function () {
      this.hasCompleted = true;

      if (this.active === 0 && this.buffer.length === 0) {
        this.destination.complete();
      }

      this.unsubscribe();
    };

    MergeMapSubscriber.prototype.notifyNext = function (
      outerValue,
      innerValue,
      outerIndex,
      innerIndex,
      innerSub
    ) {
      this.destination.next(innerValue);
    };

    MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
      var buffer = this.buffer;
      this.remove(innerSub);
      this.active--;

      if (buffer.length > 0) {
        this._next(buffer.shift());
      } else if (this.active === 0 && this.hasCompleted) {
        this.destination.complete();
      }
    };

    return MergeMapSubscriber;
  })(OuterSubscriber);
  /** PURE_IMPORTS_START _mergeMap,_util_identity PURE_IMPORTS_END */

  function mergeAll(concurrent) {
    if (concurrent === void 0) {
      concurrent = Number.POSITIVE_INFINITY;
    }

    return mergeMap(identity, concurrent);
  }
  /** PURE_IMPORTS_START tslib,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */

  function takeUntil(notifier) {
    return function (source) {
      return source.lift(new TakeUntilOperator(notifier));
    };
  }

  var TakeUntilOperator = /*@__PURE__*/ (function () {
    function TakeUntilOperator(notifier) {
      this.notifier = notifier;
    }

    TakeUntilOperator.prototype.call = function (subscriber, source) {
      var takeUntilSubscriber = new TakeUntilSubscriber(subscriber);
      var notifierSubscription = subscribeToResult(
        takeUntilSubscriber,
        this.notifier
      );

      if (notifierSubscription && !takeUntilSubscriber.seenValue) {
        takeUntilSubscriber.add(notifierSubscription);
        return source.subscribe(takeUntilSubscriber);
      }

      return takeUntilSubscriber;
    };

    return TakeUntilOperator;
  })();

  var TakeUntilSubscriber = /*@__PURE__*/ (function (_super) {
    __extends(TakeUntilSubscriber, _super);

    function TakeUntilSubscriber(destination) {
      var _this = _super.call(this, destination) || this;

      _this.seenValue = false;
      return _this;
    }

    TakeUntilSubscriber.prototype.notifyNext = function (
      outerValue,
      innerValue,
      outerIndex,
      innerIndex,
      innerSub
    ) {
      this.seenValue = true;
      this.complete();
    };

    TakeUntilSubscriber.prototype.notifyComplete = function () {};

    return TakeUntilSubscriber;
  })(OuterSubscriber);
  /** PURE_IMPORTS_START  PURE_IMPORTS_END */

  function noop$1() {}
  /** PURE_IMPORTS_START tslib,_Subscriber,_util_noop,_util_isFunction PURE_IMPORTS_END */

  function tap$1(nextOrObserver, error, complete) {
    return function tapOperatorFunction(source) {
      return source.lift(new DoOperator$1(nextOrObserver, error, complete));
    };
  }

  var DoOperator$1 = /*@__PURE__*/ (function () {
    function DoOperator(nextOrObserver, error, complete) {
      this.nextOrObserver = nextOrObserver;
      this.error = error;
      this.complete = complete;
    }

    DoOperator.prototype.call = function (subscriber, source) {
      return source.subscribe(
        new TapSubscriber$1(
          subscriber,
          this.nextOrObserver,
          this.error,
          this.complete
        )
      );
    };

    return DoOperator;
  })();

  var TapSubscriber$1 = /*@__PURE__*/ (function (_super) {
    __extends(TapSubscriber, _super);

    function TapSubscriber(destination, observerOrNext, error, complete) {
      var _this = _super.call(this, destination) || this;

      _this._tapNext = noop$1;
      _this._tapError = noop$1;
      _this._tapComplete = noop$1;
      _this._tapError = error || noop$1;
      _this._tapComplete = complete || noop$1;

      if (isFunction$2(observerOrNext)) {
        _this._context = _this;
        _this._tapNext = observerOrNext;
      } else if (observerOrNext) {
        _this._context = observerOrNext;
        _this._tapNext = observerOrNext.next || noop$1;
        _this._tapError = observerOrNext.error || noop$1;
        _this._tapComplete = observerOrNext.complete || noop$1;
      }

      return _this;
    }

    TapSubscriber.prototype._next = function (value) {
      try {
        this._tapNext.call(this._context, value);
      } catch (err) {
        this.destination.error(err);
        return;
      }

      this.destination.next(value);
    };

    TapSubscriber.prototype._error = function (err) {
      try {
        this._tapError.call(this._context, err);
      } catch (err) {
        this.destination.error(err);
        return;
      }

      this.destination.error(err);
    };

    TapSubscriber.prototype._complete = function () {
      try {
        this._tapComplete.call(this._context);
      } catch (err) {
        this.destination.error(err);
        return;
      }

      return this.destination.complete();
    };

    return TapSubscriber;
  })(Subscriber$1);

  var __awaiter = function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };

  var __generator = function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function sent() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2),
      }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );

    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }

    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");

      while (_) {
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];

          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;

            case 4:
              _.label++;
              return {
                value: op[1],
                done: false,
              };

            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;

            case 7:
              op = _.ops.pop();

              _.trys.pop();

              continue;

            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }

              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }

              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }

              if (t && _.label < t[2]) {
                _.label = t[2];

                _.ops.push(op);

                break;
              }

              if (t[2]) _.ops.pop();

              _.trys.pop();

              continue;
          }

          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      }

      if (op[0] & 5) throw op[1];
      return {
        value: op[0] ? op[1] : void 0,
        done: true,
      };
    }
  };

  function createClient() {
    var connections = {};
    var shutdown$ = new _esm5.Subject();

    function getConnection(addr) {
      var address = addr + "/transport";
      connections[address] = connections[address] || connect(address);
      return connections[address];
    }

    function requestResponse(address, msg) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        return __awaiter(_this, void 0, void 0, function () {
          var cid, con, to, _listener;

          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                cid = Date.now() + Math.random();
                return [
                  4,
                  /*yield*/
                  getConnection(address),
                ];

              case 1:
                con = _a.sent();
                con.postMessage({
                  header: {
                    cid: cid,
                    asyncModel: "requestResponse",
                  },
                  msg: msg,
                });
                to = setTimeout(function () {
                  con.removeEventListener("message", _listener);
                  reject("timeout");
                }, 5000);

                _listener = function listener(ev) {
                  if (ev.data.header.cid === cid) {
                    con.removeEventListener("message", _listener);
                    clearTimeout(to);

                    if (ev.data.header.error) {
                      reject(ev.data.header.error);
                    }

                    resolve(ev.data.msg);
                  }
                };

                con.addEventListener("message", _listener);
                return [
                  2,
                  /*return*/
                ];
            }
          });
        });
      });
    }

    function requestStream(address, msg) {
      return new _esm5.Observable(function (obs) {
        var cid = Date.now() + Math.random();
        var cancel;
        getConnection(address).then(function (con) {
          if (cancel === true) {
            return;
          }

          var to = setTimeout(function () {
            con.removeEventListener("message", listener);
            obs.error("timeout");
          }, 5000);

          var listener = function listener(ev) {
            if (ev.data.header.cid === cid) {
              switch (ev.data.header.type) {
                case "NEXT":
                  obs.next(ev.data.msg);
                  break;

                case "COMPLETE":
                  con.removeEventListener("message", listener);
                  obs.complete();
                  break;

                case "ERROR":
                  con.removeEventListener("message", listener);
                  obs.error(ev.data.header.error);
                  break;

                case "ACK":
                  clearTimeout(to);
                  break;
              }
            }
          };

          con.addEventListener("message", listener);
          con.postMessage({
            header: {
              cid: cid,
              asyncModel: "requestStream",
            },
            msg: msg,
          });
          var sub = shutdown$.subscribe(function (addr) {
            if (addr === address) {
              obs.error("Transport client shutdown");
              con.postMessage({
                header: {
                  cid: cid,
                  asyncModel: "requestStream",
                  type: "UNSUBSCRIBE",
                },
              });
              con.removeEventListener("message", listener);
              clearTimeout(to);
            }
          });

          cancel = function cancel() {
            sub.unsubscribe();
            con.postMessage({
              header: {
                cid: cid,
                asyncModel: "requestStream",
                type: "UNSUBSCRIBE",
              },
            });
            con.removeEventListener("message", listener);
            clearTimeout(to);
          };
        });
        return function () {
          if (typeof cancel === "function") {
            cancel();
          } else {
            cancel = true;
          }
        };
      });
    }

    function shutdown(address) {
      shutdown$.next(address);
    }

    return {
      requestResponse: requestResponse,
      requestStream: requestStream,
      shutdown: shutdown,
    };
  }

  function createServer(address, serviceCall) {
    var openSubs = {};
    var shutdownSig$ = new _esm5.Subject();
    listen(address + "/transport", function (msg, port) {
      if (msg.data.header && msg.data.header.cid) {
        switch (msg.data.header.asyncModel) {
          case "requestResponse": {
            serviceCall
              .requestResponse(msg.data.msg)
              .then(function (res) {
                return port.postMessage({
                  header: {
                    cid: msg.data.header.cid,
                  },
                  msg: res,
                });
              })
              ["catch"](function (reason) {
                return port.postMessage({
                  header: {
                    cid: msg.data.header.cid,
                    error: reason,
                  },
                });
              });
            break;
          }

          case "requestStream": {
            if (msg.data.header.type === "UNSUBSCRIBE") {
              openSubs[msg.data.header.cid] &&
                openSubs[msg.data.header.cid].unsubscribe();
              break;
            }

            port.postMessage({
              header: {
                cid: msg.data.header.cid,
                type: "ACK",
              },
            });
            openSubs[msg.data.header.cid] = serviceCall
              .requestStream(msg.data.msg)
              .pipe(
                takeUntil(
                  shutdownSig$.pipe(
                    catchError(function (_) {
                      port.postMessage({
                        header: {
                          cid: msg.data.header.cid,
                          error: "Transport server shutdown",
                          type: "ERROR",
                        },
                      });
                      return _esm5.throwError("server shutdown");
                    })
                  )
                )
              )
              .subscribe(
                function (res) {
                  return port.postMessage({
                    header: {
                      cid: msg.data.header.cid,
                      type: "NEXT",
                    },
                    msg: res,
                  });
                },
                function (reason) {
                  return port.postMessage({
                    header: {
                      cid: msg.data.header.cid,
                      error: reason,
                      type: "ERROR",
                    },
                  });
                },
                function () {
                  return port.postMessage({
                    header: {
                      cid: msg.data.header.cid,
                      type: "COMPLETE",
                    },
                  });
                }
              );
            break;
          }
        }
      }
    });
    return function () {
      return shutdownSig$.error("server shutdown");
    };
  }

  var assert$1 = function assert(predicate, msg) {
    if (!predicate) {
      throw new Error(msg);
    }
  };

  var isDefined$1 = function isDefined(val) {
    return typeof val !== "undefined";
  };

  var isString$1 = function isString(val) {
    return typeof val === "string" || val instanceof String;
  };

  var assertString$1 = function assertString(val) {
    var msg =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "Expected to be a string";
    assert$1(isDefined$1(val) && isString$1(val), msg);
  };

  var isArray$3 = function isArray(val) {
    return Array.isArray(val);
  };

  var isObject$3 = function isObject(val) {
    return Object.prototype.toString.call(val) === "[object Object]";
  };

  var assertObject$1 = function assertObject(val) {
    var msg =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "Expected to be an object";
    assert$1(isObject$3(val), msg);
  };

  var assertNonEmptyObject$1 = function assertNonEmptyObject(val) {
    var msg =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "Expected to be non empty object";
    assertObject$1(val, msg);
    assert$1(Object.keys(val).length > 0, msg);
  };

  var isOneOf$1 = function isOneOf(collection, val) {
    if (isArray$3(collection)) {
      return collection.includes(val);
    }

    if (isObject$3(collection)) {
      return Object.values(collection).includes(val);
    }

    return false;
  };

  var isNumber$1 = function isNumber(val) {
    return typeof val === "number" && !isNaN(val);
  };

  var assertNumber$1 = function assertNumber(val) {
    var msg =
      arguments.length > 1 && arguments[1] !== undefined
        ? arguments[1]
        : "Expected to be a number";
    assert$1(isNumber$1(val), msg);
  };

  var NOT_VALID_PROTOCOL$1 = "Not a valid protocol";
  var NOT_VALID_ADDRESS$1 = "Address must be of type object";
  var NOT_VALID_HOST$1 = "Not a valid host";
  var NOT_VALID_PATH$1 = "Not a valid path";
  var NOT_VALID_PORT$1 = "Not a valid port";

  var validateAddress$1 = function validateAddress(address) {
    var isOptional =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (isOptional && typeof address === "undefined") {
      return true;
    }

    assertNonEmptyObject$1(address, NOT_VALID_ADDRESS$1);
    var host = address.host,
      path = address.path,
      protocol = address.protocol;
    var port = address.port;
    port = isString$1(port) ? Number(port) : port;
    assertString$1(host, NOT_VALID_HOST$1);
    assertString$1(path, NOT_VALID_PATH$1);
    assertNumber$1(port, NOT_VALID_PORT$1);
    assertString$1(protocol, NOT_VALID_PROTOCOL$1);
    assert$1(
      isOneOf$1(["pm", "ws", "wss", "tcp"], protocol),
      NOT_VALID_PROTOCOL$1
    );
    return true;
  };
  /**
   * address is <protocol>://<host>:<port>/<path>
   */

  var getFullAddress$1 = function getFullAddress(address) {
    validateAddress$1(address, false);
    var host = address.host,
      path = address.path,
      port = address.port,
      protocol = address.protocol;
    return ""
      .concat(protocol, "://")
      .concat(host, ":")
      .concat(port, "/")
      .concat(path);
  };

  var getAddress$1 = function getAddress(address) {
    var newAddress = {};
    address = buildAddress$1({
      key: "protocol",
      optionalValue: "pm",
      delimiter: "://",
      str: address,
      newAddress: newAddress,
    });
    address = buildAddress$1({
      key: "host",
      optionalValue: "defaultHost",
      delimiter: ":",
      str: address,
      newAddress: newAddress,
    });
    address = buildAddress$1({
      key: "port",
      optionalValue: 8080,
      delimiter: "/",
      str: address,
      newAddress: newAddress,
    });
    newAddress.path = address;
    return newAddress;
  };

  var buildAddress$1 = function buildAddress(_ref) {
    var key = _ref.key,
      optionalValue = _ref.optionalValue,
      delimiter = _ref.delimiter,
      newAddress = _ref.newAddress,
      str = _ref.str;

    var _str$split = str.split(delimiter),
      _str$split2 = slicedToArray(_str$split, 2),
      v1 = _str$split2[0],
      rest = _str$split2[1];

    if (!rest) {
      rest = v1;
      v1 = optionalValue;
    }

    newAddress[key] = v1;
    return rest;
  };

  var isNodejs$1 = function isNodejs() {
    try {
      // common api for main threat or worker in the browser
      return !navigator;
    } catch (e) {
      return false;
    }
  };

  var workersMap$1 = {};
  var registeredIframes$1 = {};
  var iframes$1 = [];
  /**
   * check from which iframe the event arrived,
   * @param ev
   */

  var registerIframe$1 = function registerIframe(ev) {
    iframes$1.some(function (iframe) {
      if (ev.source === iframe.contentWindow) {
        registeredIframes$1[
          ev.data.detail.whoAmI || ev.data.detail.origin
        ] = iframe;
      }

      return ev.source === iframe.contentWindow;
    });
  };

  var initialize$1 = function initialize() {
    if (!isNodejs$1()) {
      // @ts-ignore
      if (
        typeof WorkerGlobalScope !== "undefined" &&
        self instanceof WorkerGlobalScope
      ) {
        console.warn("Don't use this on webworkers, only on the main thread");
      } else {
        addEventListener("message", function (ev) {
          if (ev && ev.data && !ev.data.workerId) {
            ev.data.type === "ConnectIframe" && registerIframe$1(ev);
            var detail = ev.data.detail;

            if (detail) {
              ev.data.workerId = 1;
              var propogateTo =
                workersMap$1[detail.to] || workersMap$1[detail.address]; // discoveryEvents || rsocketEvents

              if (propogateTo) {
                // @ts-ignore
                propogateTo.postMessage(ev.data, ev.ports);
              }

              var iframe =
                registeredIframes$1[detail.to] ||
                registeredIframes$1[detail.address];

              if (iframe) {
                iframe.contentWindow.postMessage(ev.data, "*", ev.ports);
              }
            }
          }
        });
      }
    }
  };

  function workerEventHandler$1(ev) {
    if (ev.data && ev.data.detail && ev.data.type) {
      var detail = ev.data.detail;

      if (!ev.data.workerId) {
        ev.data.workerId = 1;

        if (ev.data.type === "ConnectWorkerEvent") {
          if (detail.whoAmI) {
            // @ts-ignore
            workersMap$1[detail.whoAmI] = this;
          }
        } else {
          var propogateTo =
            workersMap$1[detail.to] || workersMap$1[detail.address]; // discoveryEvents || rsocketEvents

          if (propogateTo) {
            // @ts-ignore
            propogateTo.postMessage(ev.data, ev.ports);
          } else {
            // @ts-ignore
            postMessage(ev.data, "*", ev.ports);
          }
        }
      }
    }
  }

  var addWorker$1 = function addWorker(worker) {
    worker.addEventListener("message", workerEventHandler$1.bind(worker));
  };

  var removeWorker$1 = function removeWorker(worker) {
    worker.removeEventListener("message", workerEventHandler$1.bind(worker));
  };

  var addIframe$1 = function addIframe(iframe) {
    iframes$1.push(iframe);
  }; // polyfill MessagePort and MessageChannel

  var MessagePortPolyfill$1 = /*#__PURE__*/ (function () {
    function MessagePortPolyfill(whoami) {
      classCallCheck(this, MessagePortPolyfill);
      this.onmessage = null;
      this.onmessageerror = null;
      this.otherPort = null;
      this.onmessageListeners = [];
      this.queue = [];
      this.otherSideStart = false;
      this.whoami = whoami;
    }

    createClass(MessagePortPolyfill, [
      {
        key: "dispatchEvent",
        value: function dispatchEvent(event) {
          if (this.onmessage) {
            this.onmessage(event);
          }

          this.onmessageListeners.forEach(function (listener) {
            return listener(event);
          });
          return true;
        },
      },
      {
        key: "postMessage",
        value: function postMessage(message, ports) {
          var event = {
            ports: ports,
            data: message,
          };

          if (!this.otherPort) {
            return;
          }

          if (this.otherSideStart) {
            this.otherPort.dispatchEvent(event);
          } else {
            this.queue.push(event);
          }
        },
      },
      {
        key: "addEventListener",
        value: function addEventListener(type, listener) {
          if (type !== "message") {
            return;
          }

          if (
            typeof listener !== "function" ||
            this.onmessageListeners.indexOf(listener) !== -1
          ) {
            return;
          }

          this.onmessageListeners.push(listener);
        },
      },
      {
        key: "removeEventListener",
        value: function removeEventListener(type, listener) {
          if (type !== "message") {
            return;
          }

          var index = this.onmessageListeners.indexOf(listener);

          if (index === -1) {
            return;
          }

          this.onmessageListeners.splice(index, 1);
        },
      },
      {
        key: "start",
        value: function start() {
          var _this = this;

          setTimeout(function () {
            return (
              _this.otherPort &&
              _this.otherPort.startSending.apply(_this.otherPort, [])
            );
          }, 0);
        },
      },
      {
        key: "close",
        value: function close() {
          var _this2 = this;

          setTimeout(function () {
            return (
              _this2.otherPort &&
              _this2.otherPort.stopSending.apply(_this2.otherPort, [])
            );
          }, 0);
        },
      },
      {
        key: "startSending",
        value: function startSending() {
          var _this3 = this;

          this.otherSideStart = true;
          this.queue.forEach(function (event) {
            return _this3.otherPort && _this3.otherPort.dispatchEvent(event);
          });
        },
      },
      {
        key: "stopSending",
        value: function stopSending() {
          this.otherSideStart = false;
          this.queue.length = 0;
        },
      },
    ]);
    return MessagePortPolyfill;
  })(); // tslint:disable-next-line

  var MessageChannelPolyfill$1 = function MessageChannelPolyfill() {
    classCallCheck(this, MessageChannelPolyfill);
    this.port1 = new MessagePortPolyfill$1("client");
    this.port2 = new MessagePortPolyfill$1("server");
    this.port1.otherPort = this.port2;
    this.port2.otherPort = this.port1;
  };

  var globalObj$1 =
    typeof window !== "undefined" && window.Math === Math
      ? window
      : typeof self !== "undefined" && self.Math === Math
      ? self
      : Function("return this")();

  function applyMessageChannelPolyfill$1() {
    globalObj$1.MessagePort = MessagePortPolyfill$1;
    globalObj$1.MessageChannel = MessageChannelPolyfill$1;
  }

  if (!globalObj$1.MessagePort || !globalObj$1.MessageChannel) {
    applyMessageChannelPolyfill$1();
  }

  var workers$1 = !isNodejs$1()
    ? {
        addWorker: addWorker$1,
        removeWorker: removeWorker$1,
        initialize: initialize$1,
        addIframe: addIframe$1,
      }
    : {};

  function createTransport() {
    var client = createClient();
    return {
      clientTransport: {
        start: function start(options) {
          return Promise.resolve({
            requestResponse: function requestResponse(message) {
              return client.requestResponse(
                getFullAddress$1(options.remoteAddress),
                message
              );
            },
            requestStream: function requestStream(message) {
              return client.requestStream(
                getFullAddress$1(options.remoteAddress),
                message
              );
            },
          });
        },
        destroy: function destroy(options) {
          client.shutdown(options.address);
        },
      },
      serverTransport: function serverTransport(options) {
        return createServer(
          getFullAddress$1(options.localAddress),
          options.serviceCall
        );
      },
    };
  }

  var transport = createTransport();

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;
  var runtime_1 = createCommonjsModule(function (module) {
    /**
     * Copyright (c) 2014-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    var runtime = (function (exports) {
      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var undefined$1; // More compressible than void 0.

      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

      function define(obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true,
        });
        return obj[key];
      }

      try {
        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
        define({}, "");
      } catch (err) {
        define = function define(obj, key, value) {
          return (obj[key] = value);
        };
      }

      function wrap(innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        var protoGenerator =
          outerFn && outerFn.prototype instanceof Generator
            ? outerFn
            : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.

        generator._invoke = makeInvokeMethod(innerFn, self, context);
        return generator;
      }

      exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
      // record like context.tryEntries[i].completion. This interface could
      // have been (and was previously) designed to take a closure to be
      // invoked without arguments, but in all the cases we care about we
      // already have an existing method we want to call, so there's no need
      // to create a new function object. We can even get away with assuming
      // the method takes exactly one argument, since that happens to be true
      // in every case, so we don't have to touch the arguments object. The
      // only additional allocation required is the completion record, which
      // has a stable shape and so hopefully should be cheap to allocate.

      function tryCatch(fn, obj, arg) {
        try {
          return {
            type: "normal",
            arg: fn.call(obj, arg),
          };
        } catch (err) {
          return {
            type: "throw",
            arg: err,
          };
        }
      }

      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
      // breaking out of the dispatch switch statement.

      var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
      // .constructor.prototype properties for functions that return Generator
      // objects. For full spec compliance, you may wish to configure your
      // minifier not to mangle the names of these two functions.

      function Generator() {}

      function GeneratorFunction() {}

      function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
      // don't natively support it.

      var IteratorPrototype = {};

      IteratorPrototype[iteratorSymbol] = function () {
        return this;
      };

      var getProto = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

      if (
        NativeIteratorPrototype &&
        NativeIteratorPrototype !== Op &&
        hasOwn.call(NativeIteratorPrototype, iteratorSymbol)
      ) {
        // This environment has a native %IteratorPrototype%; use it instead
        // of the polyfill.
        IteratorPrototype = NativeIteratorPrototype;
      }

      var Gp = (GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(
        IteratorPrototype
      ));
      GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
      GeneratorFunctionPrototype.constructor = GeneratorFunction;
      GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
      // Iterator interface in terms of a single ._invoke method.

      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function (method) {
          define(prototype, method, function (arg) {
            return this._invoke(method, arg);
          });
        });
      }

      exports.isGeneratorFunction = function (genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor
          ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
              // do is to check its .name property.
              (ctor.displayName || ctor.name) === "GeneratorFunction"
          : false;
      };

      exports.mark = function (genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define(genFun, toStringTagSymbol, "GeneratorFunction");
        }

        genFun.prototype = Object.create(Gp);
        return genFun;
      }; // Within the body of any async function, `await x` is transformed to
      // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
      // `hasOwn.call(value, "__await")` to determine if the yielded value is
      // meant to be awaited.

      exports.awrap = function (arg) {
        return {
          __await: arg,
        };
      };

      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);

          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;

            if (
              value &&
              _typeof_1(value) === "object" &&
              hasOwn.call(value, "__await")
            ) {
              return PromiseImpl.resolve(value.__await).then(
                function (value) {
                  invoke("next", value, resolve, reject);
                },
                function (err) {
                  invoke("throw", err, resolve, reject);
                }
              );
            }

            return PromiseImpl.resolve(value).then(
              function (unwrapped) {
                // When a yielded Promise is resolved, its final value becomes
                // the .value of the Promise<{value,done}> result for the
                // current iteration.
                result.value = unwrapped;
                resolve(result);
              },
              function (error) {
                // If a rejected Promise was yielded, throw the rejection back
                // into the async generator function so it can be handled there.
                return invoke("throw", error, resolve, reject);
              }
            );
          }
        }

        var previousPromise;

        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }

          return (previousPromise = // If enqueue has been called before, then we want to wait until
            // all previous Promises have been resolved before calling invoke,
            // so that results are always delivered in the correct order. If
            // enqueue has not been called before, then it is important to
            // call invoke immediately, without waiting on a callback to fire,
            // so that the async generator function has the opportunity to do
            // any necessary setup in a predictable way. This predictability
            // is why the Promise constructor synchronously invokes its
            // executor callback, and why async functions synchronously
            // execute code before the first await. Since we implement simple
            // async functions in terms of async generators, it is especially
            // important to get this right, even though it requires care.
            previousPromise
              ? previousPromise.then(
                  callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
                  // invocations of the iterator.
                  callInvokeWithMethodAndArg
                )
              : callInvokeWithMethodAndArg());
        } // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).

        this._invoke = enqueue;
      }

      defineIteratorMethods(AsyncIterator.prototype);

      AsyncIterator.prototype[asyncIteratorSymbol] = function () {
        return this;
      };

      exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
      // AsyncIterator objects; they just return a Promise for the value of
      // the final result produced by the iterator.

      exports.async = function (
        innerFn,
        outerFn,
        self,
        tryLocsList,
        PromiseImpl
      ) {
        if (PromiseImpl === void 0) PromiseImpl = Promise;
        var iter = new AsyncIterator(
          wrap(innerFn, outerFn, self, tryLocsList),
          PromiseImpl
        );
        return exports.isGeneratorFunction(outerFn)
          ? iter // If outerFn is a generator, return the full iterator.
          : iter.next().then(function (result) {
              return result.done ? result.value : iter.next();
            });
      };

      function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;
        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }

          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            } // Be forgiving, per 25.3.3.3.3 of the spec:
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume

            return doneResult();
          }

          context.method = method;
          context.arg = arg;

          while (true) {
            var delegate = context.delegate;

            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);

              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }

            if (context.method === "next") {
              // Setting context._sent for legacy support of Babel's
              // function.sent implementation.
              context.sent = context._sent = context.arg;
            } else if (context.method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }

              context.dispatchException(context.arg);
            } else if (context.method === "return") {
              context.abrupt("return", context.arg);
            }

            state = GenStateExecuting;
            var record = tryCatch(innerFn, self, context);

            if (record.type === "normal") {
              // If an exception is thrown from innerFn, we leave state ===
              // GenStateExecuting and loop back for another invocation.
              state = context.done ? GenStateCompleted : GenStateSuspendedYield;

              if (record.arg === ContinueSentinel) {
                continue;
              }

              return {
                value: record.arg,
                done: context.done,
              };
            } else if (record.type === "throw") {
              state = GenStateCompleted; // Dispatch the exception by looping back around to the
              // context.dispatchException(context.arg) call above.

              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      } // Call delegate.iterator[context.method](context.arg) and handle the
      // result, either by returning a { value, done } result from the
      // delegate iterator, or by modifying context.method and context.arg,
      // setting context.delegate to null, and returning the ContinueSentinel.

      function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];

        if (method === undefined$1) {
          // A .throw or .return when the delegate iterator has no .throw
          // method always terminates the yield* loop.
          context.delegate = null;

          if (context.method === "throw") {
            // Note: ["return"] must be used for ES3 parsing compatibility.
            if (delegate.iterator["return"]) {
              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              context.method = "return";
              context.arg = undefined$1;
              maybeInvokeDelegate(delegate, context);

              if (context.method === "throw") {
                // If maybeInvokeDelegate(context) changed context.method from
                // "return" to "throw", let that override the TypeError below.
                return ContinueSentinel;
              }
            }

            context.method = "throw";
            context.arg = new TypeError(
              "The iterator does not provide a 'throw' method"
            );
          }

          return ContinueSentinel;
        }

        var record = tryCatch(method, delegate.iterator, context.arg);

        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }

        var info = record.arg;

        if (!info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }

        if (info.done) {
          // Assign the result of the finished delegate to the temporary
          // variable specified by delegate.resultName (see delegateYield).
          context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

          context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
          // exception, let the outer generator proceed normally. If
          // context.method was "next", forget context.arg since it has been
          // "consumed" by the delegate iterator. If context.method was
          // "return", allow the original .return call to continue in the
          // outer generator.

          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined$1;
          }
        } else {
          // Re-yield the result returned by the delegate method.
          return info;
        } // The delegate iterator is finished, so forget it and continue with
        // the outer generator.

        context.delegate = null;
        return ContinueSentinel;
      } // Define Generator.prototype.{next,throw,return} in terms of the
      // unified ._invoke helper method.

      defineIteratorMethods(Gp);
      define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
      // @@iterator function is called on it. Some browsers' implementations of the
      // iterator prototype chain incorrectly implement this, causing the Generator
      // object to not be returned from this call. This ensures that doesn't happen.
      // See https://github.com/facebook/regenerator/issues/274 for more details.

      Gp[iteratorSymbol] = function () {
        return this;
      };

      Gp.toString = function () {
        return "[object Generator]";
      };

      function pushTryEntry(locs) {
        var entry = {
          tryLoc: locs[0],
        };

        if (1 in locs) {
          entry.catchLoc = locs[1];
        }

        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }

        this.tryEntries.push(entry);
      }

      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }

      function Context(tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [
          {
            tryLoc: "root",
          },
        ];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }

      exports.keys = function (object) {
        var keys = [];

        for (var key in object) {
          keys.push(key);
        }

        keys.reverse(); // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.

        return function next() {
          while (keys.length) {
            var key = keys.pop();

            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          } // To avoid creating an additional object, we just hang the .value
          // and .done properties off the next function object itself. This
          // also ensures that the minifier will not anonymize the function.

          next.done = true;
          return next;
        };
      };

      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];

          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }

          if (typeof iterable.next === "function") {
            return iterable;
          }

          if (!isNaN(iterable.length)) {
            var i = -1,
              next = function next() {
                while (++i < iterable.length) {
                  if (hasOwn.call(iterable, i)) {
                    next.value = iterable[i];
                    next.done = false;
                    return next;
                  }
                }

                next.value = undefined$1;
                next.done = true;
                return next;
              };

            return (next.next = next);
          }
        } // Return an iterator with no values.

        return {
          next: doneResult,
        };
      }

      exports.values = values;

      function doneResult() {
        return {
          value: undefined$1,
          done: true,
        };
      }

      Context.prototype = {
        constructor: Context,
        reset: function reset(skipTempReset) {
          this.prev = 0;
          this.next = 0; // Resetting context._sent for legacy support of Babel's
          // function.sent implementation.

          this.sent = this._sent = undefined$1;
          this.done = false;
          this.delegate = null;
          this.method = "next";
          this.arg = undefined$1;
          this.tryEntries.forEach(resetTryEntry);

          if (!skipTempReset) {
            for (var name in this) {
              // Not sure about the optimal order of these conditions:
              if (
                name.charAt(0) === "t" &&
                hasOwn.call(this, name) &&
                !isNaN(+name.slice(1))
              ) {
                this[name] = undefined$1;
              }
            }
          }
        },
        stop: function stop() {
          this.done = true;
          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;

          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }

          return this.rval;
        },
        dispatchException: function dispatchException(exception) {
          if (this.done) {
            throw exception;
          }

          var context = this;

          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;

            if (caught) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              context.method = "next";
              context.arg = undefined$1;
            }

            return !!caught;
          }

          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;

            if (entry.tryLoc === "root") {
              // Exception thrown outside of any try block that could handle
              // it, so set the completion value of the entire function to
              // throw the exception.
              return handle("end");
            }

            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn.call(entry, "catchLoc");
              var hasFinally = hasOwn.call(entry, "finallyLoc");

              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }
              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },
        abrupt: function abrupt(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (
              entry.tryLoc <= this.prev &&
              hasOwn.call(entry, "finallyLoc") &&
              this.prev < entry.finallyLoc
            ) {
              var finallyEntry = entry;
              break;
            }
          }

          if (
            finallyEntry &&
            (type === "break" || type === "continue") &&
            finallyEntry.tryLoc <= arg &&
            arg <= finallyEntry.finallyLoc
          ) {
            // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null;
          }

          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;

          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }

          return this.complete(record);
        },
        complete: function complete(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }

          if (record.type === "break" || record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }

          return ContinueSentinel;
        },
        finish: function finish(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },
        catch: function _catch(tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;

              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }

              return thrown;
            }
          } // The context.catch method must only be called with a location
          // argument that corresponds to a known catch block.

          throw new Error("illegal catch attempt");
        },
        delegateYield: function delegateYield(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc,
          };

          if (this.method === "next") {
            // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined$1;
          }

          return ContinueSentinel;
        },
      }; // Regardless of whether this script is executing as a CommonJS module
      // or not, return the runtime object so that we can declare the variable
      // regeneratorRuntime in the outer scope, which allows this module to be
      // injected easily by `bin/regenerator --include-runtime script.js`.

      return exports;
    })(
      // If this script is executing as a CommonJS module, use module.exports
      // as the regeneratorRuntime namespace. Otherwise create a new empty
      // object. Either way, the resulting object will be used to initialize
      // the regeneratorRuntime variable at the top of this file.
      module.exports
    );

    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      // This module should not be running in strict mode, so the above
      // assignment should always work unless something is misconfigured. Just
      // in case runtime.js accidentally runs in strict mode, we can escape
      // strict mode using a global Function call. This could conceivably fail
      // if a Content Security Policy forbids using Function, but in that case
      // the proper solution is to fix the accidental strict mode problem. If
      // you've misconfigured your bundler to force strict mode and applied a
      // CSP to forbid Function, and you're not willing to fix either of those
      // problems, please detail your unique predicament in a GitHub issue.
      Function("r", "regeneratorRuntime = r")(runtime);
    }
  });
  var regenerator = runtime_1;

  var __awaiter$1 = function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }

    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }

      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }

      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }

      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };

  function createServer$1(address) {
    return new _esm5.Observable(function (obs) {
      listen(address, function (msg, port) {
        obs.next(
          Object.assign(Object.assign({}, msg.data), {
            send: function send(m) {
              return port.postMessage(m);
            },
            on: function on(cond, handler) {
              port.addEventListener("message", function (e) {
                if (cond(e.data)) {
                  handler(e.data);
                }
              });
            },
          })
        );
      });
    });
  }

  function createConnection() {
    var connections = {};

    function getConnection(address) {
      connections[address] = connections[address] || connect(address);
      return connections[address];
    }

    function send(address, msg) {
      return __awaiter$1(
        this,
        void 0,
        void 0,
        /*#__PURE__*/ regenerator.mark(function _callee() {
          var con;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch ((_context.prev = _context.next)) {
                case 0:
                  _context.next = 2;
                  return getConnection(address);

                case 2:
                  con = _context.sent;
                  con.postMessage(msg);

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        })
      );
    }

    function on(address, listener) {
      return __awaiter$1(
        this,
        void 0,
        void 0,
        /*#__PURE__*/ regenerator.mark(function _callee2() {
          var con;
          return regenerator.wrap(function _callee2$(_context2) {
            while (1) {
              switch ((_context2.prev = _context2.next)) {
                case 0:
                  _context2.next = 2;
                  return getConnection(address);

                case 2:
                  con = _context2.sent;
                  con.addEventListener("message", function (e) {
                    return listener(e.data);
                  });

                case 4:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        })
      );
    }

    return {
      send: send,
      on: on,
    };
  } //     return ctx.address === 'pm://defaultHost:8080/b' &&
  //         name === 'notify';
  // }, ...log);

  var DEBUG = function DEBUG() {};

  function sendInit(ctx, seed) {
    ctx.send(seed, {
      type: "INIT",
      from: ctx.address,
      sender: ctx.address,
      items: ctx.membersData[ctx.address],
    });
  }

  function notifyMembersChanged(ctx, send, to) {
    ctx.members$.subscribe(function (member) {
      if (member.from !== to && member.sender !== to) {
        send({
          from: member.from,
          items: member.items,
          type: member.type === "REMOVED" ? "REMOVED" : "ADDED",
          sender: ctx.address,
        });
      }
    });
  }

  function sendMembers(ctx, send, to) {
    DEBUG(ctx, "send", to, ctx.membersData);
    Object.keys(ctx.membersData).forEach(function (address) {
      if (address !== to) {
        send({
          type: "ADDED",
          from: address,
          items: ctx.membersData[address],
          sender: ctx.address,
        });
      }
    });
  }

  function updateMembers(ctx, e) {
    if (!!ctx.membersData[e.from] === (e.type === "REMOVED")) {
      // DEBUG(options.address.path, msg.data, membersData[msg.data.from]);
      ctx.members$.next(e);
    }

    switch (e.type) {
      case "INIT":
        if (e.from !== e.sender) {
          return;
        }

      case "ADDED":
        ctx.membersData[e.from] = e.items;
        break;

      case "REMOVED":
        delete ctx.membersData[e.from];
        break;
    }
  }

  function fromSeedAdress$(ctx, seedAddress) {
    return new _esm5.Observable(function (obs) {
      ctx.on(seedAddress, function (msg) {
        obs.next(msg);
      });
    });
  }

  var joinCluster = function joinCluster(options) {
    var seeds$ = _esm5.from(options.seedAddress || []).pipe(
      map$1(function (i) {
        return getFullAddress$1(i);
      })
    );
    var seedServerEvents$ = createServer$1(getFullAddress$1(options.address));

    var _createConnection = createConnection(),
      sendAddress = _createConnection.send,
      on = _createConnection.on;

    var ctx = {
      on: on,
      send: sendAddress,
      address: getFullAddress$1(options.address),
      membersData: defineProperty(
        {},
        getFullAddress$1(options.address),
        options.itemsToPublish
      ),
      members$: new _esm5.Subject(),
    };
    seeds$
      .pipe(
        tap$1(function (seed) {
          return sendInit(ctx, seed);
        }),
        tap$1(function (seed) {
          return sendMembers(
            ctx,
            function (msg) {
              return ctx.send(seed, msg);
            },
            seed
          );
        }),
        tap$1(function (seed) {
          return notifyMembersChanged(
            ctx,
            function (msg) {
              return ctx.send(seed, msg);
            },
            seed
          );
        }),
        map$1(function (seed) {
          return fromSeedAdress$(ctx, seed);
        }),
        mergeAll((options.seedAddress && options.seedAddress.length) || 1),
        tap$1(function (event) {
          return updateMembers(ctx, event);
        })
      )
      .subscribe();
    seedServerEvents$
      .pipe(
        _esm5.pipe(
          tap$1(function (e) {
            if (e.type === "INIT") {
              // this will update peers that use it as seed
              sendMembers(ctx, e.send, e.from);
              notifyMembersChanged(ctx, e.send, e.from);
            }
          })
        ), // this will get updates from peers
        tap$1(function (e) {
          return updateMembers(ctx, e);
        })
      )
      .subscribe();
    return {
      destroy: function destroy() {
        ctx.members$.next({
          items: options.itemsToPublish,
          type: "REMOVED",
          from: getFullAddress$1(options.address),
        });
        return new Promise(function (resolve) {
          // drain all events
          setTimeout(function () {
            ctx.members$.complete();
            resolve("");
          });
        });
      },
      getCurrentMembersData: function getCurrentMembersData() {
        return Promise.resolve(ctx.membersData);
      },
      listen$: function listen$() {
        return ctx.members$.pipe(
          map$1(function (i) {
            return {
              type: i.type,
              from: i.from,
              items: i.items,
            };
          })
        );
      },
    };
  };

  var retryRouter = function retryRouter(_a) {
    var period = _a.period,
      maxRetry = _a.maxRetry;
    return function (options) {
      var message = options.message,
        lookUp = options.lookUp;
      var qualifier = message.qualifier;
      var retry = 0;
      return new Promise(function (resolve, reject) {
        var checkRegistry = function checkRegistry() {
          var endpoints = lookUp({
            qualifier: qualifier,
          });

          if (
            !(endpoints && Array.isArray(endpoints) && endpoints.length > 0)
          ) {
            if (maxRetry && maxRetry >= retry) {
              retry++;
            }

            if (!maxRetry || maxRetry >= retry) {
              setTimeout(function () {
                checkRegistry();
              }, period);
            } else {
              reject(null);
            }
          } else {
            resolve(endpoints[0]);
          }
        };

        checkRegistry();
      });
    };
  };

  var createMicroservice$1 = function createMicroservice$1(config) {
    return createMicroservice(
      _assign(
        {
          transport: transport,
          cluster: joinCluster,
          defaultRouter: retryRouter({
            period: 10,
            maxRetry: 500,
          }),
          address: getAddress$1(Date.now().toString()),
        },
        config
      )
    );
  };

  exports.ASYNC_MODEL_TYPES = ASYNC_MODEL_TYPES$1;
  exports.createMicroservice = createMicroservice$1;
  exports.stringToAddress = getAddress$1;
  exports.workers = workers$1;
});
unwrapExports(lib);
var lib_1 = lib.ASYNC_MODEL_TYPES;
var lib_2 = lib.createMicroservice;
var lib_3 = lib.stringToAddress;
var lib_4 = lib.workers;

export { lib_1 as ASYNC_MODEL_TYPES, lib_2 as createMicroservice };
