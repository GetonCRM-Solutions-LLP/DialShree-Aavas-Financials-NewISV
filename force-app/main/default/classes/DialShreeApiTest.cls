/* 
    Class Name :  DialShreeApi 
    Code-Covege : 77%
*/

@isTest
public class DialShreeApiTest {
    @isTest
    public static void testCustomData() { 
        // Create Custom setting record 
        DialShree_UserInfo__c dialUser = new DialShree_UserInfo__c();
        dialUser.Name = UserInfo.getUserName();
        dialUser.Dialshree_User__c = 'Test' + DateTime.now();
        dialUser.Dialshree_Password__c = 'TestPwd';
        dialUser.Salesforce_User__c = UserInfo.getUserName();        
        insert dialUser;
        System.assertEquals(dialUser.Dialshree_Password__c,'TestPwd','');

        DialShreeApi.getServiceSettings();
        DialShreeApi.dialUserInfoCs();      
        DialShreeApi.apiWrapperList();     
    }
}