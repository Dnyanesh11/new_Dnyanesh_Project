var pgOperations = require('./../helpers/pg_operations');
var config = require('./../config/config');
var async = require('async');
var _ = require('underscore');
var helper = require('./../helpers/replace_function.js')


var tableInfo = config.tableInfo;
var emptyString = '';

function pushIntoRespectiveArrays(dataObj, rawData) {

    var recordType, sequenceNo;
    recordType = rawData.substr(1, 2);
    if (recordType === '40') {
        dataObj.submittingHeader.push(rawData);
    } else if (recordType === '42') {
        dataObj.contraHeader.push(rawData);
    } else if (recordType === '43') {
        sequenceNo = rawData.substr(3, 2);

        if (sequenceNo === '01') {
            dataObj.contractRecord.push(rawData);
        } else if (sequenceNo === '02') {
            dataObj.contractEntityRecord.push(rawData);
        } else if (sequenceNo === '03') {
            dataObj.contractEntityAddressRecord.push(rawData);
        } else if (sequenceNo === '04') {
            dataObj.contractAgentRecord.push(rawData);
        } else if (sequenceNo === '05') {
            dataObj.contractTransactionRecord.push(rawData);
        } else if (sequenceNo === '06') {
            dataObj.contractUnderlyingAssetsRecord.push(rawData);
        } else if (sequenceNo === '07') {
            dataObj.contractPayeePayorRecord.push(rawData);
        } else if (sequenceNo === '08') {
            dataObj.contractPayeePayorPaymentDetailsRecord.push(rawData);
        } else if (sequenceNo === '09') {
            dataObj.contractPayeePayorAddressRecord.push(rawData);
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

    var dataToInsertStringObj = transformAllDataArrays(dataToInsertObj,fileName);
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

function submittingHeaderTransform(inputArray,fileName) {
    var submittingHeaderObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {

        submittingHeaderObj.vchSystemCode = (inputArray[i]).substr(0, 1);
        submittingHeaderObj.vchRecordType = (inputArray[i].substr(1, 2));
        submittingHeaderObj.vchTransmissionUniqueID = (inputArray[i].substr(3, 30));
        submittingHeaderObj.vchTransmissionDate = (inputArray[i].substr(33, 8));
        submittingHeaderObj.vchTransmittingCompanyIdentifier = (inputArray[i].substr(41, 4));
        submittingHeaderObj.vchFiller1 = (inputArray[i].substr(45, 41));
        submittingHeaderObj.vchSettlingCarrierIdentifier = (inputArray[i].substr(86, 4));
        submittingHeaderObj.vchFiller2 = (inputArray[i].substr(90, 35));
        submittingHeaderObj.vchAssociatedCarrierCompanyIdentifier = (inputArray[i].substr(125, 10));
        submittingHeaderObj.vchFiller3 = (inputArray[i].substr(135, 35));
        submittingHeaderObj.vchIPSBusinessEventCode = (inputArray[i].substr(170, 3));
        submittingHeaderObj.vchTotalCount = (inputArray[i].substr(173, 12));
        submittingHeaderObj.vchTestIndicator = (inputArray[i].substr(185, 1));
        submittingHeaderObj.vchFiller4 = (inputArray[i].substr(186, 102));
        submittingHeaderObj.vchRejectCode = (inputArray[i].substr(288, 12));

        submittingHeaderObj = helper.replaceFunction(submittingHeaderObj);
        submittingHeaderObj.bIsProcessed = false;
        submittingHeaderObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        submittingHeaderObj.vchAdvisorLabel = config.vchAdvisorLabel;
        submittingHeaderObj.vchFileName = fileName;
        submittingHeaderObj.bFetch = false;

        finalDataString += "('" + ((_.values(submittingHeaderObj)).join("','")) + "'),";
    }

    return finalDataString.substr(0, finalDataString.length - 1);

}

function contraHeaderTransform(inputArray,fileName) {
    var contraHeaderObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contraHeaderObj.vchSystemCode = (inputArray[i].substr(0, 1));
        contraHeaderObj.vchRecordType = (inputArray[i].substr(1, 2));
        contraHeaderObj.vchContraParticipantNumber = (inputArray[i].substr(3, 4));
        contraHeaderObj.vchAssociatedFirmID = (inputArray[i].substr(7, 4));
        contraHeaderObj.vchAssociateFirmSubmittedContractCount = (inputArray[i].substr(11, 10));
        contraHeaderObj.vchAssociateFirmDeliveredContractCount = (inputArray[i].substr(21, 10));
        contraHeaderObj.vchStageCode = (inputArray[i].substr(31, 3));
        contraHeaderObj.vchFiller1 = (inputArray[i].substr(34, 254));
        contraHeaderObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contraHeaderObj = helper.replaceFunction(contraHeaderObj);
        contraHeaderObj.bIsProcessed = false;
        contraHeaderObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contraHeaderObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contraHeaderObj.vchFileName = fileName;
        contraHeaderObj.bFetch = false;

        finalDataString += "('" + ((_.values(contraHeaderObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);
}

function contractRecordTransform(inputArray,fileName) {
    var contractRecordObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractRecordObj.vchSystemCode = (inputArray[i].substr(0, 1));
        contractRecordObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractRecordObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractRecordObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractRecordObj.vchGroupNumber = (inputArray[i].substr(35, 30));
        contractRecordObj.vchIRSQualificationCode = (inputArray[i].substr(65, 4));
        contractRecordObj.vchDistributorAccountNumber = (inputArray[i].substr(69, 30));
        contractRecordObj.vchCUSIPNumber = (inputArray[i].substr(99, 9));
        contractRecordObj.vchContractStatus = (inputArray[i].substr(108, 2));
        contractRecordObj.vchContractDate_1 = (inputArray[i].substr(110, 8));
        contractRecordObj.vchContractDateQualifier_1 = (inputArray[i].substr(118, 3));
        contractRecordObj.vchContractDate_2 = (inputArray[i].substr(121, 8));
        contractRecordObj.vchContractDateQualifier_2 = (inputArray[i].substr(129, 3));
        contractRecordObj.vchContractDate_3 = (inputArray[i].substr(132, 8));
        contractRecordObj.vchContractDateQualifier_3 = (inputArray[i].substr(140, 3));
        contractRecordObj.vchContractDate_4 = (inputArray[i].substr(143, 8));
        contractRecordObj.vchContractDateQualifier_4 = (inputArray[i].substr(151, 3));
        contractRecordObj.vchcontractdate_5 = (inputArray[i].substr(154, 8));
        contractRecordObj.vchContractDateQualifier_5 = (inputArray[i].substr(162, 3));
        contractRecordObj.vchEndReceivingCompanyID = (inputArray[i].substr(165, 20));
        contractRecordObj.vchEndReceivingCompanyIDQualifier = (inputArray[i].substr(185, 2));
        contractRecordObj.vchFiller1 = (inputArray[i].substr(187, 1));
        contractRecordObj.vchCommissionOption = (inputArray[i].substr(188, 4));
        contractRecordObj.vchFiller2 = (inputArray[i].substr(192, 6));
        contractRecordObj.vchProductTypeCode = (inputArray[i].substr(198, 3));
        contractRecordObj.vchQLACIndicator = (inputArray[i].substr(201, 1));
        contractRecordObj.vchPlanNumber = (inputArray[i].substr(202, 30));
        contractRecordObj.vchFiller3 = (inputArray[i].substr(232, 56));
        contractRecordObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractRecordObj = helper.replaceFunction(contractRecordObj);
        contractRecordObj.bIsProcessed = false;
        contractRecordObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractRecordObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractRecordObj.vchFileName = fileName;
        contractRecordObj.bFetch= false;

        finalDataString += "('" + ((_.values(contractRecordObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);
}

function contractEntityRecordTransform(inputArray,fileName) {
    var contractEntityRecordObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractEntityRecordObj.vchSubmittersCode = (inputArray[i].substr(0, 1));
        contractEntityRecordObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractEntityRecordObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractEntityRecordObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractEntityRecordObj.vchContractEntityTypeCode = (inputArray[i].substr(35, 1));
        contractEntityRecordObj.vchContractEntityRole = (inputArray[i].substr(36, 3));
        contractEntityRecordObj.vchContractEntityNatural_Non_NaturalNameIndicator = (inputArray[i].substr(39, 1));
        contractEntityRecordObj.vchContractEntityLastName = (inputArray[i].substr(40, 35));
        contractEntityRecordObj.vchContractEntityFirstName = (inputArray[i].substr(75, 25));
        contractEntityRecordObj.vchContractEntityMiddleName = (inputArray[i].substr(100, 25));
        contractEntityRecordObj.vchContractEntityPrefix = (inputArray[i].substr(125, 10));
        contractEntityRecordObj.vchContractEntitySuffix = (inputArray[i].substr(135, 10));
        contractEntityRecordObj.vchContractEntityE_mailAddress = (inputArray[i].substr(145, 75));
        contractEntityRecordObj.vchContractEntityPersonalIdentifier = (inputArray[i].substr(220, 20));
        contractEntityRecordObj.vchContractEntityPersonalQualifier = (inputArray[i].substr(240, 2));
        contractEntityRecordObj.vchTrustRevocabilityIndicator = (inputArray[i].substr(242, 1));
        contractEntityRecordObj.vchContractEntityPhoneNumber = (inputArray[i].substr(243, 12));
        contractEntityRecordObj.vchContractEntityPhoneExtension = (inputArray[i].substr(255,6));
        contractEntityRecordObj.vchFiller1 = (inputArray[i].substr(261, 27));
        contractEntityRecordObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractEntityRecordObj = helper.replaceFunction(contractEntityRecordObj);
        contractEntityRecordObj.bIsProcessed = false;
        contractEntityRecordObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractEntityRecordObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractEntityRecordObj.vchFileName = fileName;
        contractEntityRecordObj.bFetch = false;

        finalDataString += "('" + ((_.values(contractEntityRecordObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);

}

function contractEntityAddressRecordTransform(inputArray,fileName) {
    var contractEntityAddressRecordObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractEntityAddressRecordObj.vchSystemCode = (inputArray[i].substr(0, 1));
        contractEntityAddressRecordObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractEntityAddressRecordObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractEntityAddressRecordObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractEntityAddressRecordObj.vchContractEntityAddressLine1 = (inputArray[i].substr(35, 35));
        contractEntityAddressRecordObj.vchContractEntityAddressLine2 = (inputArray[i].substr(70, 35));
        contractEntityAddressRecordObj.vchContractEntityAddressLine3 = (inputArray[i].substr(105, 35));
        contractEntityAddressRecordObj.vchContractEntityCity = (inputArray[i].substr(140, 30));
        contractEntityAddressRecordObj.vchContractEntityState = (inputArray[i].substr(170, 2));
        contractEntityAddressRecordObj.vchContractEntityZip = (inputArray[i].substr(172, 15));
        contractEntityAddressRecordObj.vchContractEntityResidenceCountry = (inputArray[i].substr(187, 3));
        contractEntityAddressRecordObj.vchContractEntityAddressLine4 = (inputArray[i].substr(190, 35));
        contractEntityAddressRecordObj.vchContractEntityAddressLine5 = (inputArray[i].substr(225, 35));
        contractEntityAddressRecordObj.vchForeignAddressIndicator = (inputArray[i].substr(260, 1));
        contractEntityAddressRecordObj.vchFiller1 = (inputArray[i].substr(261, 27));
        contractEntityAddressRecordObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractEntityAddressRecordObj = helper.replaceFunction(contractEntityAddressRecordObj);
        contractEntityAddressRecordObj.bIsProcessed = false;
        contractEntityAddressRecordObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractEntityAddressRecordObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractEntityAddressRecordObj.vchFileName = fileName;
        contractEntityAddressRecordObj.bFetch = false;

        finalDataString += "('" + ((_.values(contractEntityAddressRecordObj)).join("','")) + "'),";

    }
    return finalDataString.substr(0, finalDataString.length - 1);
}

function contractAgentRecordTransform(inputArray,fileName) {
    var contractAgentRecordObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractAgentRecordObj.vchSystemCode = (inputArray[i].substr(0, 1));
        contractAgentRecordObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractAgentRecordObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractAgentRecordObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractAgentRecordObj.vchAgentTaxID = (inputArray[i].substr(35, 20));
        contractAgentRecordObj.vchAgentTaxIDQualifier = (inputArray[i].substr(55, 2));
        contractAgentRecordObj.vchAgentLastName = (inputArray[i].substr(57, 35));
        contractAgentRecordObj.vchAgentFirstName = (inputArray[i].substr(92, 25));
        contractAgentRecordObj.vchAgentMiddleName = (inputArray[i].substr(117, 25));
        contractAgentRecordObj.vchAgentPrefix = (inputArray[i].substr(142, 10));
        contractAgentRecordObj.vchAgentSuffix = (inputArray[i].substr(152, 10));
        contractAgentRecordObj.vchAgentRole = (inputArray[i].substr(162, 3));
        contractAgentRecordObj.vchAgentTypeCode = (inputArray[i].substr(165, 1));
        contractAgentRecordObj.vchBrokersAgentID = (inputArray[i].substr(166, 20));
        contractAgentRecordObj.vchAgentNatural_Non_NaturalNameIndicator = (inputArray[i].substr(186, 1));
        contractAgentRecordObj.vchNationalProducerNumber = (inputArray[i].substr(187, 10));
        contractAgentRecordObj.vchRep_AdvisorSplitPercentage = (inputArray[i].substr(197, 10));
        contractAgentRecordObj.vchFiller1 = (inputArray[i].substr(207, 81));
        contractAgentRecordObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractAgentRecordObj = helper.replaceFunction(contractAgentRecordObj);
        contractAgentRecordObj = helper.insertDecimalValuesConractAgentRecord(contractAgentRecordObj);
        contractAgentRecordObj.bIsProcessed = false;
        contractAgentRecordObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractAgentRecordObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractAgentRecordObj.vchFileName = fileName;
        contractAgentRecordObj.bFetch = false;

        finalDataString += "('" + ((_.values(contractAgentRecordObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);
}

function contractTransactionRecordTransform(inputArray,fileName) {
    var contractTransactionRecordObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractTransactionRecordObj.vchSystemCode = (inputArray[i].substr(0, 1));
        contractTransactionRecordObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractTransactionRecordObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractTransactionRecordObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractTransactionRecordObj.vchNSCCControlNumber = (inputArray[i].substr(35, 20));
        contractTransactionRecordObj.vchDistributorTransactionIdentifier = (inputArray[i].substr(55, 30));
        contractTransactionRecordObj.vchTransactionAmount = (inputArray[i].substr(85, 16));
        contractTransactionRecordObj.vchTransactionAmountDebit_CreditIndicator = (inputArray[i].substr(101, 1));
        contractTransactionRecordObj.vchTransactionSourceIndicator = (inputArray[i].substr(102, 1));
        contractTransactionRecordObj.vchTransactionIdentifier = (inputArray[i].substr(103, 3));
        contractTransactionRecordObj.vchTransactionCharges_Benefits_1 = (inputArray[i].substr(106, 16));
        contractTransactionRecordObj.vchTransactionCharges_BenefitsDebit_CreditIndicator_1 = (inputArray[i].substr(122, 1));
        contractTransactionRecordObj.vchTransactionCharges_BenefitsQualifier_1 = (inputArray[i].substr(123, 3));
        contractTransactionRecordObj.vchTransactionCharges_Benefits_2 = (inputArray[i].substr(126, 16));
        contractTransactionRecordObj.vchTransactionCharges_BenefitsDebit_CreditIndicator_2 = (inputArray[i].substr(142, 1));
        contractTransactionRecordObj.vchTransactionCharges_BenefitsQualifier_2 = (inputArray[i].substr(143, 3));
        contractTransactionRecordObj.vchTransactionCharges_Benefits_3 = (inputArray[i].substr(146, 16));
        contractTransactionRecordObj.vchTransactionCharges_BenefitsDebit_CreditIndicator_3 = (inputArray[i].substr(162, 1));
        contractTransactionRecordObj.vchTransactionCharges_BenefitsQualifier_3 = (inputArray[i].substr(163, 3));
        contractTransactionRecordObj.vchTransactionCharges_Benefits_4 = (inputArray[i].substr(166, 16));
        contractTransactionRecordObj.vchTransactionCharges_BenefitsDebit_CreditIndicator_4 = (inputArray[i].substr(182, 1));
        contractTransactionRecordObj.vchTransactionCharges_BenefitsQualifier_4 = (inputArray[i].substr(183, 3));
        contractTransactionRecordObj.vchTransactionCharges_Benefits_5 = (inputArray[i].substr(186, 16));
        contractTransactionRecordObj.vchTransactionCharges_BenefitsDebit_CreditIndicator_5 = (inputArray[i].substr(202, 1));
        contractTransactionRecordObj.vchTransactionCharges_BenefitsQualifier_5 = (inputArray[i].substr(203, 3));
        contractTransactionRecordObj.vchTransactionCharges_Benefits_6 = (inputArray[i].substr(206, 16));
        contractTransactionRecordObj.vchTransactionCharges_BenefitsDebit_CreditIndicator_6 = (inputArray[i].substr(222, 1));
        contractTransactionRecordObj.vchTransactionCharges_BenefitsQualifier_6 = (inputArray[i].substr(223, 3));
        contractTransactionRecordObj.vchApplicationControlNumber = (inputArray[i].substr(226, 20));
        contractTransactionRecordObj.vchPayee_PayorPaymentMethod = (inputArray[i].substr(246, 3));
        contractTransactionRecordObj.vchPaymentType = (inputArray[i].substr(249, 2));
        contractTransactionRecordObj.vchFiller1 = (inputArray[i].substr(251, 15));
        contractTransactionRecordObj.vchTransactionDate_Effective = (inputArray[i].substr(266, 8));
        contractTransactionRecordObj.vchTransactionDate_Process = (inputArray[i].substr(274, 8));
        contractTransactionRecordObj.vchTaxYear = (inputArray[i].substr(282, 4));
        contractTransactionRecordObj.vchFiller2 = (inputArray[i].substr(286, 2));
        contractTransactionRecordObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractTransactionRecordObj = helper.replaceFunction(contractTransactionRecordObj);
        contractTransactionRecordObj = helper.insertDecimalValuesContractTransactionRecord(contractTransactionRecordObj);


        contractTransactionRecordObj.bIsProcessed = false;
        contractTransactionRecordObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractTransactionRecordObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractTransactionRecordObj.vchFileName = fileName;
        contractTransactionRecordObj.bFetch = false;

        finalDataString += "('" + ((_.values(contractTransactionRecordObj)).join("','")) + "'),";

    }
    return finalDataString.substr(0, finalDataString.length - 1);
}

function contractUnderlyingAssetsRecordTransform(inputArray,fileName) {
    var contractUnderlyingAssetsRecordObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    console.log('Length is',inputArray.length)
    for (var i = 0; i < inputArray.length; i++) {
        contractUnderlyingAssetsRecordObj.vchSystemCode = (inputArray[i].substr(0, 1));
        contractUnderlyingAssetsRecordObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractUnderlyingAssetsRecordObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractUnderlyingAssetsRecordObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractUnderlyingAssetsRecordObj.vchFundIdentifier = (inputArray[i].substr(35, 19));
        contractUnderlyingAssetsRecordObj.vchFiller1 = (inputArray[i].substr(54, 1));
        contractUnderlyingAssetsRecordObj.vchFundAmount = (inputArray[i].substr(55, 16));
        contractUnderlyingAssetsRecordObj.vchFundAmountDebit_CreditIndicator = (inputArray[i].substr(71, 1));
        contractUnderlyingAssetsRecordObj.vchMVAAmount = (inputArray[i].substr(72, 16));
        contractUnderlyingAssetsRecordObj.vchMVAAmountDebit_CreditIndicator = (inputArray[i].substr(88, 1));
        contractUnderlyingAssetsRecordObj.vchEmployerAmount = (inputArray[i].substr(89, 16));
        contractUnderlyingAssetsRecordObj.vchEmployerAmountDebit_CreditIndicator = (inputArray[i].substr(105, 1));
        contractUnderlyingAssetsRecordObj.vchEmployeeAmount = (inputArray[i].substr(106, 16));
        contractUnderlyingAssetsRecordObj.vchEmployeeAmountDebit_CreditIndicator = (inputArray[i].substr(122, 1));
        contractUnderlyingAssetsRecordObj.vchFundSurrenderCharges = (inputArray[i].substr(123, 16));
        contractUnderlyingAssetsRecordObj.vchFundSurrenderDebit_CreditIndicator = (inputArray[i].substr(139, 1));
        contractUnderlyingAssetsRecordObj.vchFundAdministrativeCharges = (inputArray[i].substr(140, 16));
        contractUnderlyingAssetsRecordObj.vchFundAdministrativeDebit_CreditIndicator = (inputArray[i].substr(156, 1));
        contractUnderlyingAssetsRecordObj.vchFundUnitPrice = (inputArray[i].substr(157, 15));
        contractUnderlyingAssetsRecordObj.vchFiller2 = (inputArray[i].substr(172, 2));
        contractUnderlyingAssetsRecordObj.vchFundUnits = (inputArray[i].substr(174, 18));
        contractUnderlyingAssetsRecordObj.vchFundUnitsDebit_CreditIndicator = (inputArray[i].substr(192, 1));
        contractUnderlyingAssetsRecordObj.vchMutualFundCUSIPNumber = (inputArray[i].substr(193, 9));
        contractUnderlyingAssetsRecordObj.vchFiller3 = (inputArray[i].substr(202, 1));
        contractUnderlyingAssetsRecordObj.vchDepositPeriodStartDate = (inputArray[i].substr(203, 8));
        contractUnderlyingAssetsRecordObj.vchDepositPeriodEndDate = (inputArray[i].substr(211, 8));
        contractUnderlyingAssetsRecordObj.vchDepositPeriodMaturityDate = (inputArray[i].substr(219, 8));
        contractUnderlyingAssetsRecordObj.vchDepositPeriodRate = (inputArray[i].substr(227, 10));
        contractUnderlyingAssetsRecordObj.vchDepositPeriodRateType = (inputArray[i].substr(237, 2));
        contractUnderlyingAssetsRecordObj.vchDepositPeriodDuration = (inputArray[i].substr(239, 10));
        contractUnderlyingAssetsRecordObj.vchDepositPeriodDurationQualifier = (inputArray[i].substr(249, 2));
        contractUnderlyingAssetsRecordObj.vchEmployerAmountIdentifierQualifier = (inputArray[i].substr(251, 4));
        contractUnderlyingAssetsRecordObj.vchEmployeeAmountIdentifierQualifier = (inputArray[i].substr(255, 4));
        contractUnderlyingAssetsRecordObj.vchFundAccountNumber = (inputArray[i].substr(259, 12));
        contractUnderlyingAssetsRecordObj.vchFiller4 = (inputArray[i].substr(271, 17));
        contractUnderlyingAssetsRecordObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractUnderlyingAssetsRecordObj = helper.replaceFunction(contractUnderlyingAssetsRecordObj);
        contractUnderlyingAssetsRecordObj = helper.insertDecimalValues(contractUnderlyingAssetsRecordObj);
        contractUnderlyingAssetsRecordObj.bIsProcessed = false;
        contractUnderlyingAssetsRecordObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractUnderlyingAssetsRecordObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractUnderlyingAssetsRecordObj.vchFileName = fileName;
        contractUnderlyingAssetsRecordObj.bFetch = false;

        finalDataString += "('" + ((_.values(contractUnderlyingAssetsRecordObj)).join("','")) + "'),";

    }

    return finalDataString.substr(0, finalDataString.length - 1);
}

function contractPayeePayorRecordTransform(inputArray,fileName) {
    var contractPayeePayorRecordObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractPayeePayorRecordObj.vchSystemCode = (inputArray[i].substr(0, 1));
        contractPayeePayorRecordObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractPayeePayorRecordObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractPayeePayorRecordObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractPayeePayorRecordObj.vchPayee_PayorEntityTypeCode = (inputArray[i].substr(35, 1));
        contractPayeePayorRecordObj.vchPayee_PayorEntityRole = (inputArray[i].substr(36, 3));
        contractPayeePayorRecordObj.vchPayee_PayorNatural_Non_NaturalEntityNameIndicator = (inputArray[i].substr(39, 1));
        contractPayeePayorRecordObj.vchPayee_PayorEntityLastName = (inputArray[i].substr(40, 35));
        contractPayeePayorRecordObj.vchPayee_PayorEntityFirstName = (inputArray[i].substr(75, 25));
        contractPayeePayorRecordObj.vchPayee_PayorEntityMiddleName = (inputArray[i].substr(100, 25));
        contractPayeePayorRecordObj.vchPayee_PayorEntityPrefix = (inputArray[i].substr(125, 10));
        contractPayeePayorRecordObj.vchPayee_PayorEntitySuffix = (inputArray[i].substr(135, 10));
        contractPayeePayorRecordObj.vchFiller1 = (inputArray[i].substr(145, 75));
        contractPayeePayorRecordObj.vchPayee_PayorEntityPersonalIdentifier = (inputArray[i].substr(220, 20));
        contractPayeePayorRecordObj.vchPayee_PayorEntityIdentifierQualifier = (inputArray[i].substr(240, 2));
        contractPayeePayorRecordObj.vchFiller2 = (inputArray[i].substr(242, 46));
        contractPayeePayorRecordObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractPayeePayorRecordObj = helper.replaceFunction(contractPayeePayorRecordObj);
        contractPayeePayorRecordObj.bIsProcessed = false;
        contractPayeePayorRecordObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractPayeePayorRecordObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractPayeePayorRecordObj.vchFileName = fileName;
        contractPayeePayorRecordObj.bFetch = false;


        finalDataString += "('" + ((_.values(contractPayeePayorRecordObj)).join("','")) + "'),";
    }

    return finalDataString.substr(0, finalDataString.length - 1);

}

function contractPayeePayorPaymentDetailsRecordTransform(inputArray,fileName) {
    var contractPayeePayorPaymentDetailsRecordObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractPayeePayorPaymentDetailsRecordObj.vchSystemCode = (inputArray[i].substr(0, 1));
        contractPayeePayorPaymentDetailsRecordObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractPayeePayorPaymentDetailsRecordObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractPayeePayorPaymentDetailsRecordObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractPayeePayorPaymentDetailsRecordObj.vchFiller1 = (inputArray[i].substr(35, 3));
        contractPayeePayorPaymentDetailsRecordObj.vchPayee_PayorPaymentMethodNetAmount = (inputArray[i].substr(38, 16));
        contractPayeePayorPaymentDetailsRecordObj.vchPayee_PayorPaymentMethodNetAmountDebit_CreditIndicator = (inputArray[i].substr(54, 1));
        contractPayeePayorPaymentDetailsRecordObj.vchPaymentFederalTaxAmountWithheld = (inputArray[i].substr(55, 16));
        contractPayeePayorPaymentDetailsRecordObj.vchPaymentFederalTaxAmountDebit_CreditIndicator = (inputArray[i].substr(71, 1));
        contractPayeePayorPaymentDetailsRecordObj.vchFiller2 = (inputArray[i].substr(72, 4));
        contractPayeePayorPaymentDetailsRecordObj.vchPayorAccountNumber = (inputArray[i].substr(76, 20));
        contractPayeePayorPaymentDetailsRecordObj.vchPayorAccountType_DestinationIdentifier = (inputArray[i].substr(96, 3));
        contractPayeePayorPaymentDetailsRecordObj.vchPayee_PayorAdditionalAccountNumber = (inputArray[i].substr(99, 20));
        contractPayeePayorPaymentDetailsRecordObj.vchPayee_PayorAdditionalAccountType = (inputArray[i].substr(119, 3));
        contractPayeePayorPaymentDetailsRecordObj.vchPaymentStateTaxAmountWithheld = (inputArray[i].substr(122, 16));
        contractPayeePayorPaymentDetailsRecordObj.vchPaymentStateTaxAmountDebit_CreditIndicator = (inputArray[i].substr(138, 1));
        contractPayeePayorPaymentDetailsRecordObj.vchPaymentSourceAmountQualifier = (inputArray[i].substr(139, 2));
        contractPayeePayorPaymentDetailsRecordObj.vchFiller3 = (inputArray[i].substr(141, 147));
        contractPayeePayorPaymentDetailsRecordObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractPayeePayorPaymentDetailsRecordObj = helper.replaceFunction(contractPayeePayorPaymentDetailsRecordObj);
        contractPayeePayorPaymentDetailsRecordObj = helper.insertDecimalValuesContractPayeePayorPaymentDetailsRecord(contractPayeePayorPaymentDetailsRecordObj)
        contractPayeePayorPaymentDetailsRecordObj.bIsProcessed = false;
        contractPayeePayorPaymentDetailsRecordObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractPayeePayorPaymentDetailsRecordObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractPayeePayorPaymentDetailsRecordObj.vchFileName = fileName;
        contractPayeePayorPaymentDetailsRecordObj.bFetch = false;

        finalDataString += "('" + ((_.values(contractPayeePayorPaymentDetailsRecordObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);
}

function contractPayeePayorAddressRecordTransform(inputArray,fileName) {
    var contractPayeePayorAddressRecordObj = {};
    var finalDataString = '';
    var insertedDate = new Date();
    for (var i = 0; i < inputArray.length; i++) {
        contractPayeePayorAddressRecordObj.vchSystemCode = (inputArray[i].substr(0, 1));
        contractPayeePayorAddressRecordObj.vchRecordType = (inputArray[i].substr(1, 2));
        contractPayeePayorAddressRecordObj.vchSequenceNumber = (inputArray[i].substr(3, 2));
        contractPayeePayorAddressRecordObj.vchContractNumber = (inputArray[i].substr(5, 30));
        contractPayeePayorAddressRecordObj.vchPayee_PayorEntityAddress_Line1 = (inputArray[i].substr(35, 35));
        contractPayeePayorAddressRecordObj.vchPayee_PayorEntityAddress_Line2 = (inputArray[i].substr(70, 35));
        contractPayeePayorAddressRecordObj.vchPayee_PayorEntityAddress_Line3 = (inputArray[i].substr(105, 35));
        contractPayeePayorAddressRecordObj.vchPayee_PayorEntityCity = (inputArray[i].substr(140, 30));
        contractPayeePayorAddressRecordObj.vchPayee_PayorEntityState = (inputArray[i].substr(170, 2));
        contractPayeePayorAddressRecordObj.vchPayee_PayorEntityZip = (inputArray[i].substr(172, 15));
        contractPayeePayorAddressRecordObj.vchPayee_PayorEntityCountry = (inputArray[i].substr(187, 3));
        contractPayeePayorAddressRecordObj.vchPayee_PayorEntityAddress_Line4 = (inputArray[i].substr(190, 35));
        contractPayeePayorAddressRecordObj.vchPayee_PayorEntityAddress_Line5 = (inputArray[i].substr(225, 35));
        contractPayeePayorAddressRecordObj.vchForeignAddressIndicator = (inputArray[i].substr(260, 1));
        contractPayeePayorAddressRecordObj.vchFiller1 = (inputArray[i].substr(261, 27));
        contractPayeePayorAddressRecordObj.vchRejectCode = (inputArray[i].substr(288, 12));

        contractPayeePayorAddressRecordObj = helper.replaceFunction(contractPayeePayorAddressRecordObj);
        contractPayeePayorAddressRecordObj.bIsProcessed = false;
        contractPayeePayorAddressRecordObj.dtInsertedDate = insertedDate.getFullYear() + "-" + (insertedDate.getMonth()+1) + "-" + insertedDate.getDate();
        contractPayeePayorAddressRecordObj.vchAdvisorLabel = config.vchAdvisorLabel;
        contractPayeePayorAddressRecordObj.vchFileName = fileName;
        contractPayeePayorAddressRecordObj.bFetch = false;

        finalDataString += "('" + ((_.values(contractPayeePayorAddressRecordObj)).join("','")) + "'),";
    }
    return finalDataString.substr(0, finalDataString.length - 1);
}

module.exports = {
    pushIntoRespectiveArrays: pushIntoRespectiveArrays,
    cloneTheObj: cloneTheObj,
    emptyTheObject: emptyTheObject,
    isEmpty: isEmpty,
    transformAllDataArrays: transformAllDataArrays,
    transformAndInsertIntoRespectiveTable: transformAndInsertIntoRespectiveTable

};