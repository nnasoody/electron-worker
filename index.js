#!/usr/bin/env node

var path      = require('path');
var prompt    = require('prompt');
var fs        = require('fs');
var mkdirp    = require('mkdirp');
var directory = process.cwd();

// ------------
// Globals
// ------------

var componentName;

// ------------
// Functions
// ------------

function onErr(err) {
    console.log(err);
    return 1;
}

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}

function write(componentName) {
    // check if component already exists in current directory
    if (fs.existsSync(componentName)) {
        console.error('Component: ' + componentName + ' already exists, aborting!');
        return;
    }
    mkdirp.sync(componentName);
    writeFile('comm.js', componentName);
    writeFile('index.html', componentName);
    writeFile('script.js', componentName);
    writeFile('index.js', componentName);                        
}

function writeFile(filename, componentName) {
    var template  = fs.readFileSync(path.resolve(__dirname, 'template', filename), 'utf8');        
    template = template.replace(/{{process}}/g, componentName);
    template = template.replace(/{{PROCESS}}/g, capitalize(componentName));    
    fs.writeFileSync(path.resolve(componentName + '/' + filename), template);
}

function main() {
    var schema = {
        properties: {
            name : {
                description: 'What would you like to name your worker module?',
                type: 'string',
                pattern: /^[$A-Z_][0-9A-Z_$]*$/i,
                message: 'Name must start with a letter and have no spaces.',
                default: 'Component',
                required: true
            },
        }
    };

    prompt.start();
    prompt.get(schema, function (err, result) {
        if (err) { return onErr(err) }
        componentName = result.name;
        write(componentName);
    });    
};

// ------------
// Module
// ------------

module.exports = main();
