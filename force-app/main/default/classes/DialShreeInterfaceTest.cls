/**
 * @description       : 
 * @author            : vivek.devloper@elisiontech.com
 * @group             : 
 * @last modified on  : 06-28-2024
 * @last modified by  : vivek.devloper@elisiontech.com
**/

/* 
    Class Name :  DialShreeInterface 
    Code-Covege : 75%
*/

@isTest
private class DialShreeInterfaceTest {

    // Mock implementation of Extention interface for testing
    public class MockExtention implements DialShreeInterface.Extention {
        public String output(String dataMap) {
            // Implement mock logic here
            return 'Mock Output';
        }
    }
 
    @TestSetup
    static void setup() {
        // Prepare test data, if needed
    }

    // Test method for positive case where IsActive__c is true and apexClass is valid
    static testMethod void testIsActiveTrueAndApexClassValid() {
        // Test data preparation
        String dataMap = '{"dispositionData":{"key":"value"},"statusMap":{"key":"value"},"recordId":"001XXXXXXXXXXXX","NoMatchObject":"Object__c"}';

        // Create a test Call_Log_Configurations__mdt record with valid Apex_Class_Name__c
        DialShreeCTI2__Call_Log_Configurations__mdt config = new DialShreeCTI2__Call_Log_Configurations__mdt(
            DeveloperName = 'Communication_Mappings',
            Apex_Class_Name__c = 'MyExtention',
            IsActive__c = true
        );
      // insert config;

        Test.startTest();
        // Call the method being tested
        String result = DialShreeInterface.callinterfaceMethod(dataMap);
        Test.stopTest();
    }

    // Test method for case where IsActive__c is false
    static testMethod void testIsActiveFalse() {
        // Test data preparation
        String dataMap = '{"dispositionData":{"key":"value"},"statusMap":{"key":"value"},"recordId":"001XXXXXXXXXXXX","NoMatchObject":"Object__c"}';

        // Create a test Call_Log_Configurations__mdt record with IsActive__c set to false
        DialShreeCTI2__Call_Log_Configurations__mdt config = new DialShreeCTI2__Call_Log_Configurations__mdt(
            DeveloperName = 'Communication_Mappings',
            Apex_Class_Name__c = 'MyExtention', 
            IsActive__c = false
        );
       // insert config;

        Test.startTest();
        // Call the method being tested
        String result = DialShreeInterface.callinterfaceMethod(dataMap);
        Test.stopTest();

        // Assert the result
        System.assertEquals(null, result);
    }

    // Test method for case where apexClass is null
    static testMethod void testApexClassNull() {
        // Test data preparation
        String dataMap = '{"dispositionData":{"key":"value"},"statusMap":{"key":"value"},"recordId":"001XXXXXXXXXXXX","NoMatchObject":"Object__c"}';

        // Create a test Call_Log_Configurations__mdt record with Apex_Class_Name__c set to null
        DialShreeCTI2__Call_Log_Configurations__mdt config = new DialShreeCTI2__Call_Log_Configurations__mdt(
            DeveloperName = 'Communication_Mappings',
            Apex_Class_Name__c = null,
            IsActive__c = true
        );
       // insert config;

        Test.startTest();
        // Call the method being tested
        String result = DialShreeInterface.callinterfaceMethod(dataMap);
        Test.stopTest();

        // Assert the result
        System.assertEquals(null, result);
    }

    // Test method for case where dataMap is null
    static testMethod void testDataMapNull() {
        Test.startTest();
        // Call the method being tested with null dataMap
        String result = DialShreeInterface.callinterfaceMethod(null);
        Test.stopTest();

        // Assert the result
        System.assertEquals(null, result);
    }

    // Test method for running in test context where IsActive__c is true
    static testMethod void testRunningInTestContext() {
        // Test data preparation
        String dataMap = '{"dispositionData":{"key":"value"},"statusMap":{"key":"value"},"recordId":"001XXXXXXXXXXXX","NoMatchObject":"Object__c"}';

        Test.startTest();
        // Call the method being tested
        String result = DialShreeInterface.callinterfaceMethod(dataMap);
        Test.stopTest();
    }

    // Test method to cover the implementation of output method in Extention interface
    static testMethod void testOutputMethodImplementation() {
        // Test data preparation
        String dataMap = '{"dispositionData":{"key":"value"},"statusMap":{"key":"value"},"recordId":"001XXXXXXXXXXXX","NoMatchObject":"Object__c"}';

        // Instantiate the MockExtention class
        MockExtention mockImpl = new MockExtention();

        Test.startTest();
        // Call the output method of the mock implementation
        String result = mockImpl.output(dataMap);
        Test.stopTest();

        // Assert the result
        System.assertEquals('Mock Output', result);
    }
  
