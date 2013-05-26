var DataStore = require('../store/store').DataStore;

var db = new DataStore();

db.getUsers(function(err, results){
    console.log("users:");
    console.dir(results);
});