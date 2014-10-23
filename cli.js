#!/usr/bin/env node

var util = require('util'),
    kpe = require('./lib/KeePassEditor.js'),
    _ = require('underscore'),
    prompt = require('prompt'),
    argv = require('yargs')
        .count('verbose')
        .alias('v','verbose')
        .demand(['database'])
        .alias('d','database')
        .usage('$0 --database [path]')
        .argv;

prompt.message = '';
prompt.delimiter = '';

var openDb = function(db, pw){
    var obj = new kpe(db, pw);
    obj.on('open', function() {
        console.log('opened database');
        obj.getGroups(function(err, data){
            console.log('Groups:');
            _.each(data, function(i){
                console.log(' -%s',i);
            });
        });
    });
};

if(!argv.key) {
    prompt.start();
    prompt.colors = false;
    prompt.get([{
        name: 'password',
        description: 'Enter database password:',
        required: true,
        hidden: true,
        conform: function(value){
            return true;
        }
    }], function(err, results){
        if(err){
            console.err('error getting credentials');
            process.exit(1);
        }
        openDb(argv.database,results.password);
    });
}

