
const fs = require('fs');
const Octokit = require('@octokit/rest');
const commandLineArgs = require('command-line-args')

async function createDeployment(options) {
    options.required_contexts = [];
    let result = await octokit.repos.createDeployment(options)
    const id = result.data.id;
    console.log(id);
    
    console.log(result.status == 201 ? 'Done': 'Error');
    if(result.status != 201) {
        console.error(result);
        process.exit(1);
    }
}

async function createDeploymentStatus(options) {
    delete options.setstatus;
    delete options.ref;

    try {
        result = await octokit.repos.createDeploymentStatus(options)
        console.log(result.status == 201 ? 'Done' : 'Error');
        if (result.status != 201) {
            console.error(result);
            process.exit(1);
        }
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}

function main(options) {
    const octokit = Octokit({
        previews: ["ant-man-preview", "flash-preview"],
    });

    octokit.authenticate({
        type: 'token',
        token: process.env.GITHUB_TOKEN
    })

    if(options.setstatus) {
        createDeploymentStatus(options);
    } else {
        createDeployment(options);
    }
}


const optionDefinitions = [
    { name: 'setstatus', alias: 'f', type: Boolean },
    { name: 'owner', alias: 'o', type: String },
    { name: 'repo', alias: 'r', type: String },
    { name: 'ref', alias: 'c', type: String },
    { name: 'deployment_id', alias: 'i', type: Number },
    { name: 'state', alias: 's', type: String },
    { name: 'log_url', alias: 'l', type: String },
    { name: 'description', alias: 'd', type: String },
    { name: 'environment', alias: 'e', type: String },
    { name: 'environment_url', alias: 'u', type: String },
    { name: 'auto_inactive', type: Boolean },
    { name: 'payload', alias: 'p', type: String },
    { name: 'task', alias: 't', type: String },
]
const options = commandLineArgs(optionDefinitions)

main(options);

