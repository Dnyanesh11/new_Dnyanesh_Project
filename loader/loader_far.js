var pgOperations = require('./../helpers/pg_operations.js');
var csv = require('fast-csv');
var fs = require('fs');
var transform = require('./transform_far');
var async = require('async');
var config = require('./../config/config.js');
var _ = require('underscore');

function loadFARFile(filepath,fileName, callback) {
    console.time('start');
    var stream, count = 0, isStreamPaused = false;
    var testString = '';
    var noOfBatches = 0;
    var isCalledBack = false, q;
    var dataObj = {
        submittingHeader: [],
        contraHeader: [],
        contractRecord: [],
        contractEntityRecord: [],
        contractEntityAddressRecord: [],
        contractAgentRecord: [],
        contractTransactionRecord: [],
        contractUnderlyingAssetsRecord: [],
        contractPayeePayorRecord: [],
        contractPayeePayorPaymentDetailsRecord: [],
        contractPayeePayorAddressRecord: []
    };


    pgOperations.connectToPosatgres(function (err, client) {
        if (err) {
            callback(err);
        } else {
            pgOperations.beginATransaction(client, function (err) {
                if (err) {
                    callback(err);
                } else {

                    q = async.queue(function (input, queueCallback) {
                        transform.transformAndInsertIntoRespectiveTable(input.data, client,fileName, function (err) {

                            if (err) {
                                if (!isCalledBack) {
                                    isCalledBack = true;
                                    stream.destroy();
                                    q.tasks = [];
                                    client.end();
                                    return callback(err);
                                }
                            } else {
                                queueCallback(null);

                                if (isStreamPaused && q.idle()) {
                                    noOfBatches = 0;
                                    stream.resume();
                                    isStreamPaused = false;
                                }
                            }
                        });
                    }, 10);

                    stream = fs.createReadStream(filepath, {highWaterMark: 1});
                    csv
                        .fromStream(stream, {ignoreEmpty: true})
                        .validate(function (data) {
                            testString = _.values(data);
                            //console.log( testString[0]);
                            testString = testString[0].substr(0, 6);
                            if (testString == '1TRANS') {
                                //console.log('Here U are');
                                return false;
                            } else {
                                //console.log('In else...');
                                return true;
                            }
                        })
                        .on("data", function (data) {
                            count++;
                           // if (count != 1) {
                                transform.pushIntoRespectiveArrays(dataObj, data[0]);
                                if (count >= config.batchsize) {

                                    q.push({data: transform.cloneTheObj(dataObj)});
                                    transform.emptyTheObject(dataObj);
                                    count = 0;
                                    noOfBatches++;
                                    if (noOfBatches == config.noOfBatches) {
                                        stream.pause();
                                        isStreamPaused = true;
                                    }
                                }


                            //}
                        }).on('end', function () {
                            if (!transform.isEmpty(dataObj)) {
                                q.push({data: transform.cloneTheObj(dataObj)});
                                q.drain = function () {
                                    pgOperations.commitATransaction(client, function (err) {
                                        console.timeEnd('start');
                                        callback(err);
                                        client.end();
                                    });
                                }
                            } else if (q.idle()) {
                                pgOperations.commitATransaction(client, function (err) {
                                    console.timeEnd('start');
                                    callback(err);
                                    client.end();
                                });
                            } else {
                                q.drain = function () {
                                    pgOperations.commitATransaction(client, function (err) {
                                        console.timeEnd('start');
                                        callback(err);
                                        client.end();
                                    });
                                }
                            }
                        })
                }

            });
        }
    });
}

//loadFARFile('/home/trustfort/Desktop/dev/dtcc_loader/junk/BackUP/201606241006296455.FAR', function (err) {
//    console.log('------------>', err);
//});

module.exports = {
    loadFARFile: loadFARFile
};