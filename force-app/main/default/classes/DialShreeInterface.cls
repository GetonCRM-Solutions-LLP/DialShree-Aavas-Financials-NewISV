/**
 * @description :This class provides methods to process the data received from DialShree Disposition using Interface "Extention"
**/
global with sharing class DialShreeInterface {

    global static String callinterfaceMethod(String dataMap){
        if(dataMap != null){
            Call_Log_Configurations__mdt mapppingMeta=[SELECT DeveloperName,
                                                                Apex_Class_Name__c,
                                                                IsActive__c
                                                            FROM Call_Log_Configurations__mdt 
                                                            WHERE DeveloperName = 'Communication_Mappings' WITH SECURITY_ENFORCED limit 1 ];

            if(mapppingMeta.IsActive__c == true){

                String ApexClass = mapppingMeta.Apex_Class_Name__c;
                if(ApexClass != null) {

                    Type externalClassInstance = Type.forName(null , ApexClass);
                    Extention implementation = (Extention)externalClassInstance.newInstance();
                    return implementation.Output(dataMap);

                } else {
                    return null;
                }
            }
        }
        return dataMap;
    }

    // Inner interface
    global interface Extention {
        String Output(String dataMap);
    }
}
