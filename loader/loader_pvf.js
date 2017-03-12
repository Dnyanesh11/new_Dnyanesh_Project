var pgOperations = require('./../helpers/pg_operations.js');


var csv = require('fast-csv');
var fs = require('fs');
var transform = require('./transform_pvf');
var async = require('async');
var config = require('./../config/config.js');


function loadPVFFile(filepath,fileName, callback) {
    console.time('start');
    var stream, count = 0, isStreamPaused = false;
    var noOfBatches = 0;
    var isCalledBack = false, q;
    var dataObj = {
        submittingHeaderPVF: [],
        contraRecordPVF: [],
        contractRecordPVF: [],
        contractValuationRecordPVF: [],
        contractUnderlyingAssetsRecordPVF: [],
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVF: [],
        contractAgentRecordPVF: [],
        contractDatesRecordPVF: [],
        contractEventsRecordPVF: [],
        contractPartyRecordPVF: [],
        contractPartyAddressRecordPVF: [],
        contractAnnuitizationPayoutRecordPVF: [],
        contractServiceFeatureRecordPVF: []
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
                        .on("data", function (data) {
                            count++;
                            if (count != 1) {
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


                            }
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

module.exports = {
    loadPVFFile :loadPVFFile
};


//loadPVFFile('/home/trustfort/Desktop/dev/dtcc_loader/junk/201606240244294735.PVF', function (err) {
//    console.log('err is----------->', err);
//})