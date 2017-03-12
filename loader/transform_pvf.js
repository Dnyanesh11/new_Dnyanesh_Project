var pgOperations = require('./../helpers/pg_operations');
var config  = require('./../config/config.js');
var async = require('async');
var _ = require('underscore');
var helper = require('./../helpers/replace_function.js')


var tableInfo = config.tableInfo;
var emptyString = '';

function transformAndInsertIntoRespectiveTable(dataToInsertObj, client, insertCallback) {

    var dataToInsertStringObj = transformAllDataArrays(dataToInsertObj);
    var keys = Object.keys(dataToInsertStringObj);
    console.log(keys);
    async.map(keys, function (eachKey, asyncMapCallback) {
        //console.log("------>",tableInfo[eachKey].tableName);
        pgOperations.insertIntoATable(dataToInsertStringObj[eachKey], tableInfo[eachKey].tableName, tableInfo[eachKey].columnNames, client, function (err) {
            asyncMapCallback(err);
        });
    }, function (err) {
        insertCallback(err);
    });
}

function pushIntoRespectiveArrays(dataObj, rawData) {

    var recordType, sequenceNo;
    recordType = rawData.substr(1, 2);
    if (recordType === '10') {
        dataObj.submittingHeaderPVF.push(rawData);
    } else if (recordType === '12') {
        dataObj.contraRecordPVF.push(rawData);
    } else if (recordType === '13') {
        sequenceNo = rawData.substr(3, 2);

        if (sequenceNo === '01') {
            dataObj.contractRecordPVF.push(rawData);
        } else if (sequenceNo === '02') {
            dataObj.contractValuationRecordPVF.push(rawData);
        } else if (sequenceNo === '03') {
            dataObj.contractUnderlyingAssetsRecordPVF.push(rawData);
        } else if (sequenceNo === '04') {
            dataObj.contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVF.push(rawData);
        } else if (sequenceNo === '05') {
            dataObj.contractAgentRecordPVF.push(rawData);
        } else if (sequenceNo === '06') {
            dataObj.contractDatesRecordPVF.push(rawData);
        } else if (sequenceNo === '07') {
            dataObj.contractEventsRecordPVF.push(rawData);
        } else if (sequenceNo === '09') {
            dataObj.contractPartyRecordPVF.push(rawData);
        } else if (sequenceNo === '10') {
            dataObj.contractPartyAddressRecordPVF.push(rawData);
        } else if (sequenceNo === '11') {
            dataObj.contractAnnuitizationPayoutRecordPVF.push(rawData);
        } else if (sequenceNo === '15') {
            dataObj.contractServiceFeatureRecordPVF.push(rawData)
        }
    }
}

function cloneTheObj(dataObj) {
    var prop, cloneObj = {};
    for (prop in dataObj) {
        cloneObj[prop] = dataObj[prop].slice();
    }

    return cloneObj;
}
function emptyTheObject(dataObj) {
    var prop, isEmpty = true;
    for (prop in dataObj) {
        if (dataObj[prop].length) {
            isEmpty = false;
        }
        dataObj[prop] = [];
    }
}

function isEmpty(dataObj) {
    var prop, isEmpty = true;
    for (prop in dataObj) {
        if (dataObj[prop].length) {
            isEmpty = false;
        }
    }

    return isEmpty;
}
function transformAndInsertIntoRespectiveTable(dataToInsertObj, client,fileName, insertCallback) {
   // console.log('Here');
    var dataToInsertStringObj = transformAllDataArrays(dataToInsertObj,fileName);
    var keys = Object.keys(dataToInsertStringObj);
   // console.log("Keysare-------> ",keys);
    async.map(keys, function (eachKey, asyncMapCallback) {
        //console.log("------>",tableInfo[eachKey].tableName);
       // console.log('>>>>',dataToInsertStringObj[eachKey])
        pgOperations.insertIntoATable(dataToInsertStringObj[eachKey], tableInfo[eachKey].tableName, tableInfo[eachKey].columnNames, client, function (err) {
            asyncMapCallback(err);
        });
    }, function (err) {
        insertCallback(err);
    });
}

function transformAllDataArrays(dataToInsertObj,fileName) {
    var dataToInsertStringObj = {};
    var prop;

    for (prop in dataToInsertObj) {
        if (!dataToInsertObj[prop].length) {
            dataToInsertStringObj[prop] = emptyString;
        } else {
            dataToInsertStringObj[prop] = eval(prop + 'Transform')(dataToInsertObj[prop],fileName);
        }
    }

    return dataToInsertStringObj;
}


function submittingHeaderPVFTransform(inputArray,fileName) {
    var submittingHeaderPVFObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {

        submittingHeaderPVFObj.vchSubmittersCode = (inputArray[i]).substr(0, 1);
        submittingHeaderPVFObj.vchRecordType = (inputArray[i].substr(1, 2));
        submittingHeaderPVFObj.vchSubmittingParticipantNumber = (inputArray[i].substr(3, 4));
        submittingHeaderPVFObj.vchIPSBusinessCode = (inputArray[i].substr(7, 3));
        submittingHeaderPVFObj.vchTransmissionUniqueID = (inputArray[i].substr(10, 30));
        submittingHeaderPVFObj.vchTotalCount = (inputArray[i].substr(40, 12));
        submittingHeaderPVFObj.vchValuationDate = (inputArray[i].substr(52, 8));
        submittingHeaderPVFObj.vchTestIndicator = (inputArray[i].substr(60, 1));
        submittingHeaderPVFObj.vchAssociatedCarrierCompanyID = (inputArray[i].substr(61, 10));
        submittingHeaderPVFObj.vchFiller1 = (inputArray[i].substr(71, 217));
        submittingHeaderPVFObj.vchRejectCode = (inputArray[i].substr(288, 12));

        submittingHeaderPVFObj = helper.replaceFunction(submittingHeaderPVFObj);
        submittingHeaderPVFObj.bIsProcessed = false;
        submittingHeaderPVFObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        submittingHeaderPVFObj.vchAdvisorLabel = config.vchAdvisorLabel;
        submittingHeaderPVFObj.vchFileName = fileName;
        submittingHeaderPVFObj.bFetch = false;
        finalDataString += "('" + ((_.values(submittingHeaderPVFObj)).join("','")) + "'),";
    }

    return finalDataString.substr(0, finalDataString.length - 1);

}

