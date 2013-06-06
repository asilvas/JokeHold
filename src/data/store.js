var
    config = require("../config.json")
;

exports.DataStore = require("./" + config.store.driver + "/store").DataStore;
