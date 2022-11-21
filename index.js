const SSM = require('./repository/ssm');

module.exports = async (options = {}) => {
    const ssmOptions = {
        parameterBasePath: opt.parameterBasePath || process.env.PARAM_PATH,
        region: opt.region || process.env.AWS_REGION
    };

    const ssm = new SSM(ssmOptions);
    const result = await ssm.loadParameters();
    SSM.loadParametersToEnv(result, ssmOptions.parameterBasePath);
    return result;
};