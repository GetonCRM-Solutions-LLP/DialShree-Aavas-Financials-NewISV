/*
Copyright 2016 salesforce.com, inc. All rights reserved.

Use of this software is subject to the salesforce.com Developerforce Terms of Use and other applicable terms that salesforce.com may make available, as may be amended from time to time. You may not decompile, reverse engineer, disassemble, attempt to derive the source code of, decrypt, modify, or create derivative works of this software, updates thereto, or any part thereof. You may not use the software to engage in any development activity that infringes the rights of a third party, including that which interferes with, damages, or accesses in an unauthorized manner the servers, networks, or other properties or services of salesforce.com or any third party.

WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL SALESFORCE.COM HAVE ANY LIABILITY FOR ANY DAMAGES, INCLUDING BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR DAMAGES BASED ON LOST PROFITS, DATA OR USE, IN CONNECTION WITH THE SOFTWARE, HOWEVER CAUSED AND, WHETHER IN CONTRACT, TORT OR UNDER ANY OTHER THEORY OF LIABILITY, WHETHER OR NOT YOU HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
*/

/* 
    Class Name :  SoftphoneContactSearchController 
    Code-Covege : 86%
*/
@isTest
private class SoftphoneContactSearchControllerTest {

    @isTest
    static void testGetContacts() {
        // Test data setup
        Account acc = new Account(Name = 'Test Account');
        insert acc;
        Contact con = new Contact(FirstName = 'Test', LastName = 'Contact', AccountId = acc.Id, Phone = '1234567890');
        insert con;
        Contact conWithSearchValue = new Contact(FirstName = 'Test', LastName = 'WithSearch', AccountId = acc.Id, Phone = '1234567890');
        insert conWithSearchValue;
        
        // Prepare the JSON input for the web service call
        Map<String, Object> softPhoneConfigMap = new Map<String, Object>{
            'searchvalue' => 'WithSearch', // Ensure the search value matches the contact's name
            'softPhoneLayoutJSON' => '{"returnValue":{"Inbound":{"objects":{"Contact":{}}}}}'
        };
        String softPhoneParams = EncodingUtil.urlEncode(JSON.serialize(softPhoneConfigMap), 'UTF-8');
        
        // Call the web service method
        Test.startTest();
        String result = SoftphoneContactSearchController.getContacts(softPhoneParams);
        Test.stopTest();
        
        // Check the result
        List<List<Contact>> searchResults = (List<List<Contact>>) JSON.deserialize(
            result, 
            List<List<Contact>>.class
        );
        System.assertEquals(1, searchResults.size(), 'Expected one search result');
    }
}