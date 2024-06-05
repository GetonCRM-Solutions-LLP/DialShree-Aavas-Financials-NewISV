/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 06-05-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class MultipleRecordsController {
    public String MobileNumber { get; set; }

    public MultipleRecordsController() {
        // Retrieve the phone number from the input variable
        MobileNumber = ApexPages.currentPage().getParameters().get('MobileNumber');
    }
}