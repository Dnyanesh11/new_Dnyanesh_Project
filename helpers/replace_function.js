var _  = require('underscore');

function replaceFunction(obj) {

    for (var prop in obj) {
        if (typeof obj[prop] === 'string') {
            //console.log(obj[prop]);
            obj[prop] = obj[prop].replace(/'/g, "''");
        }
    }
    return obj;
}

function insertDecimalValues(obj){

    for(var prop in obj){
        if(prop === 'vchFundAmount'){
            //console.log(obj[prop]);
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchMVAAmount'){
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchEmployerAmount'){
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchEmployeeAmount'){
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchFundSurrenderCharges'){
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchFundAdministrativeCharges'){
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchFundUnitPrice') {
            obj[prop] = obj[prop].substr(0,6) + '.' + obj[prop].substr(6,9);
        } if(prop === 'vchFundUnits') {
            obj[prop] = obj[prop].substr(0,12) + '.' + obj[prop].substr(12,6);
        } if(prop === 'vchDepositPeriodRate') {
            obj[prop] = obj[prop].substr(0,1) + '.' + obj[prop].substr(1,9)
        }
    }
    return obj;
}


function insertDecimalValuesConractAgentRecord(obj){

    for(var prop in obj){
        if(prop === 'vchRep_AdvisorSplitPercentage') {
            obj[prop] = obj[prop].substr(0,1) + '.' + obj[prop].substr(1, 9);
        }
    }
    return obj;
}


function insertDecimalValuesContractTransactionRecord(obj){
    for(var prop in obj){
        if(prop === 'vchTransactionAmount') {
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchTransactionCharges_Benefits_1'){
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchTransactionCharges_Benefits_2'){
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchTransactionCharges_Benefits_3') {
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchTransactionCharges_Benefits_4') {
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchTransactionCharges_Benefits_5') {
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchTransactionCharges_Benefits_6') {
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        }
    }
    return obj;
}

function insertDecimalValuesContractPayeePayorPaymentDetailsRecord(obj){
    for(var prop in obj){
        if(prop === 'vchPayee_PayorPaymentMethodNetAmount') {
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchPaymentFederalTaxAmountWithheld'){
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchPaymentStateTaxAmountWithheld'){
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        }
    }
    return obj;
}


function insertDecimalValuescontractUnderlyingAssetsRecordPVF(obj){
    for(var prop in obj){
        if(prop === 'vchFundUnits') {
            obj[prop] = obj[prop].substr(0,12) + '.' + obj[prop].substr(12,6);
        } if(prop === 'vchRate_FundThresholdPercentage'){
            obj[prop] = obj[prop].substr(0,1) + '.' + obj[prop].substr(1,9);
        } if(prop === 'vchFundValue') {
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        }
    }
    return obj;
}


function insertDecimalValuescontractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVF(obj){
    for(var prop in obj){
        if(prop === 'vchDeposit_GuaranteedUnits') {
            obj[prop] = obj[prop].substr(0,12) + '.' + obj[prop].substr(12,6);
        } if(prop === 'vchDepositGuaranteeValue'){
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        }
    }
    return obj;
}


function insertDecimalValuescontractPartyRecordPVFTransform(obj){
    for(var prop in obj){
        if(prop === 'vchBeneficiaryAmountQuantity') {
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchBeneficaryQuantityPercent'){
            obj[prop] = obj[prop].substr(0,1) + '.' + obj[prop].substr(1,9);
        }
    }
    return obj;
}


function insertDecimalValuescontractAnnuitizationPayoutRecordPVF(obj){
    for(var prop in obj){
        if(prop === 'vchIncreasePercentage') {
            obj[prop] = obj[prop].substr(0,1) + '.' + obj[prop].substr(1,9);
        } if(prop === 'vchAssumedInterestRate') {
            obj[prop] = obj[prop].substr(0,1) + '.' + obj[prop].substr(1,9);
        } if(prop === 'vchPrimarySurviviorAdjustmentPercentage'){
            obj[prop] = obj[prop].substr(0,1) + '.' + obj[prop].substr(1,9);
        } if(prop === 'vchJointSurvivorAdjustmentPercentage'){
            obj[prop] = obj[prop].substr(0,1) + '.' + obj[prop].substr(1,9);
        } if(prop === 'vchExclusionValue'){
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        } if(prop === 'vchReturnofPremiumPercentage'){
            obj[prop] = obj[prop].substr(0,1) + '.' + obj[prop].substr(1,9);
        } if(prop === 'vchPayoutChangeAmount'){
            obj[prop] = obj[prop].substr(0,14) + '.' + obj[prop].substr(14,2);
        }
    }
    return obj;
}







module.exports = {
    replaceFunction: replaceFunction,
    insertDecimalValues:insertDecimalValues,
    insertDecimalValuesConractAgentRecord:insertDecimalValuesConractAgentRecord,
    insertDecimalValuesContractTransactionRecord:insertDecimalValuesContractTransactionRecord,
    insertDecimalValuesContractPayeePayorPaymentDetailsRecord:insertDecimalValuesContractPayeePayorPaymentDetailsRecord,
    insertDecimalValuescontractUnderlyingAssetsRecordPVF:insertDecimalValuescontractUnderlyingAssetsRecordPVF,
    insertDecimalValuescontractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVF:insertDecimalValuescontractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVF,
    insertDecimalValuescontractPartyRecordPVFTransform:insertDecimalValuescontractPartyRecordPVFTransform,
    insertDecimalValuescontractAnnuitizationPayoutRecordPVF:insertDecimalValuescontractAnnuitizationPayoutRecordPVF

};