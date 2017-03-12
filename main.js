var checkFileType = require('./helpers/fileOperations.js');
var loadFARTypeFile = require('./loader/loader_far');
var loadPVFTypeFile = require('./loader/loader_pvf');

var testFolder = '/home/trustfort/Desktop/DTCC_with_modifications_new _logic/DTCC_Loader_Test/dtcc_loader/test_files';
var fs = require('fs');
var async = require('async');

function loadADTCCFile(filePath, callback) {
    checkFileType.checkingFilePathNExtension(filePath, function (err, extName, fileName) {
        console.log('start...');
        if (err) {
            callback(err);
        } else {
            if (extName == '.FAR') {
                loadFARTypeFile.loadFARFile(filePath, fileName, function (err) {
                    callback(err);

                });
            }
            else {
                loadPVFTypeFile.loadPVFFile(filePath, fileName, function (err) {
                    callback(err);
                })
            }

        }

    });
}


loadADTCCFile("/home/trustfort/Documents/Git Demo/4-1/FAR/P0555.AR02300790.D170103.C02 (1).mro", function (err) {
    console.log("err------------------>", err);


});

//--------------------------------------------------------------------------------
//function getFileNamesMain(testFolder, callback) {
//    var arrOfFilesName = [];
//    fs.readdir(testFolder, function (err, files) {
//        arrOfFilesName.push(files);
//        //console.log(typeof files,files);
//        callback(err, arrOfFilesName);
//
//    })
//}
//
//
//function main(testFolder, callback) {
//    var pathToLoadFile = [];
//    getFileNamesMain(testFolder, function (err, arr1) {
//
//        if (err) {
//            callback(err);
//        } else {
//            async.series([function (callback) {
//                for (var i = 0; i < arr1[0].length; i++) {
//                    //console.log('Here array content is',arr1[0][i]);
//                    pathToLoadFile[i] = '';
//                    pathToLoadFile[i] += testFolder + '/' + arr1[0][i];
//                    console.log('here it is', pathToLoadFile[i]);
//                }
//                callback(null);
//            }, function (callback) {
//                var count = 0;
//                var test = 2;
//                var result;
//
//                //Previos code
//                //for (var i = 0; i < test; i++) {
//
//                    //async.series([function (callback1) {
//                    //    console.log('Here', pathToLoadFile[i]);
//                    //    result = loadCall(pathToLoadFile[i]);
//                    //    if (result) {
//                    //        callback1(err);
//                    //    } else {
//                    //        callback1(null);
//                    //    }
//                    //    //callback1(null);
//                    //}, function (callback1) {
//                    //    console.log('ENd of file', count);
//                    //    callback1(null);
//                    //
//                    //}], function (err) {
//                    //    console.log('U R in ');
//                    //    count++;
//                    //    if (count === test) {
//                    //        console.log('In Internal callback');
//                    //        callback(null);
//                    //    }
//                    //})
//
//
//
//                    //loadCall(pathToLoadFile,count,function (err) {
//                    //    if(err){
//                    //        callback(err);
//                    //    } else {
//                    //        count++;
//                    //
//                    //
//                    //
//                    //        console.log('count is',count);
//                    //        loadCall(pathToLoadFile[count],pathToLoadFile,count,function(err){
//                    //            if(err){
//                    //                callback(err);
//                    //            } else {
//                    //                callback(null);
//                    //            }
//                    //        })
//                    //       // callback(null);
//                    //
//                    //        //if(count === pathToLoadFile.length ){
//                    //        //    callback(null);
//                    //        //}
//                    //    }
//                    //}); previus code
//
//                     var result = loadCall(pathToLoadFile,count);
//                      if(result){
//                          callback(null);
//                      } else {
//                          callback(err);
//                      }
//
//
//                //}previous code
//
//
//            }], function (err) {
//
//                console.log('Last Func');
//                callback(null)
//            })
//
//
//        }
//
//    });
//}
//
//main(testFolder, function (err) {
//    console.log(err);
//})
//
//
//function loadCall(filepath,count) {
//    loadADTCCFile(filepath[count], function (err) {   //Main  function call to load DTCC files
//        if (err) {
//           return 0;
//        } else {
//            count ++;
//            if(count === filepath.length){
//                return 1;
//            } else {
//                loadCall(filepath,count);
//            }
//
//        }
//    });
//}
//
//
