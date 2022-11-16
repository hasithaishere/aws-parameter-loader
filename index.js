const spawnSync = require('child_process').spawnSync;
const SSM = require('./repository/ssm');

module.exports = {
    load: async (options) => {
        const result = await new SSM(options).init();
        SSM.loadParametersToEnv(result, options.parameterBasePath);
        return result;
    },
    loadSync: (options) => {
        const opts = {
            options,
            fn: 'init',
            parameters: [{}]
        };

        const { stdout } = spawnSync('node', [`${__dirname}/repository/samSync`], {
            input: JSON.stringify([opts]),
            maxBuffer: 4000000
        });

        const queryResult = JSON.parse(stdout.toString());

        if (queryResult.success) {
            const { result } = queryResult;
            SSM.loadParametersToEnv(result, options.parameterBasePath);
            return result;
        } else {
            throw new Error(queryResult.err.message || queryResult.err.code);
        }
    },
};