function contraRecordPVFTransform(inputArray,fileName) {
    var contraRecordPVFObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contraRecordPVFObj.vchSubmittersCode = (inputArray[i].substr(0, 1));
        contraRecordPVFObj.vchRecordType = (inputArray[i].substr(1, 2));
        contraRecordPVFObj.vchContraParticipantNumber = (inputArray[i].substr(3, 4));
        contraRecordPVFObj.vchAssociatedFirmID = (inputArray[i].substr(7, 4));
        contraRecordPVFObj.vchAssociatedFirmSubmittedContractCount = (inputArray[i].substr(11, 10));
        contraRecordPVFObj.vchAssociatedFirmDeliveredContractCount = (inputArray[i].substr(21, 10));
        contraRecordPVFObj.vchIPSEventCode = (inputArray[i].substr(31, 3));
        contraRecordPVFObj.vchIPSStageCode = (inputArray[i].substr(34, 3));
        contraRecordPVFObj.vchFiller1 = (inputArray[i].substr(37, 251));
        contraRecordPVFObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contraRecordPVFObj = helper.replaceFunction(contraRecordPVFObj);
        contraRecordPVFObj.bIsProcessed = false;
        contraRecordPVFObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contraRecordPVFObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contraRecordPVFObj.vchFileName = fileName;
        contraRecordPVFObj.bFetch = false;


        finalDataString += "('" + ((_.values(contraRecordPVFObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);
}


function contractRecordPVFTransform(inputArray,fileName) {
    var contractRecordPVFObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractRecordPVFObj.vchSubmittersCode = (inputArray[i].substr(0, 1));
        contractRecordPVFObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractRecordPVFObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractRecordPVFObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractRecordPVFObj.vchCUSIPNumber = (inputArray[i].substr(35, 9));
        contractRecordPVFObj.vchContractStatus = (inputArray[i].substr(44, 2));
        contractRecordPVFObj.vchEndReceivingCompanyID = (inputArray[i].substr(46, 20));
        contractRecordPVFObj.vchEndReceivingCompanyIDQualifier = (inputArray[i].substr(66, 2));
        contractRecordPVFObj.vchGroupNumber = (inputArray[i].substr(68, 30));
        contractRecordPVFObj.vchOriginalContractNumber = (inputArray[i].substr(98, 30));
        contractRecordPVFObj.vchDistributorsAccountID = (inputArray[i].substr(128, 30));
        contractRecordPVFObj.vchIRSQualificationCode = (inputArray[i].substr(158, 4));
        contractRecordPVFObj.vchProductTypeCode = (inputArray[i].substr(162, 3));
        contractRecordPVFObj.vchCommissionOption = (inputArray[i].substr(165, 4));
        contractRecordPVFObj.vchFiller1 = (inputArray[i].substr(169, 6));
        contractRecordPVFObj.vchCommissionExtension = (inputArray[i].substr(175, 10));
        contractRecordPVFObj.vchERISAIndicator = (inputArray[i].substr(185, 1));
        contractRecordPVFObj.vchContractState = (inputArray[i].substr(186, 2));
        contractRecordPVFObj.vchFundTransfersRestrictionIndicator = (inputArray[i].substr(188, 1));
        contractRecordPVFObj.vchFundTransfersRestrictionReason = (inputArray[i].substr(189, 2));
        contractRecordPVFObj.vchNon_AssignibilityIndicator = (inputArray[i].substr(191, 1));
        contractRecordPVFObj.vchLifeTermDuration = (inputArray[i].substr(192, 2));
        contractRecordPVFObj.vchDividendOption = (inputArray[i].substr(194, 2));
        contractRecordPVFObj.vchQLACIndicator = (inputArray[i].substr(196, 1));
        contractRecordPVFObj.vchFiller2 = (inputArray[i].substr(197, 91));
        contractRecordPVFObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractRecordPVFObj = helper.replaceFunction(contractRecordPVFObj);
        contractRecordPVFObj.bIsProcessed = false;
        contractRecordPVFObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractRecordPVFObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractRecordPVFObj.vchFileName = fileName;
        contractRecordPVFObj.bFetch = false;


        finalDataString += "('" + ((_.values(contractRecordPVFObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);
}

function contractValuationRecordPVFTransform(inputArray,fileName) {
    var contractValuationRecordPVFObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractValuationRecordPVFObj.vchSubmittersCode = (inputArray[i].substr(0, 1));
        contractValuationRecordPVFObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractValuationRecordPVFObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractValuationRecordPVFObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractValuationRecordPVFObj.vchContractValueAmount_1 = (inputArray[i].substr(35, 16));
        contractValuationRecordPVFObj.vchContractValueQualifier_1 = (inputArray[i].substr(51, 3));
        contractValuationRecordPVFObj.vchFiller1 = (inputArray[i].substr(54, 1));
        contractValuationRecordPVFObj.vchContractValueAmount_2 = (inputArray[i].substr(55, 16));
        contractValuationRecordPVFObj.vchContractValueQualifier_2 = (inputArray[i].substr(71, 3));
        contractValuationRecordPVFObj.vchFiller2 = (inputArray[i].substr(74, 1));
        contractValuationRecordPVFObj.vchContractValueAmount_3 = (inputArray[i].substr(75, 16));
        contractValuationRecordPVFObj.vchContractValueQualifier_3 = (inputArray[i].substr(91, 3));
        contractValuationRecordPVFObj.vchFiller3 = (inputArray[i].substr(94, 1));
        contractValuationRecordPVFObj.vchContractValueAmount_4 = (inputArray[i].substr(95, 16));
        contractValuationRecordPVFObj.vchContractValueQualifier_4 = (inputArray[i].substr(111, 3));
        contractValuationRecordPVFObj.vchFiller4 = (inputArray[i].substr(114, 1));
        contractValuationRecordPVFObj.vchContractValueAmount_5 = (inputArray[i].substr(115, 16));
        contractValuationRecordPVFObj.vchContractValueQualifier_5 = (inputArray[i].substr(131, 3));
        contractValuationRecordPVFObj.vchFiller5 = (inputArray[i].substr(134, 1));
        contractValuationRecordPVFObj.vchContractPercentageAmount_1 = (inputArray[i].substr(135, 10));
        contractValuationRecordPVFObj.vchContractPercentageAmountQualifier_1 = (inputArray[i].substr(145, 3));
        contractValuationRecordPVFObj.vchFiller6 = (inputArray[i].substr(148, 1));
        contractValuationRecordPVFObj.vchContractPercentageAmount_2 = (inputArray[i].substr(149, 10));
        contractValuationRecordPVFObj.vchContractPercentageAmountQualifier_2 = (inputArray[i].substr(159, 3));
        contractValuationRecordPVFObj.vchFiller7 = (inputArray[i].substr(162, 1));
        contractValuationRecordPVFObj.vchContractPercentageAmount_3 = (inputArray[i].substr(163, 10));
        contractValuationRecordPVFObj.vchContractPercentageAmountQualifier_3 = (inputArray[i].substr(173, 3));
        contractValuationRecordPVFObj.vchFiller8 = (inputArray[i].substr(176, 112));
        contractValuationRecordPVFObj.vchRejectCodeList = (inputArray[i].substr(288, 12));

        contractValuationRecordPVFObj = helper.replaceFunction(contractValuationRecordPVFObj);
        contractValuationRecordPVFObj.bIsProcessed = false;
        contractValuationRecordPVFObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractValuationRecordPVFObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractValuationRecordPVFObj.vchFileName = fileName;
        contractValuationRecordPVFObj.bFetch = false;

        finalDataString += "('" + ((_.values(contractValuationRecordPVFObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);

}

function contractUnderlyingAssetsRecordPVFTransform(inputArray,fileName) {
    var contractUnderlyingAssetsRecordPVFObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractUnderlyingAssetsRecordPVFObj.vchSubmittersCode = (inputArray[i].substr(0, 1));
        contractUnderlyingAssetsRecordPVFObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractUnderlyingAssetsRecordPVFObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractUnderlyingAssetsRecordPVFObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractUnderlyingAssetsRecordPVFObj.vchCUSIP_FundID_SubFundID = (inputArray[i].substr(35, 19));
        contractUnderlyingAssetsRecordPVFObj.vchFundValue = (inputArray[i].substr(54, 16));
        contractUnderlyingAssetsRecordPVFObj.vchFundPercentage = (inputArray[i].substr(70, 10));
        contractUnderlyingAssetsRecordPVFObj.vchFundUnits = (inputArray[i].substr(80, 18));
        contractUnderlyingAssetsRecordPVFObj.vchFundGuaranteedInterestRate = (inputArray[i].substr(98, 10));
        contractUnderlyingAssetsRecordPVFObj.vchFund_UnderlyingSecurityName = (inputArray[i].substr(108, 40));
        contractUnderlyingAssetsRecordPVFObj.vchFund_UnderlyingSecurityType = (inputArray[i].substr(148, 3));
        contractUnderlyingAssetsRecordPVFObj.vchMutualFundCUSIPNumber = (inputArray[i].substr(151, 9));
        contractUnderlyingAssetsRecordPVFObj.vchFundLevelRestrictionIndicator = (inputArray[i].substr(160, 1));
        contractUnderlyingAssetsRecordPVFObj.vchFundLevelRestrictionReason = (inputArray[i].substr(161, 1));
        contractUnderlyingAssetsRecordPVFObj.vchStandingAllocationIndicator = (inputArray[i].substr(162, 1));
        contractUnderlyingAssetsRecordPVFObj.vchStandingAllocationPercentage = (inputArray[i].substr(163, 10));
        contractUnderlyingAssetsRecordPVFObj.vchmaturityelectioninstructions = (inputArray[i].substr(173, 2));
        contractUnderlyingAssetsRecordPVFObj.vchRate_FundThresholdPercentage = (inputArray[i].substr(175, 10));
        contractUnderlyingAssetsRecordPVFObj.vchFiller1 = (inputArray[i].substr(185, 103));
        contractUnderlyingAssetsRecordPVFObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractUnderlyingAssetsRecordPVFObj = helper.replaceFunction(contractUnderlyingAssetsRecordPVFObj);
        contractUnderlyingAssetsRecordPVFObj = helper.insertDecimalValuescontractUnderlyingAssetsRecordPVF(contractUnderlyingAssetsRecordPVFObj);
        contractUnderlyingAssetsRecordPVFObj.bIsProcessed = false;
        contractUnderlyingAssetsRecordPVFObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractUnderlyingAssetsRecordPVFObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractUnderlyingAssetsRecordPVFObj.vchFileName = fileName;
        contractUnderlyingAssetsRecordPVFObj.bFetch = false;

        finalDataString += "('" + ((_.values(contractUnderlyingAssetsRecordPVFObj)).join("','")) + "'),";

    }
    return finalDataString.substr(0, finalDataString.length - 1);
}

function contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFTransform(inputArray,fileName) {
    var contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchSubmittersCode = (inputArray[i].substr(0, 1));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchCUSIP_FundID = (inputArray[i].substr(35, 19));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedStartDate = (inputArray[i].substr(54, 8));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedEndDate = (inputArray[i].substr(62, 8));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedMaturityDate = (inputArray[i].substr(70, 8));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedRate_1 = (inputArray[i].substr(78, 10));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedRateType_1 = (inputArray[i].substr(88, 2));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedUnits = (inputArray[i].substr(90, 18));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedPeriodFrequencyCode = (inputArray[i].substr(108, 2));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedPeriodNumber = (inputArray[i].substr(110, 10));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDepositGuaranteeValue = (inputArray[i].substr(120, 16));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedRate_2 = (inputArray[i].substr(136, 10));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedRateType_2 = (inputArray[i].substr(146, 2));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedRate_3 = (inputArray[i].substr(148, 10));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedRateType_3 = (inputArray[i].substr(158, 2));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedRate_4 = (inputArray[i].substr(160, 10));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedRateType_4 = (inputArray[i].substr(170, 2));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedRate_5 = (inputArray[i].substr(172, 10));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedRateType_5 = (inputArray[i].substr(182, 2));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedRate_6 = (inputArray[i].substr(184, 10));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchDeposit_GuaranteedRateType_6 = (inputArray[i].substr(194, 2));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchFiller1 = (inputArray[i].substr(196, 92));
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj = helper.replaceFunction(contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj);
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj = helper.insertDecimalValuescontractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVF(contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj);
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.bIsProcessed = false;
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.vchFileName = fileName;
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj.bFetch = false;


        finalDataString += "('" + ((_.values(contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVFObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);
}


function contractAgentRecordPVFTransform(inputArray,fileName) {
    var contractAgentRecordPVFObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractAgentRecordPVFObj.vchSubmittersCode = (inputArray[i].substr(0, 1));
        contractAgentRecordPVFObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractAgentRecordPVFObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractAgentRecordPVFObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractAgentRecordPVFObj.vchAgentTaxID = (inputArray[i].substr(35, 20));
        contractAgentRecordPVFObj.vchAgentTaxIDQualifier = (inputArray[i].substr(55, 2));
        contractAgentRecordPVFObj.vchAgentRole = (inputArray[i].substr(57, 2));
        contractAgentRecordPVFObj.vchAgentLastName = (inputArray[i].substr(59, 35));
        contractAgentRecordPVFObj.vchAgentFirstName = (inputArray[i].substr(94, 25));
        contractAgentRecordPVFObj.vchAgentMiddleName = (inputArray[i].substr(119, 25));
        contractAgentRecordPVFObj.vchAgentPrefix = (inputArray[i].substr(144, 10));
        contractAgentRecordPVFObj.vchAgentSuffix = (inputArray[i].substr(154, 10));
        contractAgentRecordPVFObj.vchBrokersAgentID = (inputArray[i].substr(164, 20));
        contractAgentRecordPVFObj.vchAgentNatural_Non_Natural = (inputArray[i].substr(184, 1));
        contractAgentRecordPVFObj.vchNationalProducerNumber = (inputArray[i].substr(185, 10));
        contractAgentRecordPVFObj.vchFundTransferAgentAuthorizationIndicator = (inputArray[i].substr(195, 1));
        contractAgentRecordPVFObj.vchFiller1 = (inputArray[i].substr(196, 92));
        contractAgentRecordPVFObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractAgentRecordPVFObj = helper.replaceFunction(contractAgentRecordPVFObj);
        contractAgentRecordPVFObj.bIsProcessed = false;
        contractAgentRecordPVFObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractAgentRecordPVFObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractAgentRecordPVFObj.vchFileName = fileName;
        contractAgentRecordPVFObj.bFetch = false;


        finalDataString += "('" + ((_.values(contractAgentRecordPVFObj)).join("','")) + "'),";

    }
    return finalDataString.substr(0, finalDataString.length - 1);
}

function contractDatesRecordPVFTransform(inputArray,fileName) {
    var contractDatesRecordPVFObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractDatesRecordPVFObj.vchSubmittersCode = (inputArray[i].substr(0, 1));
        contractDatesRecordPVFObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractDatesRecordPVFObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractDatesRecordPVFObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractDatesRecordPVFObj.vchContractDate_1 = (inputArray[i].substr(35, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_1 = (inputArray[i].substr(43, 3));
        contractDatesRecordPVFObj.vchFiller1 = (inputArray[i].substr(46, 1));
        contractDatesRecordPVFObj.vchContractDate_2 = (inputArray[i].substr(47, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_2 = (inputArray[i].substr(55, 3));
        contractDatesRecordPVFObj.vchFiller2 = (inputArray[i].substr(58, 1));
        contractDatesRecordPVFObj.vchContractDate_3 = (inputArray[i].substr(59, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_3 = (inputArray[i].substr(67, 3));
        contractDatesRecordPVFObj.vchFiller3 = (inputArray[i].substr(70, 1));
        contractDatesRecordPVFObj.vchContractDate_4 = (inputArray[i].substr(71, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_4 = (inputArray[i].substr(79, 3));
        contractDatesRecordPVFObj.vchFiller4 = (inputArray[i].substr(82, 1));
        contractDatesRecordPVFObj.vchContractDate_5 = (inputArray[i].substr(83, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_5 = (inputArray[i].substr(91, 3));
        contractDatesRecordPVFObj.vchFiller5 = (inputArray[i].substr(94, 1));
        contractDatesRecordPVFObj.vchContractDate_6 = (inputArray[i].substr(95, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_6 = (inputArray[i].substr(103, 3));
        contractDatesRecordPVFObj.vchFiller6 = (inputArray[i].substr(106, 1));
        contractDatesRecordPVFObj.vchContractDate_7 = (inputArray[i].substr(107, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_7 = (inputArray[i].substr(115, 3));
        contractDatesRecordPVFObj.vchFiller7 = (inputArray[i].substr(118, 1));
        contractDatesRecordPVFObj.vchContractDate_8 = (inputArray[i].substr(119, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_8 = (inputArray[i].substr(127, 3));
        contractDatesRecordPVFObj.vchFiller8 = (inputArray[i].substr(130, 1));
        contractDatesRecordPVFObj.vchContractDate_9 = (inputArray[i].substr(131, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_9 = (inputArray[i].substr(139, 3));
        contractDatesRecordPVFObj.vchFiller9 = (inputArray[i].substr(142, 1));
        contractDatesRecordPVFObj.vchContractDate_10 = (inputArray[i].substr(143, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_10 = (inputArray[i].substr(151, 3));
        contractDatesRecordPVFObj.vchFiller10 = (inputArray[i].substr(154, 1));
        contractDatesRecordPVFObj.vchContractDate_11 = (inputArray[i].substr(155, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_11 = (inputArray[i].substr(163, 3));
        contractDatesRecordPVFObj.vchFiller11 = (inputArray[i].substr(166, 1));
        contractDatesRecordPVFObj.vchContractDate_12 = (inputArray[i].substr(167, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_12 = (inputArray[i].substr(175, 3));
        contractDatesRecordPVFObj.vchFiller12 = (inputArray[i].substr(178, 1));
        contractDatesRecordPVFObj.vchContractDate_13 = (inputArray[i].substr(179, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_13 = (inputArray[i].substr(187, 3));
        contractDatesRecordPVFObj.vchFiller13 = (inputArray[i].substr(190, 1));
        contractDatesRecordPVFObj.vchContractDate_14 = (inputArray[i].substr(191, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_14 = (inputArray[i].substr(199, 3));
        contractDatesRecordPVFObj.vchFiller14 = (inputArray[i].substr(202, 1));
        contractDatesRecordPVFObj.vchContractDate_15 = (inputArray[i].substr(203, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_15 = (inputArray[i].substr(211, 3));
        contractDatesRecordPVFObj.vchFiller15 = (inputArray[i].substr(214, 1));
        contractDatesRecordPVFObj.vchContractDate_16 = (inputArray[i].substr(215, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_16 = (inputArray[i].substr(223, 3));
        contractDatesRecordPVFObj.vchFiller16 = (inputArray[i].substr(226, 1));
        contractDatesRecordPVFObj.vchContractDate_17 = (inputArray[i].substr(227, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_17 = (inputArray[i].substr(235, 3));
        contractDatesRecordPVFObj.vchFiller17 = (inputArray[i].substr(238, 1));
        contractDatesRecordPVFObj.vchContractDate_18 = (inputArray[i].substr(239, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_18 = (inputArray[i].substr(247, 3));
        contractDatesRecordPVFObj.vchFiller18 = (inputArray[i].substr(250, 1));
        contractDatesRecordPVFObj.vchContractDate_19 = (inputArray[i].substr(251, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_19 = (inputArray[i].substr(259, 3));
        contractDatesRecordPVFObj.vchFiller19 = (inputArray[i].substr(262, 1));
        contractDatesRecordPVFObj.vchContractDate_20 = (inputArray[i].substr(263, 8));
        contractDatesRecordPVFObj.vchContractDateQualifier_20 = (inputArray[i].substr(271, 3));
        contractDatesRecordPVFObj.vchFiller20 = (inputArray[i].substr(274, 14));
        contractDatesRecordPVFObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractDatesRecordPVFObj = helper.replaceFunction(contractDatesRecordPVFObj);
        contractDatesRecordPVFObj.bIsProcessed = false;
        contractDatesRecordPVFObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractDatesRecordPVFObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractDatesRecordPVFObj.vchFileName = fileName;
        contractDatesRecordPVFObj.bFetch = false;



        finalDataString += "('" + ((_.values(contractDatesRecordPVFObj)).join("','")) + "'),";
    }

    return finalDataString.substr(0, finalDataString.length - 1);

}



function contractEventsRecordPVFTransform(inputArray,fileName) {
    var contractEventsRecordPVFObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractEventsRecordPVFObj.vchSubmittersCode = (inputArray[i].substr(0, 1));
        contractEventsRecordPVFObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractEventsRecordPVFObj.vchSequenceNumber= (inputArray[i].substr(3, 2));
        contractEventsRecordPVFObj.vchContractNumber= (inputArray[i].substr(5, 30));
        contractEventsRecordPVFObj.vchEventPeriodType_1= (inputArray[i].substr(35, 3));
        contractEventsRecordPVFObj.vchEventTotalAmount_1= (inputArray[i].substr(38, 16));
        contractEventsRecordPVFObj.vchEventTypeCode_1= (inputArray[i].substr(54, 3));
        contractEventsRecordPVFObj.vchGrossNetIndicator_1= (inputArray[i].substr(57, 1));
        contractEventsRecordPVFObj.vchFiller1= (inputArray[i].substr(58, 1));
        contractEventsRecordPVFObj.vchEventPeriodType_2= (inputArray[i].substr(59, 3));
        contractEventsRecordPVFObj.vchEventTotalAmount_2= (inputArray[i].substr(62, 16));
        contractEventsRecordPVFObj.vchEventTypeCode_2= (inputArray[i].substr(78, 3));
        contractEventsRecordPVFObj.vchGrossNetIndicator_2= (inputArray[i].substr(81, 1));
        contractEventsRecordPVFObj.vchFiller2= (inputArray[i].substr(82, 1));
        contractEventsRecordPVFObj.vchEventPeriodType_3= (inputArray[i].substr(83, 3));
        contractEventsRecordPVFObj.vchEventTotalAmount_3= (inputArray[i].substr(86, 16));
        contractEventsRecordPVFObj.vchEventTypeCode_3= (inputArray[i].substr(102, 3));
        contractEventsRecordPVFObj.vchGrossNetIndicator_3= (inputArray[i].substr(105, 1));
        contractEventsRecordPVFObj.vchFiller3= (inputArray[i].substr(106, 1));
        contractEventsRecordPVFObj.vchEventPeriodType_4= (inputArray[i].substr(107, 3));
        contractEventsRecordPVFObj.vchEventTotalAmount_4= (inputArray[i].substr(110, 16));
        contractEventsRecordPVFObj.vchEventTypeCode_4= (inputArray[i].substr(126, 3));
        contractEventsRecordPVFObj.vchGrossNetIndicator_4= (inputArray[i].substr(129, 1));
        contractEventsRecordPVFObj.vchFiller4= (inputArray[i].substr(130, 1));
        contractEventsRecordPVFObj.vchEventPeriodType_5= (inputArray[i].substr(131, 3));
        contractEventsRecordPVFObj.vchEventTotalAmount_5= (inputArray[i].substr(134, 16));
        contractEventsRecordPVFObj.vchEventTypeCode_5= (inputArray[i].substr(150, 3));
        contractEventsRecordPVFObj.vchGrossNetIndicator_5= (inputArray[i].substr(153, 1));
        contractEventsRecordPVFObj.vchNextEventDate_1= (inputArray[i].substr(154, 8));
        contractEventsRecordPVFObj.vchNextEventDate_2= (inputArray[i].substr(162, 8));
        contractEventsRecordPVFObj.vchNextEventDate_3= (inputArray[i].substr(170, 8));
        contractEventsRecordPVFObj.vchNextEventDate_4= (inputArray[i].substr(178, 8));
        contractEventsRecordPVFObj.vchNextEventDate_5= (inputArray[i].substr(186, 8));
        contractEventsRecordPVFObj.vchFiller5= (inputArray[i].substr(194, 94));
        contractEventsRecordPVFObj.vchRejectCode= (inputArray[i].substr(288, 12));

        contractEventsRecordPVFObj = helper.replaceFunction(contractEventsRecordPVFObj);
        contractEventsRecordPVFObj.bIsProcessed = false;
        contractEventsRecordPVFObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractEventsRecordPVFObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractEventsRecordPVFObj.vchFileName = fileName;
        contractEventsRecordPVFObj.bFetch = false;
        finalDataString += "('" + ((_.values(contractEventsRecordPVFObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);
}

function contractPartyRecordPVFTransform(inputArray,fileName) {
    var contractPartyRecordPVFObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractPartyRecordPVFObj.vchSubmittersCode = (inputArray[i].substr(0, 1));
        contractPartyRecordPVFObj.vchRecordType= (inputArray[i].substr(1, 2));
        contractPartyRecordPVFObj.vchSequenceNumber= (inputArray[i].substr(3, 2));
        contractPartyRecordPVFObj.vchContractNumber= (inputArray[i].substr(5, 30));
        contractPartyRecordPVFObj.vchPartyLastName= (inputArray[i].substr(35, 35));
        contractPartyRecordPVFObj.vchPartyFirstName= (inputArray[i].substr(70, 25));
        contractPartyRecordPVFObj.vchPartyMiddleName= (inputArray[i].substr(95, 25));
        contractPartyRecordPVFObj.vchPartyPrefix= (inputArray[i].substr(120, 10));
        contractPartyRecordPVFObj.vchPartySuffix= (inputArray[i].substr(130, 10));
        contractPartyRecordPVFObj.vchPartyRole= (inputArray[i].substr(140, 2));
        contractPartyRecordPVFObj.vchPartyID= (inputArray[i].substr(142, 20));
        contractPartyRecordPVFObj.vchPartyIDQualifier= (inputArray[i].substr(162, 2));
        contractPartyRecordPVFObj.vchPartyDateofBirth= (inputArray[i].substr(164, 8));
        contractPartyRecordPVFObj.vchPartyNon_NaturalEntityDateQualifier= (inputArray[i].substr(172, 3));
        contractPartyRecordPVFObj.vchPartyNatural_Non_NaturalEntity= (inputArray[i].substr(175, 1));
        contractPartyRecordPVFObj.vchContractPartyRoleQualifier= (inputArray[i].substr(176, 1));
        contractPartyRecordPVFObj.vchImpairedRisk= (inputArray[i].substr(177, 1));
        contractPartyRecordPVFObj.vchTrustRevocabilityIndicator= (inputArray[i].substr(178, 1));
        contractPartyRecordPVFObj.vchPartyGender= (inputArray[i].substr(179, 1));
        contractPartyRecordPVFObj.vchBeneficiaryAmountQuantity= (inputArray[i].substr(180, 16));
        contractPartyRecordPVFObj.vchBeneficiaryQuantityQualifer= (inputArray[i].substr(196, 2));
        contractPartyRecordPVFObj.vchBeneficaryQuantityPercent= (inputArray[i].substr(198, 10));
        contractPartyRecordPVFObj.vchFiller1= (inputArray[i].substr(208, 80));
        contractPartyRecordPVFObj.vchRejectCode= (inputArray[i].substr(288, 12));

        contractPartyRecordPVFObj = helper.replaceFunction(contractPartyRecordPVFObj);
        contractPartyRecordPVFObj = helper.insertDecimalValuescontractPartyRecordPVFTransform(contractPartyRecordPVFObj);
        contractPartyRecordPVFObj.bIsProcessed = false;
        contractPartyRecordPVFObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractPartyRecordPVFObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractPartyRecordPVFObj.vchFileName = fileName;
        contractPartyRecordPVFObj.bFetch = false;

        finalDataString += "('" + ((_.values(contractPartyRecordPVFObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);
}


function contractPartyAddressRecordPVFTransform(inputArray,fileName) {
    var contractPartyAddressRecordPVFObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractPartyAddressRecordPVFObj.vchSubmittersCode = (inputArray[i].substr(0, 1));
        contractPartyAddressRecordPVFObj.vchRecordType= (inputArray[i].substr(1, 2));
        contractPartyAddressRecordPVFObj.vchSequenceNumber= (inputArray[i].substr(3, 2));
        contractPartyAddressRecordPVFObj.vchContractNumber= (inputArray[i].substr(5, 30));
        contractPartyAddressRecordPVFObj.vchPartyRole= (inputArray[i].substr(35, 2));
        contractPartyAddressRecordPVFObj.vchPartyAddressLine1= (inputArray[i].substr(37, 35));
        contractPartyAddressRecordPVFObj.vchPartyAddressLine2= (inputArray[i].substr(72, 35));
        contractPartyAddressRecordPVFObj.vchPartyCity= (inputArray[i].substr(107, 30));
        contractPartyAddressRecordPVFObj.vchPartyState= (inputArray[i].substr(137, 2));
        contractPartyAddressRecordPVFObj.vchPartyPostalCode= (inputArray[i].substr(139, 15));
        contractPartyAddressRecordPVFObj.vchPartyCountryCode= (inputArray[i].substr(154, 3));
        contractPartyAddressRecordPVFObj.vchPartyAddressLine3= (inputArray[i].substr(157, 35));
        contractPartyAddressRecordPVFObj.vchPartyAddressLine4= (inputArray[i].substr(192, 35));
        contractPartyAddressRecordPVFObj.vchPartyAddressLine5= (inputArray[i].substr(227, 35));
        contractPartyAddressRecordPVFObj.vchForeignAddressIndicator= (inputArray[i].substr(262, 1));
        contractPartyAddressRecordPVFObj.vchFiller1= (inputArray[i].substr(163, 25));
        contractPartyAddressRecordPVFObj.vchRejectCode= (inputArray[i].substr(288, 12));

        contractPartyAddressRecordPVFObj = helper.replaceFunction(contractPartyAddressRecordPVFObj);
        contractPartyAddressRecordPVFObj.bIsProcessed = false;
        contractPartyAddressRecordPVFObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractPartyAddressRecordPVFObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractPartyAddressRecordPVFObj.vchFileName = fileName;
        contractPartyAddressRecordPVFObj.bFetch = false;

        finalDataString += "('" + ((_.values(contractPartyAddressRecordPVFObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);
}

function contractAnnuitizationPayoutRecordPVFTransform(inputArray,fileName) {
    var contractAnnuitizationPayoutRecordPVFObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractAnnuitizationPayoutRecordPVFObj.vchSubmittersCode = (inputArray[i].substr(0, 1));
        contractAnnuitizationPayoutRecordPVFObj.vchRecordType= (inputArray[i].substr(1, 2));
        contractAnnuitizationPayoutRecordPVFObj.vchSequenceNumber= (inputArray[i].substr(3, 2));
        contractAnnuitizationPayoutRecordPVFObj.vchContractNumber= (inputArray[i].substr(5, 30));
        contractAnnuitizationPayoutRecordPVFObj.vchAnnuityPayoutAmount= (inputArray[i].substr(35, 16));
        contractAnnuitizationPayoutRecordPVFObj.vchAnnuityPaymentAmountQualifier= (inputArray[i].substr(51, 3));
        contractAnnuitizationPayoutRecordPVFObj.vchAnnuityFrequencyCode= (inputArray[i].substr(54, 3));
        contractAnnuitizationPayoutRecordPVFObj.vchPayoutOption= (inputArray[i].substr(57, 2));
        contractAnnuitizationPayoutRecordPVFObj.vchLivesType= (inputArray[i].substr(59, 1));
        contractAnnuitizationPayoutRecordPVFObj.vchPayoutType= (inputArray[i].substr(60, 1));
        contractAnnuitizationPayoutRecordPVFObj.vchCertainPeriod= (inputArray[i].substr(61, 4));
        contractAnnuitizationPayoutRecordPVFObj.vchIncreasePercentage= (inputArray[i].substr(65, 10));
        contractAnnuitizationPayoutRecordPVFObj.vchAssumedInterestRate= (inputArray[i].substr(75, 10));
        contractAnnuitizationPayoutRecordPVFObj.vchLevelizationIndicator= (inputArray[i].substr(85, 1));
        contractAnnuitizationPayoutRecordPVFObj.vchPrimarySurvivorAdjustmentType= (inputArray[i].substr(86, 1));
        contractAnnuitizationPayoutRecordPVFObj.vchPrimarySurviviorAdjustmentPercentage= (inputArray[i].substr(87, 10));
        contractAnnuitizationPayoutRecordPVFObj.vchJointSurvivorAdjustmentType= (inputArray[i].substr(97, 1));
        contractAnnuitizationPayoutRecordPVFObj.vchJointSurvivorAdjustmentPercentage= (inputArray[i].substr(98, 10));
        contractAnnuitizationPayoutRecordPVFObj.vchExclusionValue= (inputArray[i].substr(108, 16));
        contractAnnuitizationPayoutRecordPVFObj.vchExclustionIndicator= (inputArray[i].substr(124, 2));
        contractAnnuitizationPayoutRecordPVFObj.vchCertainPeriodQualifier= (inputArray[i].substr(126, 3));
        contractAnnuitizationPayoutRecordPVFObj.vchLiquidityOption= (inputArray[i].substr(129, 2));
        contractAnnuitizationPayoutRecordPVFObj.vchLiquidityWaitingPeriod= (inputArray[i].substr(131, 2));
        contractAnnuitizationPayoutRecordPVFObj.vchLiquidityTriggerEvent= (inputArray[i].substr(133, 2));
        contractAnnuitizationPayoutRecordPVFObj.vchLiquidityParital= (inputArray[i].substr(135, 1));
        contractAnnuitizationPayoutRecordPVFObj.vchPaymentStartDate= (inputArray[i].substr(136, 8));
        contractAnnuitizationPayoutRecordPVFObj.vchPaymentEndDate= (inputArray[i].substr(144, 8));
        contractAnnuitizationPayoutRecordPVFObj.vchReturnofPremiumPercentage= (inputArray[i].substr(152, 10));
        contractAnnuitizationPayoutRecordPVFObj.vchPayoutChangeDate= (inputArray[i].substr(162, 8));
        contractAnnuitizationPayoutRecordPVFObj.vchPayoutChangeAmount= (inputArray[i].substr(170, 16));
        contractAnnuitizationPayoutRecordPVFObj.vchPayoutChangeQualifier= (inputArray[i].substr(186, 2));
        contractAnnuitizationPayoutRecordPVFObj.vchPayoutChangeDirectionIndicator= (inputArray[i].substr(188, 1));
        contractAnnuitizationPayoutRecordPVFObj.vchFiller1= (inputArray[i].substr(189, 99));
        contractAnnuitizationPayoutRecordPVFObj.vchRejectCode= (inputArray[i].substr(288, 12));

        contractAnnuitizationPayoutRecordPVFObj = helper(contractAnnuitizationPayoutRecordPVFObj);
        contractAnnuitizationPayoutRecordPVFObj = helper.insertDecimalValuescontractAnnuitizationPayoutRecordPVF(contractAnnuitizationPayoutRecordPVFObj);

        contractAnnuitizationPayoutRecordPVFObj.bIsProcessed = false;
        contractAnnuitizationPayoutRecordPVFObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractAnnuitizationPayoutRecordPVFObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractAnnuitizationPayoutRecordPVFObj.vchFileName = fileName;
        contractAnnuitizationPayoutRecordPVFObj.bFetch = false;

        finalDataString += "('" + ((_.values(contractAnnuitizationPayoutRecordPVFObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);
}

function contractServiceFeatureRecordPVFTransform(inputArray,fileName) {
    var contractServiceFeatureRecordPVFObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractServiceFeatureRecordPVFObj.vchSubmittersCode = (inputArray[i].substr(0, 1));
        contractServiceFeatureRecordPVFObj.vchRecordType= (inputArray[i].substr(1, 2));
        contractServiceFeatureRecordPVFObj.vchSequenceNumber= (inputArray[i].substr(3, 2));
        contractServiceFeatureRecordPVFObj.vchContractNumber= (inputArray[i].substr(5, 30));
        contractServiceFeatureRecordPVFObj.vchFiller1= (inputArray[i].substr(35, 39));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureValue= (inputArray[i].substr(74, 14));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureValueQualifier= (inputArray[i].substr(88, 2));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureFrequency= (inputArray[i].substr(90, 1));
        contractServiceFeatureRecordPVFObj.vchFiller2= (inputArray[i].substr(91, 1));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureStartDate= (inputArray[i].substr(92, 8));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureStopDate= (inputArray[i].substr(100, 8));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureExpenseType= (inputArray[i].substr(108, 2));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureExpense_DollarAmt= (inputArray[i].substr(110, 14));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureExpense_Percentage= (inputArray[i].substr(124, 10));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureName= (inputArray[i].substr(134, 35));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureProductCode= (inputArray[i].substr(169, 20));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureProgramType= (inputArray[i].substr(189, 1));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureTypeCode_1= (inputArray[i].substr(190, 4));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureSub_TypeCode_1= (inputArray[i].substr(194, 4));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureTypeCode_2= (inputArray[i].substr(198, 4));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureSub_TypeCode_2= (inputArray[i].substr(202, 4));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureTypeCode_3= (inputArray[i].substr(206, 4));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureSub_TypeCode_3= (inputArray[i].substr(210, 4));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureTypeCode_4= (inputArray[i].substr(214, 4));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureSub_TypeCode_4= (inputArray[i].substr(218, 4));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureTypeCode_5= (inputArray[i].substr(222, 4));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureSub_TypeCode_5= (inputArray[i].substr(226, 4));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureTypeCode_6= (inputArray[i].substr(230, 4));
        contractServiceFeatureRecordPVFObj.vchServiceFeatureSub_TypeCode_6= (inputArray[i].substr(234, 4));
        contractServiceFeatureRecordPVFObj.vchFiller3= (inputArray[i].substr(238, 50));

        contractServiceFeatureRecordPVFObj = helper.replaceFunction(contractServiceFeatureRecordPVFObj);
        contractServiceFeatureRecordPVFObj.vchRejectCode= (inputArray[i].substr(288, 12));
        contractServiceFeatureRecordPVFObj.bIsProcessed = false;
        contractServiceFeatureRecordPVFObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractServiceFeatureRecordPVFObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractServiceFeatureRecordPVFObj.vchFileName = fileName;
        contractServiceFeatureRecordPVFObj.bFetch = false;

        finalDataString += "('" + ((_.values(contractServiceFeatureRecordPVFObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);
}




module.exports = {
    pushIntoRespectiveArrays: pushIntoRespectiveArrays,
    cloneTheObj: cloneTheObj,
    emptyTheObject: emptyTheObject,
    isEmpty: isEmpty,
    transformAndInsertIntoRespectiveTable :transformAndInsertIntoRespectiveTable
}