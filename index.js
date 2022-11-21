const SSM = require('./repository/ssm');

module.exports = async (options = { CACHE_ENABLED: true }) => {
    if (CACHE_ENABLED && process.env.PARAM_CACHED) return;

    const ssmOptions = {
        parameterBasePath: options.parameterBasePath || process.env.PARAM_PATH,
        region: options.region || process.env.AWS_REGION
    };

    const ssm = new SSM(ssmOptions);
    const result = await ssm.loadParameters();
    SSM.loadParametersToEnv(result, ssmOptions.parameterBasePath);
    process.env.PARAM_CACHED = true;
};