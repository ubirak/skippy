# Skippy

[![npm](https://img.shields.io/npm/v/skippy.svg)](https://www.npmjs.com/package/skippy)
[![Build Status](https://travis-ci.org/rezzza/skippy.svg?branch=master)](https://travis-ci.org/rezzza/skippy)
[![Coverage Status](https://coveralls.io/repos/rezzza/skippy/badge.svg?branch=master&service=github)](https://coveralls.io/github/rezzza/skippy?branch=master)

Skippy is designed to be an easy to use, robust, and well tested dependencies container. No magic inside.

#### What Skippy do
- Instantiate service as described in the dependencies configuration.
- Configure what should be used as service constructor parameters: you can pass another services as reference, parameters, or any values you have configured.
- Manage singleton instance of service (not defined by design pattern, but by configuration).
- Check the dependencies graph to avoid cyclic dependencies (only on development environement: `process.env.NODE_ENV === 'development'`).

#### What Skippy don't do (and never will)
- Introspect JSDoc or parameters name to determine witch service should be inject in a constructor function. You have to define service dependencies in a configuration file.
- Coffee

#### What Skippy don't at the moment (maybe one day)
- Use factory service to generate another service
- Generate a lazy loading proxy function
- Manage service scope (allowing private service, who can only be used to instantiate other service, not exposed to the world)


## Installation

```
npm install --save skippy
```

## Usage

```javascript
var SkippyFactory = require('skippy').ContainerFactory;

// See configuration section for the configuration details
var services = [/* ... */];
var parameters = {/* ... */}

var container = SkippyFactory.create(services, parameters);

var fooServiceInstance = container.getService('foo');
var fooServiceInstance = container.getService('foo');

var barParameterValue = container.getParameter('bar');

```

## Configuration

### Parameters

The parameter configuration format is a simple key/value object:

```javascript
var foo = "foo value";

module.exports = {
    "parameterName": "parameterValue",
    "foo": foo,
    "bar": 42
}
```

The parameter name should be a string. The value could be anything.


### Services

The services configuration format is an array of individual service configuration:

```javascript
module.exports = [
    {
        "name": "foo.serviceA",
        "service": require("./ServiceA"),
        "singleton": true
    },
    {
        "name": "foo.serviceB",
        "service": require("./ServiceB"),
        "singleton": false,
        "arguments": [
            "@foo.serviceC"
        ]
    },
    {
        "name": "foo.serviceC",
        "service": require("./ServiceC"),
        "arguments": [
            "%baz%",
            42,
            "@foo.serviceA"
        ]
    },
    {
        "name": "foo.serviceD",
        "service": require("./ServiceD"),
        "arguments": [
            "@foo.serviceA",
            "@foo.serviceB"
        ]
    }
];
```

A service configuration have four possible keys:
- `name` (`string`, mandatory): the service name.
- `service` (`function`, mandatory): the service constructor function reference.
- `singleton` (`boolean`, optional, default `true`): If `true`, the service will be a singleton. If `false`, a new service will be instantiated each time.
- `arguments` (`array`, optional, default empty array): An array of the value to inject in the service constructor (see "Arguments" section for more informations).


### Arguments

3 types of arguments type:
- A string like `@foo`: use another service as argument value (here an instance of the service named `foo`).
- A string like `%baz%`: use the corresponding parameter value as argument (here the `baz` parameter).
- Any other value (scalar, object, function...) will be directly used as an argument.
