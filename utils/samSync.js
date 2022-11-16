const readline = require('readline');
const SSM = require('../repository/ssm');

const handleError = (error) => {
    console.log(error)
    const err = Object.assign({}, error, { message: error.message });
    console.log(JSON.stringify({ success: false, err }));
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', async (input) => {
    try {
        const [{ options, fn, parameters }] = JSON.parse(input);
        const ssm = new SSM(options);
        const result = await ssm[fn].apply(ssm, parameters)
        console.log(JSON.stringify({ success: true, result }));
    } catch (err) {
        handleError(err);
    } finally {
        rl.close();
    }
});