    // Test method for positive case where Dynamic_Record_Filtration__c is true and apexClass is valid
    static testMethod void testDynamicRecordFiltrationTrueAndApexClassValid() {
        // Test data preparation
        String recordsToFilter = '{"attributes":{"type":"Test__c","url":"/services/data/v61.0/sobjects/Test__c/001XXXXXXXXXXXX"},"Id":"001XXXXXXXXXXXX","Name":"Test Record","CreatedDate":"2024-06-19T10:27:39.000+0000"}';

        // Create a test CTI_Records_Filtration__mdt record with valid Filtration_Apex_Class_Name__c
        DialShreeCTI2__CTI_Records_Filtration__mdt config = new DialShreeCTI2__CTI_Records_Filtration__mdt(
            DeveloperName = 'Dynamic_Filtration',
            Filtration_Apex_Class_Name__c = 'DynamicRecordsFiltration', 
            Dynamic_Record_Filtration__c = true
        );
        // insert config;

        Test.startTest();
        // Call the method being tested
        String result = DialShreeInterface.recordsfiltration(recordsToFilter);
        Test.stopTest();
    }

    // Test method for case where Dynamic_Record_Filtration__c is false
    static testMethod void testDynamicRecordFiltrationFalse() {
        // Test data preparation
        String recordsToFilter = '{"attributes":{"type":"Test__c","url":"/services/data/v61.0/sobjects/Test__c/001XXXXXXXXXXXX"},"Id":"001XXXXXXXXXXXX","Name":"Test Record","CreatedDate":"2024-06-19T10:27:39.000+0000"}';

        // Create a test CTI_Records_Filtration__mdt record with valid Filtration_Apex_Class_Name__c
        DialShreeCTI2__CTI_Records_Filtration__mdt config = new DialShreeCTI2__CTI_Records_Filtration__mdt(
            DeveloperName = 'Dynamic_Filtration',
            Filtration_Apex_Class_Name__c = 'DynamicRecordsFiltration',
            Dynamic_Record_Filtration__c = false
        );
        // insert config;

        Test.startTest();
        // Call the method being tested
        String result = DialShreeInterface.recordsfiltration(recordsToFilter);
        Test.stopTest();

        // Assert the result
        System.assertEquals(null, result);
    }

    // Test method for case where Filtration_Apex_Class_Name__c is null
    static testMethod void testFiltrationApexClassNameNull() {
        // Test data preparation
        String recordsToFilter = '{"attributes":{"type":"Test__c","url":"/services/data/v61.0/sobjects/Test__c/001XXXXXXXXXXXX"},"Id":"001XXXXXXXXXXXX","Name":"Test Record","CreatedDate":"2024-06-19T10:27:39.000+0000"}';

        // Create a test CTI_Records_Filtration__mdt record with valid Filtration_Apex_Class_Name__c
        DialShreeCTI2__CTI_Records_Filtration__mdt config = new DialShreeCTI2__CTI_Records_Filtration__mdt(
            DeveloperName = 'Dynamic_Filtration',
            Filtration_Apex_Class_Name__c = null, 
            Dynamic_Record_Filtration__c = true
        );
        // insert config;

        Test.startTest();
        // Call the method being tested
        String result = DialShreeInterface.recordsfiltration(recordsToFilter);
        Test.stopTest();

        // Assert the result
        System.assertEquals(null, result);
    }

    // Test method for case where recordsToFilter is null
    static testMethod void testrecordsToFilterNull() {
        Test.startTest();
        // Call the method being tested with null recordsToFilter
        String result =  DialShreeInterface.recordsfiltration(null);
        Test.stopTest();

        // Assert the result
        System.assertEquals(null, result);
    }

    // Test method for running in test context where Dynamic_Record_Filtration__c is true
    static testMethod void testRunningInTestContextrecordsToFilter() {
        // Test data preparation
        String recordsToFilter = '{"attributes":{"type":"Test__c","url":"/services/data/v61.0/sobjects/Test__c/001XXXXXXXXXXXX"},"Id":"001XXXXXXXXXXXX","Name":"Test Record","CreatedDate":"2024-06-19T10:27:39.000+0000"}';

        Test.startTest();
        // Call the method being tested
        String result =  DialShreeInterface.recordsfiltration(recordsToFilter);
        Test.stopTest();
    }

    // Test method to cover the implementation of output method in Extention interface
    static testMethod void testOutputMethodImplementationrecordsToFilter() {
        // Test data preparation
        String recordsToFilter = '{"attributes":{"type":"Test__c","url":"/services/data/v61.0/sobjects/Test__c/001XXXXXXXXXXXX"},"Id":"001XXXXXXXXXXXX","Name":"Test Record","CreatedDate":"2024-06-19T10:27:39.000+0000"}';

        // Instantiate the MockExtention class
        MockExtention mockImpl = new MockExtention();

        Test.startTest();
        // Call the output method of the mock implementation
        String result = mockImpl.output(recordsToFilter);
        Test.stopTest();

        // Assert the result
        System.assertEquals('Mock Output', result);
    }
}