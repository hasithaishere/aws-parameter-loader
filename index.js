const spawnSync = require('child_process').spawnSync;
const SSM = require('./repository/ssm');

const loadParametersToEnv = (parameters, parameterBasePath) => {
    parameters.forEach(parameter => {
        const key = parameter.Name.replace(parameterBasePath, '');
        process.env[key] = parameter.Value;
    });
}

module.exports = {
    load: async (options) => {
        const result = await new SSM(options).init();
        loadParametersToEnv(result, options.parameterBasePath);
        return result;
    },
    loadSync: (options) => {
        const opts = {
            options,
            fn: 'init',
            parameters: [{}]
        };

        const { stdout } = spawnSync('node', [`${__dirname}/utils/samSync`], {
            input: JSON.stringify([ opts ]),
            maxBuffer: 4000000
        });

        const queryResult = JSON.parse(stdout.toString());

        if (queryResult.success) {
            const { result } = queryResult;
            loadParametersToEnv(result, options.parameterBasePath);
            return result;
        } else {
            throw new Error(queryResult.err.message || queryResult.err.code);
        }
    },
};