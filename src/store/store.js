var
    config = require("../config.json")
;

exports.DataStore = require("./" + config.store.driver + "/" + config.store.driver).DataStore;
