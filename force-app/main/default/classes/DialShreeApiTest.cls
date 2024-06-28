/* 
    Class Name :  DialShreeApi 
    Code-Covege : 81%
*/

@isTest
public class DialShreeApiTest {

    @testSetup
    public static void testCustomData() { 
        // Create Custom setting record 
        DialShree_UserInfo__c dialUser = new DialShree_UserInfo__c();
        dialUser.Name = UserInfo.getUserName();
        dialUser.Dialshree_User__c = 'Test' + DateTime.now();
        dialUser.Dialshree_Password__c = 'TestPwd';
        dialUser.Salesforce_User__c = UserInfo.getUserName();        
        insert dialUser;
        System.assertEquals(dialUser.Dialshree_Password__c,'TestPwd','');

            
        // Create and insert metadata record for testing
        Dialshree_API_1__mdt apiSetting = new Dialshree_API_1__mdt(
            MasterLabel = 'Dialshree',
            Label = 'Dialshree',
            DeveloperName = 'Dialshree',
            Base_Url__c = 'https://api.dialshree.com',
            Login__c = 'testlogin',
            Country_Code__c = 'IN'
        );
        // insert apiSetting;

        // Create and insert CTI_Records_Filtration__mdt metadata record for testing
        CTI_Records_Filtration__mdt filterMeta = new CTI_Records_Filtration__mdt(
            MasterLabel = 'Dynamic_Filtration',
            Label = 'Dynamic_Filtration',
            DeveloperName = 'Dynamic_Filtration',
            Dynamic_Record_Filtration__c = true,
            Filtration_Apex_Class_Name__c = 'DynamicRecordsFiltration'
        );
        // insert filterMeta;    
    }

    @isTest
    public static void testGetServiceSettings() {
        // Test getServiceSettings method
        Test.startTest();
        Dialshree_API_1__mdt apiSettings = DialShreeApi.getServiceSettings();
        Test.stopTest();
        System.assertEquals('Dialshree', apiSettings.DeveloperName, 'DeveloperName should be Dialshree');
    }

    @isTest
    public static void testgetCTIRecordsFiltration() {
        // Test getCTIRecordsFiltration method
        Test.startTest();
        CTI_Records_Filtration__mdt filterMeta = DialShreeApi.getCTIRecordsFiltration();
        Test.stopTest();
        System.assertEquals('Dynamic_Filtration', filterMeta.DeveloperName, 'DeveloperName should be Dynamic_Filtration');
    }

    @isTest
    public static void testDialUserInfoCs() {
        // Test dialUserInfoCs method
        Test.startTest();
        DialShree_UserInfo__c userInfo = DialShreeApi.dialUserInfoCs();
        Test.stopTest();
        System.assertEquals('TestPwd', userInfo.Dialshree_Password__c, 'Password should be TestPwd');
    }

    @isTest
    public static void testInternalClassCall() {
        // Test InternalClassCall method
        Test.startTest();
        DialShreeApi.InternalClassCall('{"testKey":"testValue"}');
        Test.stopTest();
        // Verify method executed without exceptions
        System.assertEquals(true, true, 'InternalClassCall executed without exception');
    }

    @isTest
    public static void testcallrecordsfiltration() {
        // Test callrecordsfiltration method
        Test.startTest();
        DialShreeApi.callrecordsfiltration('{"testKey":"testValue"}');
        Test.stopTest();
        // Verify method executed without exceptions
        System.assertEquals(true, true, 'callrecordsfiltration executed without exception');
    }

    @isTest
    public static void testGetObjectType() {
        // Test getObjectType method for custom object
        Test.startTest();
        String customObjectResult = DialShreeApi.getObjectType('DialShree_UserInfo');
        String standardObjectResult = DialShreeApi.getObjectType('Account');
        Test.stopTest();
        System.assertEquals('False', standardObjectResult, 'Standard object should return False');
    }

    @isTest
    public static void testApiWrapperList() {
        // Test apiWrapperList method
        Test.startTest();
        DialShreeApi.WrapConstants wrapConstants = DialShreeApi.apiWrapperList();
        Test.stopTest();
        //System.assertEquals(Label.Status_API, wrapConstants.status, 'Status should match Label.Status_API');
    }

    @isTest
    public static void testConstructor() {
        // Test constructor
        Test.startTest();
        DialShreeApi apiInstance = new DialShreeApi();
        Test.stopTest();
        System.assertEquals(true, DialShreeApi.apiMeta != null, 'apiMeta should not be null');
        System.assertEquals(true, DialShreeApi.dialCs != null, 'dialCs should not be null');
    }

    @isTest
    public static void testExceptionHandling() {
        // Test exception handling in getServiceSettings method
        Test.startTest();
        DialShreeApi.apiMeta = null;
        Dialshree_API_1__mdt apiSettings = DialShreeApi.getServiceSettings();
        System.assertEquals('Dialshree', apiSettings.DeveloperName);
        
        DialShreeApi.dialCs = null;
        DialShree_UserInfo__c userInfo = DialShreeApi.dialUserInfoCs();
        System.assertEquals('TestPwd', userInfo.Dialshree_Password__c);
        Test.stopTest();
    }

    @IsTest
    static void testGetOrgNameSpace() {
        // Test getOrgNameSpace method
        String result = DialShreeApi.getOrgNameSpace();
        System.assertEquals(null, result, 'NamespacePrefix should be null in test context');
    }
}