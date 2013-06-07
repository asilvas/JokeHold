var
    DataStore = require('../store').DataStore
;

exports.getOrCreateByPassport = function(profile, cb) {
    var db = new DataStore();
    db.userGetOrCreateByPassport(profile, cb);
};

exports.get = function(authId, cb) {
    var db = new DataStore();
    db.userGet(authId, cb);
};
