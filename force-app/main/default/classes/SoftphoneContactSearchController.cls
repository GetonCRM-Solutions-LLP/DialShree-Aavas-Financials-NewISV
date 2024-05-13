/*
Copyright 2016 salesforce.com, inc. All rights reserved.

Use of this software is subject to the salesforce.com Developerforce Terms of Use and other applicable terms that salesforce.com may make available, as may be amended from time to time. You may not decompile, reverse engineer, disassemble, attempt to derive the source code of, decrypt, modify, or create derivative works of this software, updates thereto, or any part thereof. You may not use the software to engage in any development activity that infringes the rights of a third party, including that which interferes with, damages, or accesses in an unauthorized manner the servers, networks, or other properties or services of salesforce.com or any third party.

WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL SALESFORCE.COM HAVE ANY LIABILITY FOR ANY DAMAGES, INCLUDING BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR DAMAGES BASED ON LOST PROFITS, DATA OR USE, IN CONNECTION WITH THE SOFTWARE, HOWEVER CAUSED AND, WHETHER IN CONTRACT, TORT OR UNDER ANY OTHER THEORY OF LIABILITY, WHETHER OR NOT YOU HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
*/

/**
 * @description : The SoftphoneContactSearchController class is designed to facilitate contact searching 
    functionality for a softphone application within the Salesforce platform.
*/
global class SoftphoneContactSearchController {
    /**
     * @param softPhoneParams softPhoneParams
     * @return String
	 * @description : The SoftphoneContactSearchController Apex class provides a method getContacts designed to handle 
        search requests from a softphone interface. Upon receiving parameters from the softphone, it 
        decodes and parses them to extract the search criteria and softphone layout information. Utilizing
        this data, the method constructs a SOSL query to search for matching contacts across various 
        Salesforce objects. The search results are then serialized into JSON format and returned to the 
        softphone interface. This class facilitates seamless integration between Salesforce and softphone 
        systems, enabling efficient contact retrieval based on user-defined search parameters.
	*/
    webService static String getContacts(String softPhoneParams) {

        try {
            String decodedsoftPhoneParams = EncodingUtil.urlDecode(softPhoneParams, 'UTF-8');
            Map<String, Object> softPhoneConfigMap = (Map<String, Object>) JSON.deserializeUntyped(decodedsoftPhoneParams);
            String searchValue = (String) softPhoneConfigMap.get('searchvalue');
            system.debug('searchValue -------->  ' +searchValue);
            String softPhoneLayoutJSON = (String) softPhoneConfigMap.get('softPhoneLayoutJSON');
            system.debug('softPhoneLayoutJSON ------------>  ' +softPhoneLayoutJSON);
            Map<String, Object> resultMap = (Map<String, Object>) JSON.deserializeUntyped(softPhoneLayoutJSON);
            system.debug('resultMap ------------>  ' +resultMap);
            // Accessed the objects node from the resultMap
            Map<String, Object> objectsMap = (Map<String, Object>) ((Map<String, Object>) ((Map<String, Object>) resultMap.get('returnValue')).get('Inbound')).get('objects');
            system.debug('objectsMap ------------>  ' +objectsMap);
            // Extract the keys from the objects node
            List<String> objectKeys = new List<String>();
            for (String key : objectsMap.keySet()) {
                objectKeys.add(key);
            }
            system.debug('objectKeys ------------>  ' +objectKeys);
    
            String soslQueryString = 'FIND \'' + searchValue + '\' IN ALL FIELDS RETURNING ';
            system.debug('soslQueryString ------------>  ' +soslQueryString);
    
            String objQueryString ;
            system.debug('objQueryString ------------>  ' +objQueryString);
    
            for (String objectKey : objectKeys) {
                if(objQueryString == null){
                    objQueryString = objectKey + '(Id,Phone,Name)';
                }else{
                    objQueryString =  objQueryString +','+ objectKey + '(Id,Phone,Name)';
                }
            }      
            soslQueryString = soslQueryString + objQueryString;
            system.debug('soslQueryString :::: ------------>  ' +soslQueryString);
            List<List<SObject>> searchList = search.query(soslQueryString);
            system.debug('searchList ------------>  ' +JSON.serialize(searchList));
            return JSON.serialize(searchList); 
        } catch (Exception ex) {
             
            return JSON.serialize(new Map<String, String>{'error' => ex.getMessage()});
        }
         
    }
}