#!/usr/bin/env node

var util = require('util'),
    kpe = require('./lib/KeePassEditor.js'),
    _ = require('underscore'),
    argv = require('yargs')
        .count('verbose')
        .alias('v','verbose')
        .demand('database')
        .alias('d','database')
        .alias('p','pass')
        .argv;

if(!argv.pass && !argv.key) {
    console.log('Error: no credentials provided.');
    process.exit(1);
}

var dbPath = 'test.kdbx';

var obj = new kpe(argv.database, argv.pass);
obj.on('open', function() {
    console.log('opened database');
    obj.getEntries('banking',function(err, data) {
        if(err) { console.log(err); }
        else { console.log(util.inspect(data.Entry[0].String)); }
    }); 
});
