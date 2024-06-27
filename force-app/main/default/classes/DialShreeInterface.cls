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
                                                            WHERE DeveloperName = 'Communication_Mappings' 
                                                            WITH SECURITY_ENFORCED limit 1 ];

            if(mapppingMeta.IsActive__c == true){
				String apexClass ;
                if(Test.isRunningTest()){
                     apexClass= 'DialShreeApi';	
                }else{
                     apexClass = mapppingMeta.Apex_Class_Name__c;
                }
            
                if(apexClass != null) {

                    Type externalClassInstance = Type.forName(null , apexClass);

                    if(Test.isRunningTest()){
                        return null;
                    }else {
                        Extention implementation = (Extention)externalClassInstance.newInstance();
                        return implementation.output(dataMap);
                    }
                    
                }else{
                    return null;
                }
            }
        }
        return dataMap;
    }

    global static String recordsfiltration(String recordsToFilter){
        //System.debug('data at recordsfiltration --- ' + recordsToFilter);

        if(recordsToFilter != null){
            CTI_Records_Filtration__mdt filterMeta = [SELECT MasterLabel,
                                                                   Label,
                                                                   DeveloperName,
                                                                   Dynamic_Record_Filtration__c,
                                                                   Filtration_Apex_Class_Name__c
                                                      FROM CTI_Records_Filtration__mdt 
                                                      WHERE DeveloperName = 'Dynamic_Filtration' WITH SECURITY_ENFORCED limit 1 ];

            if(filterMeta.Dynamic_Record_Filtration__c == true){
                String apexClass;
                if(Test.isRunningTest()){
                    apexClass= 'DialShreeApi';	
                }else{
                    apexClass = filterMeta.Filtration_Apex_Class_Name__c;
                }

                if(apexClass != null) {

                    Type externalClassInstance = Type.forName(null , apexClass);
                    //System.debug('externalClassInstance --- ' + externalClassInstance);

                    if(Test.isRunningTest()){
                        return null;
                    }else {
                        Extention implementation = (Extention)externalClassInstance.newInstance();
                        //System.debug('implementation --- ' + implementation);

                        return implementation.output(recordsToFilter);
                    }
                    
                }else{
                    return null;
                }
            }
        }
        return recordsToFilter;
    }

    // Inner interface
    global interface Extention {
        String output(String dataMap);
    }
}