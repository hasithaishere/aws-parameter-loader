const { SSMClient, GetParametersByPathCommand } = require("@aws-sdk/client-ssm");

class SSM {
    constructor(options) {
        this.parameterBasePath = options.parameterBasePath;
        this.client = new SSMClient({
            region: options.region || process.env.AWS_REGION
        });
    }

    async loadParameters(nextToken = null, parameters = []) {
        const input = {
            Path: this.parameterBasePath,
            WithDecryption: true,
            Recursive: true
        };

        if (nextToken !== null) {
            input.NextToken = nextToken;
        }

        const command = new GetParametersByPathCommand(input);
        const response = await this.client.send(command);

        parameters = parameters.concat(response.Parameters);

        if (response.NextToken) {
            return this.loadParameters(response.NextToken, parameters);
        }

        return parameters;
    }

    static loadParametersToEnv(parameters, parameterBasePath) {
        parameters.forEach(parameter => {
            const key = parameter.Name.replace(parameterBasePath, '');
            process.env[key] = parameter.Value;
        });
    }

    init() {
        return this.loadParameters();
    }
}

module.exports = SSM;