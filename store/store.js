var
    config = require("../config.json")
;

exports.DataStore = DataStore;

function DataStore() {
    var driver = new (require("./null/null").DataStore)();

    switch (config.store.driver){
        case "azure":
            driver = new (require("./azure/azure").DataStore)();
            break;
    }
}

