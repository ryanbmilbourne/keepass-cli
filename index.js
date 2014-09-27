#!/usr/bin/env node

var kpio = require('keepass.io'),
    util = require('util'),
    _ = require('underscore'),
    argv = require('yargs')
        .count('verbose')
        .alias('v','verbose')
        .argv;


var dbPath = 'test.kdbx';
var db = new kpio.Database();

/**
 * Gets the group listing from a kdbx database. Index of name matches index in group array.
 * @param {obj} db - raw database to hit (from keepass.io:api.getRaw())
 * @param {callback} callback - Function to call upon completion
 */
var getGroups = function(db, callback) {
    var groups = [];
    _.each(db.KeePassFile.Root.Group.Group, function(i) {
        groups.push(i.Name);
    });
    callback(null, groups);
};

db.addCredential(new kpio.Credentials.Password(argv.pass));

db.loadFile(dbPath, function(err, api) {
    if(err) {
        console.log('error! '+err);
        process.exit(1);
    }

    var rawDatabase = api.getRaw();
    //console.log(util.inspect(rawDatabase.KeePassFile.Root.Group));

    getGroups(rawDatabase, function(err, groups) {
        if(err) {console.log('error retrieving groups');}
        else {console.log(groups);}
    });


    //view String of each entry in Root
    _.each(rawDatabase.KeePassFile.Root.Group.Entry, function(entry) {
        console.log(util.inspect(entry.String)+'\n');
    });
});
