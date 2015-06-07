module.exports = {
    "parameters": {
        "api.key": 12345
    },

    "services": [
        {
            "name": "common.foo.service",
            "service": require("./FooService"),
            "arguments": [
                "@common.bar.service",
                "%api.key%",
                42
            ]
        },
        {
            "name": "common.bar.service",
            "service": require('./BarService')
        }
    ]
};
