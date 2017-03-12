var path = require('path');
var fs = require('fs');
var csv = require('fast-csv');
//function checkingFilePathNExtension(filepath, callback) {
//    var retObj = {};
//    //var extensionName;
//    var newFileName = '';
//    if (!filepath) {
//        retObj.status = 'error';
//        retObj.mesasge = 'Please provide valid file path';
//        retObj.filepath = filepath;
//        callback(retObj);
//    } else {
//        fs.access(filepath, fs.R_Ok, function (err) {
//            if (err) {
//                retObj.status = 'error';
//                retObj.mesasge = 'Please provide read permissions for the given file path or may be it doesn\'t exists';
//                retObj.filepath = filepath;
//                callback(retObj);
//            } else {
//                extensionName = path.extname(filepath);
//                //newFileName =
//                callback(null, extensionName);
//            }
//        });
//    }
//}

function checkingFilePathNExtension(filepath, callback) {
    var stream;
    var count = 0;
    var firstRow = '';
    var stringOfFirstRow = '';
    var extensionName = '';
    var retObj = {};
    var fileName = '';

    fileName = path.basename(filepath);
    stream = fs.createReadStream(filepath, {highWaterMark: 1});
    csv
        .fromStream(stream)
        .on("data", function (data) {
            count++;
            if (count == 1) {
                //console.log('***');
                firstRow = data;
                stream.destroy();
                stringOfFirstRow = firstRow.toString();
                if (stringOfFirstRow.search('FAR') != -1 || stringOfFirstRow.search('PVF') != -1) {
                    if (stringOfFirstRow.search('FAR') != -1) {
                        extensionName = '.FAR';
                    } else {
                        extensionName = '.PVF'
                    }
                } else {
                    extensionName = 'Not a DTCC File'
                }
                if(extensionName == '.PVF' || extensionName == '.FAR'){
                    callback(null,extensionName,fileName);
                } else{
                    retObj.status = 'error';
                    retObj.mesasge = 'File is not DTCC File';
                    retObj.filepath = filepath;
                    callback(retObj);
                }

            }
        })
}


module.exports = {
    checkingFilePathNExtension: checkingFilePathNExtension
};