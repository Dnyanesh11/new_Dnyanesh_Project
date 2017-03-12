module.exports = {

    pgConnectionString: 'postgres://dnyanesh:dyh@363@portal.trustfort.com/datafeed_staging',
    //vchFileName: 'DTCC',
    vchAdvisorLabel: 'AP:DTCC',
    batchsize: 1000,
    noOfBatches: 10,

    tableInfo: {
        submittingHeader: {
            tableName: '"DTCC"."Feeds_DTCC_FAR_SubmittingHeader"',
            columnNames: '("vchSystemCode", "vchRecordType", "vchTransmissionUniqueID", "vchTransmissionDate", "vchTransmittingCompanyIdentifier", "vchFiller1", "vchSettlingCarrierIdentifier", "vchFiller2", "vchAssociatedCarrierCompanyIdentifier", "vchFiller3", "vchIPSBusinessEventCode", "vchTotalCount", "vchTestIndicator", "vchFiller4", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName","bFetch")'
        },
        contraHeader: {
            tableName: '"DTCC"."Feeds_DTCC_FAR_ContraHeader"',
            columnNames: '("vchSystemCode", "vchRecordType", "vchContraParticipantNumber", "vchAssociatedFirmID", "vchAssociateFirmSubmittedContractCount", "vchAssociateFirmDeliveredContractCount", "vchStageCode", "vchFiller1", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName","bFetch")'
        },
        contractRecord: {
            tableName: '"DTCC"."Feeds_DTCC_FAR_ContractRecord"',
            columnNames: '("vchSystemCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchGroupNumber", "vchIRSQualificationCode", "vchDistributorAccountNumber", "vchCUSIPNumber", "vchContractStatus", "vchContractDate_1", "vchContractDateQualifier_1", "vchContractDate_2", "vchContractDateQualifier_2", "vchContractDate_3", "vchContractDateQualifier_3", "vchContractDate_4", "vchContractDateQualifier_4", vchcontractdate_5, "vchContractDateQualifier_5", "vchEndReceivingCompanyID", "vchEndReceivingCompanyIDQualifier", "vchFiller1", "vchCommissionOption", "vchFiller2", "vchProductTypeCode", "vchQLACIndicator", "vchPlanNumber", "vchFiller3", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName","bFetch")'
        },
        contractEntityRecord: {
            tableName: '"DTCC"."Feeds_DTCC_FAR_ContractEntityRecord"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchContractEntityTypeCode", "vchContractEntityRole", "vchContractEntityNatural_Non_NaturalNameIndicator", "vchContractEntityLastName", "vchContractEntityFirstName", "vchContractEntityMiddleName", "vchContractEntityPrefix", "vchContractEntitySuffix", "vchContractEntityE_mailAddress", "vchContractEntityPersonalIdentifier", "vchContractEntityPersonalQualifier", "vchTrustRevocabilityIndicator", "vchContractEntityPhoneNumber", "vchContractEntityPhoneExtension", "vchFiller1", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName","bFetch")'
        },
        contractEntityAddressRecord: {
            tableName: '"DTCC"."Feeds_DTCC_FAR_ContractEntityAddressRecord"',
            columnNames: '("vchSystemCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchContractEntityAddressLine1", "vchContractEntityAddressLine2", "vchContractEntityAddressLine3", "vchContractEntityCity", "vchContractEntityState", "vchContractEntityZip", "vchContractEntityResidenceCountry", "vchContractEntityAddressLine4", "vchContractEntityAddressLine5", "vchForeignAddressIndicator", "vchFiller1", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName","bFetch")'
        },
        contractAgentRecord: {
            tableName: '"DTCC"."Feeds_DTCC_FAR_ContractAgentRecord"',
            columnNames: '("vchSystemCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchAgentTaxID", "vchAgentTaxIDQualifier",  "vchAgentLastName", "vchAgentFirstName", "vchAgentMiddleName", "vchAgentPrefix", "vchAgentSuffix", "vchAgentRole", "vchAgentTypeCode", "vchBrokersAgentID", "vchAgentNatural_Non_NaturalNameIndicator", "vchNationalProducerNumber", "vchRep_AdvisorSplitPercentage", "vchFiller1", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName","bFetch")'
        },
        contractTransactionRecord: {
            tableName: '"DTCC"."Feeds_DTCC_FAR_ContractTransactionRecord"',
            columnNames: '("vchSystemCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchNSCCControlNumber", "vchDistributorTransactionIdentifier", "vchTransactionAmount", "vchTransactionAmountDebit_CreditIndicator", "vchTransactionSourceIndicator", "vchTransactionIdentifier", "vchTransactionCharges_Benefits_1", "vchTransactionCharges_BenefitsDebit_CreditIndicator_1", "vchTransactionCharges_BenefitsQualifier_1", "vchTransactionCharges_Benefits_2", "vchTransactionCharges_BenefitsDebit_CreditIndicator_2", "vchTransactionCharges_BenefitsQualifier_2", "vchTransactionCharges_Benefits_3", "vchTransactionCharges_BenefitsDebit_CreditIndicator_3", "vchTransactionCharges_BenefitsQualifier_3", "vchTransactionCharges_Benefits_4", "vchTransactionCharges_BenefitsDebit_CreditIndicator_4", "vchTransactionCharges_BenefitsQualifier_4", "vchTransactionCharges_Benefits_5", "vchTransactionCharges_BenefitsDebit_CreditIndicator_5", "vchTransactionCharges_BenefitsQualifier_5", "vchTransactionCharges_Benefits_6", "vchTransactionCharges_BenefitsDebit_CreditIndicator_6", "vchTransactionCharges_BenefitsQualifier_6", "vchApplicationControlNumber", "vchPayee_PayorPaymentMethod", "vchPaymentType", "vchFiller1", "vchTransactionDate(Effective)", "vchTransactionDate(Process)", "vchTaxYear", "vchFiller2", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName","bFetch")'
        },
        contractUnderlyingAssetsRecord: {
            tableName: '"DTCC"."Feeds_DTCC_FAR_ContractUnderlyingAssetsRecord_Optional"',
            columnNames: '("vchSystemCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchFundIdentifier", "vchFiller1", "vchFundAmount", "vchFundAmountDebit_CreditIndicator", "vchMVAAmount", "vchMVAAmountDebit_CreditIndicator", "vchEmployerAmount", "vchEmployerAmountDebit_CreditIndicator", "vchEmployeeAmount", "vchEmployeeAmountDebit_CreditIndicator", "vchFundSurrenderCharges", "vchFundSurrenderDebit_CreditIndicator", "vchFundAdministrativeCharges", "vchFundAdministrativeDebit_CreditIndicator", "vchFundUnitPrice", "vchFiller2", "vchFundUnits", "vchFundUnitsDebit_CreditIndicator", "vchMutualFundCUSIPNumber", "vchFiller3", "vchDepositPeriodStartDate", "vchDepositPeriodEndDate", "vchDepositPeriodMaturityDate", "vchDepositPeriodRate", "vchDepositPeriodRateType", "vchDepositPeriodDuration", "vchDepositPeriodDurationQualifier", "vchEmployerAmountIdentifierQualifier", "vchEmployeeAmountIdentifierQualifier", "vchFundAccountNumber", "vchFiller4", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName","bFetch")'
        },
        contractPayeePayorRecord: {
            tableName: '"DTCC"."Feeds_DTCC_FAR_ContractPayee_PayorRecord"',
            columnNames: '("vchSystemCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchPayee_PayorEntityTypeCode", "vchPayee_PayorEntityRole", "vchPayee_PayorNatural_Non_NaturalEntityNameIndicator", "vchPayee_PayorEntityLastName", "vchPayee_PayorEntityFirstName", "vchPayee_PayorEntityMiddleName", "vchPayee_PayorEntityPrefix", "vchPayee_PayorEntitySuffix", "vchFiller1", "vchPayee_PayorEntityPersonalIdentifier", "vchPayee_PayorEntityIdentifierQualifier", "vchFiller2", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName","bFetch")'
        },
        contractPayeePayorPaymentDetailsRecord: {
            tableName: '"DTCC"."Feeds_DTCC_FAR_ContractPayee_PayorPaymentDetailsRecord_Optional"',
            columnNames: '("vchSystemCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchFiller1", "vchPayee_PayorPaymentMethodNetAmount", "vchPayee_PayorPaymentMethodNetAmountDebit_CreditIndicator", "vchPaymentFederalTaxAmountWithheld", "vchPaymentFederalTaxAmountDebit_CreditIndicator", "vchFiller2", "vchPayorAccountNumber", "vchPayorAccountType_DestinationIdentifier", "vchPayee_PayorAdditionalAccountNumber", "vchPayee_PayorAdditionalAccountType", "vchPaymentStateTaxAmountWithheld", "vchPaymentStateTaxAmountDebit_CreditIndicator", "vchPaymentSourceAmountQualifier", "vchFiller3", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName", "bFetch")'
        },
        contractPayeePayorAddressRecord: {
            tableName: '"DTCC"."Feeds_DTCC_FAR_ContractPayee_PayorAddressRecord"',
            columnNames: '("vchSystemCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchPayee_PayorEntityAddress_Line1", "vchPayee_PayorEntityAddress_Line2", "vchPayee_PayorEntityAddress_Line3", "vchPayee_PayorEntityCity", "vchPayee_PayorEntityState", "vchPayee_PayorEntityZip", "vchPayee_PayorEntityCountry", "vchPayee_PayorEntityAddress_Line4", "vchPayee_PayorEntityAddress_Line5", "vchForeignAddressIndicator", "vchFiller1", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        },
        submittingHeaderPVF: {
            tableName: '"DTCC"."Feeds_DTCC_PVF_SubmittingHeader"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchSubmittingParticipantNumber", "vchIPSBusinessCode", "vchTransmissionUniqueID", "vchTotalCount", "vchValuationDate", "vchTestIndicator", "vchAssociatedCarrierCompanyID", "vchFiller1", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        },
        contraRecordPVF: {
            tableName: '"DTCC"."Feeds_DTCC_PVF_ContraRecord"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchContraParticipantNumber", "vchAssociatedFirmID", "vchAssociatedFirmSubmittedContractCount", "vchAssociatedFirmDeliveredContractCount", "vchIPSEventCode", "vchIPSStageCode", "vchFiller1", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        },
        contractRecordPVF: {
            tableName: '"DTCC"."Feeds_DTCC_PVF_ContractRecord"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchCUSIPNumber", "vchContractStatus", "vchEndReceivingCompanyID", "vchEndReceivingCompanyIDQualifier", "vchGroupNumber", "vchOriginalContractNumber", "vchDistributorsAccountID", "vchIRSQualificationCode", "vchProductTypeCode", "vchCommissionOption", "vchFiller1", "vchCommissionExtension", "vchERISAIndicator", "vchContractState", "vchFundTransfersRestrictionIndicator", "vchFundTransfersRestrictionReason", "vchNon_AssignibilityIndicator", "vchLifeTermDuration", "vchDividendOption", "vchQLACIndicator", "vchFiller2", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        },
        contractValuationRecordPVF: {
            tableName: '"DTCC"."Feeds_DTCC_PVF_ContractValuationRecord"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchContractValueAmount_1", "vchContractValueQualifier_1", "vchFiller1", "vchContractValueAmount_2", "vchContractValueQualifier_2", "vchFiller2", "vchContractValueAmount_3", "vchContractValueQualifier_3", "vchFiller3", "vchContractValueAmount_4", "vchContractValueQualifier_4", "vchFiller4", "vchContractValueAmount_5", "vchContractValueQualifier_5", "vchFiller5", "vchContractPercentageAmount_1", "vchContractPercentageAmountQualifier_1", "vchFiller6", "vchContractPercentageAmount_2", "vchContractPercentageAmountQualifier_2", "vchFiller7", "vchContractPercentageAmount_3", "vchContractPercentageAmountQualifier_3", "vchFiller8", "vchRejectCodeList", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        },
        contractUnderlyingAssetsRecordPVF: {
            tableName: '"DTCC"."Feeds_DTCC_PVF_ContractUnderlyingAssetRecord"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchCUSIP_FundID_SubFundID", "vchFundValue", "vchFundPercentage", "vchFundUnits", "vchFundGuaranteedInterestRate", "vchFund_UnderlyingSecurityName", "vchFund_UnderlyingSecurityType", "vchMutualFundCUSIPNumber", "vchFundLevelRestrictionIndicator", "vchFundLevelRestrictionReason", "vchStandingAllocationIndicator", "vchStandingAllocationPercentage", vchmaturityelectioninstructions, "vchRate_FundThresholdPercentage", "vchFiller1", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        },
        contractBand_Guaranteed_LoopWithUnderlyingAssetsRecordPVF: {
            tableName: '"DTCC"."Feeds_DTCC_PVF_ContractBand_GuaranteedLoopWithUnderlyingAssetsR"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchCUSIP_FundID", "vchDeposit_GuaranteedStartDate", "vchDeposit_GuaranteedEndDate", "vchDeposit_GuaranteedMaturityDate", "vchDeposit_GuaranteedRate_1", "vchDeposit_GuaranteedRateType_1", "vchDeposit_GuaranteedUnits", "vchDeposit_GuaranteedPeriodFrequencyCode", "vchDeposit_GuaranteedPeriodNumber", "vchDepositGuaranteeValue", "vchDeposit_GuaranteedRate_2", "vchDeposit_GuaranteedRateType_2", "vchDeposit_GuaranteedRate_3", "vchDeposit_GuaranteedRateType_3", "vchDeposit_GuaranteedRate_4", "vchDeposit_GuaranteedRateType_4", "vchDeposit_GuaranteedRate_5", "vchDeposit_GuaranteedRateType_5", "vchDeposit_GuaranteedRate_6", "vchDeposit_GuaranteedRateType_6", "vchFiller1", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        },
        contractAgentRecordPVF: {
            tableName: '"DTCC"."Feeds_DTCC_PVF_ContractAgentRecord"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchAgentTaxID", "vchAgentTaxIDQualifier", "vchAgentRole", "vchAgentLastName", "vchAgentFirstName", "vchAgentMiddleName", "vchAgentPrefix", "vchAgentSuffix", "vchBrokersAgentID", "vchAgentNatural_Non_Natural", "vchNationalProducerNumber", "vchFundTransferAgentAuthorizationIndicator", "vchFiller1", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        },
        contractDatesRecordPVF: {
            tableName: '"DTCC"."Feeds_DTCC_PVF_ContractDatesRecord"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchContractDate_1", "vchContractDateQualifier_1", "vchFiller1", "vchContractDate_2", "vchContractDateQualifier_2", "vchFiller2", "vchContractDate_3", "vchContractDateQualifier_3", "vchFiller3", "vchContractDate_4", "vchContractDateQualifier_4", "vchFiller4", "vchContractDate_5", "vchContractDateQualifier_5", "vchFiller5", "vchContractDate_6", "vchContractDateQualifier_6", "vchFiller6", "vchContractDate_7", "vchContractDateQualifier_7", "vchFiller7", "vchContractDate_8", "vchContractDateQualifier_8", "vchFiller8", "vchContractDate_9", "vchContractDateQualifier_9", "vchFiller9", "vchContractDate_10", "vchContractDateQualifier_10", "vchFiller10", "vchContractDate_11", "vchContractDateQualifier_11", "vchFiller11", "vchContractDate_12", "vchContractDateQualifier_12", "vchFiller12", "vchContractDate_13", "vchContractDateQualifier_13", "vchFiller13", "vchContractDate_14", "vchContractDateQualifier_14", "vchFiller14", "vchContractDate_15", "vchContractDateQualifier_15", "vchFiller15", "vchContractDate_16", "vchContractDateQualifier_16", "vchFiller16", "vchContractDate_17", "vchContractDateQualifier_17", "vchFiller17", "vchContractDate_18", "vchContractDateQualifier_18", "vchFiller18", "vchContractDate_19", "vchContractDateQualifier_19", "vchFiller19", "vchContractDate_20", "vchContractDateQualifier_20", "vchFiller20", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        },
        contractEventsRecordPVF: {
            tableName: '"DTCC"."Feeds_DTCC_PVF_ContractEventsRecord"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchEventPeriodType_1", "vchEventTotalAmount_1", "vchEventTypeCode_1", "vchGrossNetIndicator_1", "vchFiller1", "vchEventPeriodType_2", "vchEventTotalAmount_2", "vchEventTypeCode_2", "vchGrossNetIndicator_2", "vchFiller2", "vchEventPeriodType_3", "vchEventTotalAmount_3", "vchEventTypeCode_3", "vchGrossNetIndicator_3", "vchFiller3", "vchEventPeriodType_4", "vchEventTotalAmount_4", "vchEventTypeCode_4", "vchGrossNetIndicator_4", "vchFiller4", "vchEventPeriodType_5", "vchEventTotalAmount_5", "vchEventTypeCode_5", "vchGrossNetIndicator_5", "vchNextEventDate_1", "vchNextEventDate_2", "vchNextEventDate_3", "vchNextEventDate_4", "vchNextEventDate_5", "vchFiller5", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        },
        contractPartyRecordPVF: {
            tableName: '"DTCC"."Feeds_DTCC_PVF_ContractPartyRecord"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchPartyLastName", "vchPartyFirstName", "vchPartyMiddleName", "vchPartyPrefix", "vchPartySuffix", "vchPartyRole", "vchPartyID", "vchPartyIDQualifier", "vchPartyDateofBirth", "vchPartyNon_NaturalEntityDateQualifier", "vchPartyNatural_Non_NaturalEntity", "vchContractPartyRoleQualifier", "vchImpairedRisk", "vchTrustRevocabilityIndicator", "vchPartyGender", "vchBeneficiaryAmountQuantity", "vchBeneficiaryQuantityQualifer", "vchBeneficaryQuantityPercent", "vchFiller1", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        },
        contractPartyAddressRecordPVF: {
            tableName: '"DTCC"."Feeds_DTCC_PVF_ContractPartyAddressRecord"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchPartyRole", "vchPartyAddressLine1", "vchPartyAddressLine2", "vchPartyCity", "vchPartyState", "vchPartyPostalCode", "vchPartyCountryCode", "vchPartyAddressLine3", "vchPartyAddressLine4", "vchPartyAddressLine5", "vchForeignAddressIndicator", "vchFiller1", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        },
        contractAnnuitizationPayoutRecordPVF: {
            tableName: '"DTCC"."Feeds_DTCC_PVF_ContractAnnuitizationPayoutRecord"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchAnnuityPayoutAmount", "vchAnnuityPaymentAmountQualifier", "vchAnnuityFrequencyCode", "vchPayoutOption", "vchLivesType", "vchPayoutType", "vchCertainPeriod", "vchIncreasePercentage", "vchAssumedInterestRate", "vchLevelizationIndicator", "vchPrimarySurvivorAdjustmentType", "vchPrimarySurviviorAdjustmentPercentage", "vchJointSurvivorAdjustmentType", "vchJointSurvivorAdjustmentPercentage", "vchExclusionValue", "vchExclustionIndicator", "vchCertainPeriodQualifier", "vchLiquidityOption", "vchLiquidityWaitingPeriod", "vchLiquidityTriggerEvent", "vchLiquidityParital", "vchPaymentStartDate", "vchPaymentEndDate", "vchReturnofPremiumPercentage", "vchPayoutChangeDate", "vchPayoutChangeAmount", "vchPayoutChangeQualifier", "vchPayoutChangeDirectionIndicator", "vchFiller1", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        },
        contractServiceFeatureRecordPVF: {
            tableName: '"DTCC"."Feeds_DTCC_PVF_ContractServiceFeatureRecord"',
            columnNames: '("vchSubmittersCode", "vchRecordType", "vchSequenceNumber", "vchContractNumber", "vchFiller1", "vchServiceFeatureValue", "vchServiceFeatureValueQualifier", "vchServiceFeatureFrequency", "vchFiller2", "vchServiceFeatureStartDate", "vchServiceFeatureStopDate", "vchServiceFeatureExpenseType", "vchServiceFeatureExpense_DollarAmt", "vchServiceFeatureExpense_Percentage", "vchServiceFeatureName", "vchServiceFeatureProductCode", "vchServiceFeatureProgramType", "vchServiceFeatureTypeCode_1", "vchServiceFeatureSub_TypeCode_1", "vchServiceFeatureTypeCode_2", "vchServiceFeatureSub_TypeCode_2", "vchServiceFeatureTypeCode_3", "vchServiceFeatureSub_TypeCode_3", "vchServiceFeatureTypeCode_4", "vchServiceFeatureSub_TypeCode_4", "vchServiceFeatureTypeCode_5", "vchServiceFeatureSub_TypeCode_5", "vchServiceFeatureTypeCode_6", "vchServiceFeatureSub_TypeCode_6", "vchFiller3", "vchRejectCode", "bIsProcessed", "dtInsertedDate", "vchAdvisorLabel", "vchFileName" ,"bFetch")'
        }
    }
}