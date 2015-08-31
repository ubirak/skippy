'use strict';

module.exports = {
    'parameters': {
        'hello.world': 'Hello, I\'m a parameter!'
    },

    'services': [
        {
            'name': 'foo.serviceA',
            'service': require('./ServiceA'),
            'singleton': true
        },
        {
            'name': 'foo.serviceB',
            'service': require('./ServiceB'),
            'singleton': false,
            'arguments': [
                '@foo.serviceC'
            ]
        },
        {
            'name': 'foo.serviceC',
            'service': require('./ServiceC'),
            'arguments': [
                '%hello.world%',
                42,
                '@foo.serviceA'
            ]
        },
        {
            'name': 'foo.serviceD',
            'service': require('./ServiceD'),
            'arguments': [
                '@foo.serviceA',
                '@foo.serviceB'
            ],
            'calls': {
                'saySomething': [
                    '%hello.world%',
                    '@foo.serviceA',
                    51
                ]
            }
        }
    ]
};
