'use strict';

module.exports = {
    'services': [
        {
            'name': 'bar.service.A',
            'service': require('./ServiceA'),
            'calls': {
                'doFoo': [
                    42
                ],
                doBar: [
                    51
                ]
            }
        }
    ]
};
