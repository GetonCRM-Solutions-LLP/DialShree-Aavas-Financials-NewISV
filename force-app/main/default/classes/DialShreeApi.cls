/**
 * @description :This class provides methods to interact with DialShree settings and user information.
*/
public with sharing class DialShreeApi {
    /**
     * @param 
     * @return String
	 * @description :  Initializes the apiMeta and dialCs properties by calling respective methods 
     *                to fetch DialShree service settings and user information.
	*/
    public static Dialshree_API_1__mdt apiMeta {get;set;} 
    /**
     * @param 
     * @return String
	 * @description :  Initializes the apiMeta and dialCs properties by calling respective methods 
     *                to fetch DialShree service settings and user information.
	*/
    public static DialShree_UserInfo__c dialCs {get;set;}

    /**
     * @param 
	 * @description : Initializes the apiMeta and dialCs properties by calling respective methods 
     *                to fetch DialShree service settings and user information.
	*/
    public DialShreeApi() {
        apiMeta = getServiceSettings(); 
        dialCs = dialUserInfoCs();  
    }
   
    /**
     * @param 
     * @return String
	 * @description :  Retrieves DialShree service settings such as base URL, 
     *                 login details, and country code.
	*/
    @AuraEnabled(cacheable=true)
    public static Dialshree_API_1__mdt getServiceSettings(){
        
        if (apiMeta != null)
        {
            return apiMeta;
        }
        try {
            apiMeta = [SELECT MasterLabel,
                              Label,
                              DeveloperName,
                              Base_Url__c,
                              Login__c,
                              Country_Code__c
                       FROM Dialshree_API_1__mdt 
                       WHERE DeveloperName = 'Dialshree' WITH SECURITY_ENFORCED limit 1 ];
        } catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return  apiMeta; 
    }
    
    /**
     * @param 
     * @return String
	 * @description :  Fetches DialShree user information like username, password, 
     *                 and associated Salesforce user.
	*/
    @AuraEnabled(cacheable=true)
    public static DialShree_UserInfo__c dialUserInfoCs(){
        if (dialCs != null)
        {
            return dialCs;
        }
        
        try {
            dialCs = [SELECT Name,
                             Dialshree_User__c,
                             Dialshree_Password__c,
                             Salesforce_User__c
                      FROM DialShree_UserInfo__c 
                      WHERE Salesforce_User__c =: UserInfo.getUserName() WITH SECURITY_ENFORCED limit 1 ];
        } catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return  dialCs;
    }

    /**
     * @param 
     * @return String
	 * @description :  Creates an instance of WrapConstants class and populates it with constants 
     *                 related to API actions such as login, logout, pause, resume, etc.
	*/
    @AuraEnabled(cacheable=true)
    public static WrapConstants apiWrapperList() { 
        WrapConstants wrapConst = new WrapConstants();
        //wrapConst.LOGIN = Constants.LOGIN;
        wrapConst.status = Label.Status_API;
        wrapConst.disposition = Label.Disposition_API;
        wrapConst.dispositionList = Label.Disposition_List_API;
        wrapConst.hangUp = Label.hangUp_API;
        wrapConst.logout = Label.Logout_API;
        wrapConst.manualDial = Label.Manual_Dial_API;
        wrapConst.park = Label.Park_API;
        wrapConst.pause = Label.Pause_API;
        wrapConst.pauseCode = Label.Pause_Code_API;
        wrapConst.pauseList = Label.Pause_List_API;
        wrapConst.resume = Label.Resume_API;
        wrapConst.transfer = Label.Transfer_API;
        wrapConst.transferGroupList = Label.Transfer_Group_List_API;
        wrapConst.transferAgentList = Label.Transfer_Agent_List_API;
        wrapConst.regenerateSession = Label.Regenerate_Session_API;
        return wrapConst;
    }

    /**
     * @param 
     * @return String
	 * @description :  This inner class defines constants related to DialShree API actions.
	*/
    public class WrapConstants {
        //  @AuraEnabled
        //  public string LOGIN {get; set;}
        /**
         * @param 
         * @return String
         * @description :  Represents the status API.
        */
        @AuraEnabled
        public string status {get; set;}
        /**
         * @param 
         * @return String
         * @description :  Represents the disposition API.
        */
        @AuraEnabled
        public string disposition {get; set;}
        /**
         * @param 
         * @return String
         * @description :  Represents the disposition list API.
        */
        @AuraEnabled
        public string dispositionList {get; set;}
        /**
         * @param 
         * @return String
         * @description :  Represents the hang-up API.
        */
        @AuraEnabled
        public string hangUp {get; set;}
        /**
         * @param 
         * @return String
         * @description :  Represents the logout API.
        */
        @AuraEnabled
        public string logout {get; set;}
        /**
         * @param 
         * @return String
         * @description :  Represents the manual dial API.
        */
        @AuraEnabled
        public string manualDial {get; set;}
        /**
         * @param 
         * @return String
         * @description :   Represents the park API.
        */
        @AuraEnabled
        public string park {get; set;}
        /**
         * @param 
         * @return String
         * @description :   Represents the pause API.
        */
        @AuraEnabled
        public string pause {get; set;}
        /**
         * @param 
         * @return String
         * @description :  Represents the pause code API.
        */
        @AuraEnabled
        public string pauseCode {get; set;}
        /**
         * @param 
         * @return String
         * @description :  Represents the pause list API..
        */
        @AuraEnabled
        public string pauseList {get; set;}
        /**
         * @param 
         * @return String
         * @description :  Represents the resume API
        */
        @AuraEnabled
        public string resume {get; set;}
        /**
         * @param 
         * @return String
         * @description :   Represents the transfer API.
        */
        @AuraEnabled
        public string transfer {get; set;}
        /**
         * @param 
         * @return String
         * @description :  Represents the transfer group list API.
        */
        @AuraEnabled
        public string transferGroupList {get; set;}
        /**
         * @param 
         * @return String
         * @description :  Represents the transfer agent list API.
        */
        @AuraEnabled
        public string transferAgentList {get; set;}
        /**
         * @param 
         * @return String
         * @description :  Represents the regenerate session API..
        */
        @AuraEnabled
        public string regenerateSession {get; set;}
    }
}