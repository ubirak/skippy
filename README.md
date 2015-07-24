# Skippy

[![npm](https://img.shields.io/npm/v/skippy.svg)](https://www.npmjs.com/package/skippy)
[![wercker status](https://app.wercker.com/status/989f488b071de6c2787562aacef8b63c/s/master "wercker status")](https://app.wercker.com/project/bykey/989f488b071de6c2787562aacef8b63c)

Skippy is design to be an easy to use, robust, and well tested dependencies container. No magic inside.

#### What Skippy does
- Instantiate service as you describe in the configuration
- Configure what should be use as service constructor parameters: you can another services as reference, parameters, or any values you have configure
- Manage singleton instance of service (not defined by design pattern, but by configuration)
- Check the dependencies graph to avoid cyclic dependencies (only on development environement: `process.env.NODE_ENV === 'development'`)

#### What Skippy doesn't do (and never will)
- Introspect JSDoc or parameters name to determine witch service should be inject in a constructor function. You need define service dependencies in a configuration file
- Coffee

#### What Skippy doesn't do for now (but maybe one day)
- Use factory service to generate another service
- Generate a lazy loading proxy function
- Manage service scope (allowing private service, who can only be used to instantiate other service, not retrieved by the enduser)


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
- `name` (`string`, mandatory): the service name
- `service` (`function`, mandatory): the service constructor function reference
- `singleton` (`boolean`, optional, default `true`): If `true`, the service will be a singleton. If `false`, a new service will be instantiated each time
- `arguments` (`array`, optional, default empty array): An array of the value to inject in the service constructor (see "Arguments" section for more informations).


### Arguments

They have three types of arguments type:
- A string like `@foo`: use another service as argument value (here an instance of the service named `foo`)
- A string like `%baz%`: use the corresponding parameter value as argument (here the `baz` parameter)
- Any other value (scalar, object, function...) will be directly use as argument
