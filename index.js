const SSM = require('./repository/ssm');

module.exports = async (options = {}) => {
    const options = {
        parameterBasePath: opt.parameterBasePath || process.env.PARAM_PATH,
        region: opt.region || process.env.AWS_REGION
    };

    const ssm = new SSM(options);
    const result = await ssm.loadParameters();
    SSM.loadParametersToEnv(result, options.parameterBasePath);
    return result;
};