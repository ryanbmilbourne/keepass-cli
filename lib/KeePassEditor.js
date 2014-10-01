'use strict';

var kpio = require('keepass.io'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    _ = require('underscore');

/**
 * Accesses a KeePass database and provides methods to access or alter that database.
 * @constructor
 * @param {string} path - Path to KDBX file
 * @param {string} pass - Password credential
 * @param {string} key - Path to key file
 */
function KeePassEditor(path, pass, key) {
    if(!(this instanceof KeePassEditor)) {
        return new KeePassEditor(path, pass, key);
    }
    var self = this;
    this.db = new kpio.Database();
    this.rawDb = {};

    if(pass) { this.db.addCredential(new kpio.Credentials.Password(pass)); }
    if(key) { this.db.addCredential(new kpio.Credentials.Keyfile(key)); }

    this.db.loadFile(path, function(err, api) {
        if(err) { throw err; }
        self.rawDb = api.getRaw();
        self.emit('open');
    });
}

util.inherits(KeePassEditor, EventEmitter);

/**
 * Get the groups in the database
 * @param {callback} callback - Called with error or array of group names.
 */
KeePassEditor.prototype.getGroups = function(callback) {
    var self = this;
    var groups = [];
    _.each(self.rawDb.KeePassFile.Root.Group.Group, function(i) {
        groups.push(i.Name);
    });
    callback(null, groups);
};

/**
 * Get the entries associated with a group
 * @param {string} group - Group name to query
 * @param {callback} callback - Called with error or array of entry objects.
 */
KeePassEditor.prototype.getEntries = function(group, callback) {
    var res;
    if(group.toLowerCase() === 'root') {
        res = this.rawDb.KeePassFile.Root.Group;
    } else {
        res = _.findWhere(this.rawDb.KeePassFile.Root.Group.Group, { Name: group });
    }
    if(!res) { callback(new Error('no such group'), null); }
    else { callback(null, res); }
};

/**
 * Finds and returns an entry objec from the database.
 * @param {string} type - type of key to use.  url or title
 * @param {string} key - key to search on
 * @param {callback} callback - Called with error or array of entry objects.
 */
KeePassEditor.prototype.getEntry = function(type, key, callback) {
    if(type !== 'url' || type !== 'title') {
        callback(new Error('invalid key type'), null);
    }
    else {
        //todo
    }
};

module.exports = KeePassEditor;
