'use strict';

module.exports = {
    'services': [
        {
            'name': 'bar.service.A',
            'service': require('./ServiceA'),
            'arguments': [
                '@bar.service.B'
            ]
        },
        {
            'name': 'bar.service.B',
            'service': require('./ServiceB'),
            'arguments': [
                '@bar.service.C'
            ]
        }
    ]
};
