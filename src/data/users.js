var
    DataStore = require('./store').DataStore
;

exports.getOrCreateByPassport = function(profile, cb) {
    var db = new DataStore();
    db.userGetOrCreateByPassport(profile, cb);
}

exports.getByAuth = function(authId, cb) {
    var db = new DataStore();
    db.userGetByAuth(authId, cb);
}
