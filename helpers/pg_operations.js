var pg = require('pg');
var config = require("./../config/config.js");
var transform = require("./pg_operations.js");

function connectToPostgres(callback) {
    var retObj = {};
    var client = new pg.Client(config.pgConnectionString);
    client.connect(function (err) {
        if (err) {
            retObj.status = "error";
            retObj.message = "Error occurred while connecting to the database";
            retObj.connectionString = connectionString;
            callback(retObj);
        } else {
            callback(null, client);
        }
    });
}
function beginATransaction(pgClient, callback) {
    var retObj = {};
    pgClient.query("BEGIN", function (err) {
        if (err) {
            retObj.status = 'error';
            retObj.message = 'error in to BEGIN transaction';
            retObj.error = err;
            callback(retObj);
        } else {
            callback(null);
        }
    });
}

function insertIntoATable(inputString,tableName,columnNames,client,callback) {
     //console.log('Its----------------->',inputString);
    //console.log('--->>>>>>>>>>>>',tableName);
    var query = 'INSERT INTO ' + tableName + columnNames + 'VALUES ' + inputString;
    if(!inputString) {
        return callback(null);
    }

    client.query(query, function (err) {
        callback(err);
    });
}

function singleInsertOperation(insertData,client,callback) {
    insertIntoATable(insertData.inputString,insertData.tableName,insertData.columnNames,client,function(err){
        var retObj = {};
        if(err){
            retObj.status = 'error';
            retObj.mesasge = 'error while inserting';
            retObj.insertData = insertData.inputString;
            callback(retObj);

        } else {
            callback(null);
        }
    });
}


function commitATransaction (pgClient, callback) {
    var retObj = {};
    pgClient.query('COMMIT', function (err) {
        if (err) {
            retObj.status = 'error';
            retObj.message = 'Error while committing the transaction';
            retObj.error = err;
            callback(retObj);
        } else {
            callback(null);
        }
    });
}





module.exports = {
    connectToPosatgres: connectToPostgres,
    beginATransaction: beginATransaction,
    insertIntoATable : insertIntoATable,
    singleInsertOperation:singleInsertOperation,
    commitATransaction: commitATransaction
};