/*
Copyright 2016 salesforce.com, inc. All rights reserved.

Use of this software is subject to the salesforce.com Developerforce Terms of Use and other applicable terms that salesforce.com may make available, as may be amended from time to time. You may not decompile, reverse engineer, disassemble, attempt to derive the source code of, decrypt, modify, or create derivative works of this software, updates thereto, or any part thereof. You may not use the software to engage in any development activity that infringes the rights of a third party, including that which interferes with, damages, or accesses in an unauthorized manner the servers, networks, or other properties or services of salesforce.com or any third party.

WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL SALESFORCE.COM HAVE ANY LIABILITY FOR ANY DAMAGES, INCLUDING BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR DAMAGES BASED ON LOST PROFITS, DATA OR USE, IN CONNECTION WITH THE SOFTWARE, HOWEVER CAUSED AND, WHETHER IN CONTRACT, TORT OR UNDER ANY OTHER THEORY OF LIABILITY, WHETHER OR NOT YOU HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
*/


/* global $A */
/* global sforce */

({
    // get call center settings, to get the information about the call provider
    // then use open CTI to screen pop to the record, and runApex() to make a call
    screenPopAndCall: function(cmp) {
        try {
            //console.log(JSON.stringify(cmp.get('v.searchResults')));
            //console.log("data at screenpop ---- " , cmp.get('v.searchResults'));
            if(cmp.get ('v.isChecked') == false){
            //console.log('screenPopAndCall method called');
            let IsCustomObject = false;
            let objName;
            let orgNameSpace = null;

            var getOrgNameSpace = cmp.get("c.getOrgNameSpace");
            getOrgNameSpace.setCallback(this,function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    //console.log('org NameSpace --- ' , response.getReturnValue());
                    orgNameSpace = response.getReturnValue();
                    //console.log("Assigned org NameSpace ----- " , orgNameSpace);
                    cmp.getEvent('getSettings').setParams({
                        callback: function(settings) {
                            //console.log('getSettings callback executed');
                            //console.log(JSON.stringify(cmp.get('v.searchResults')));
                            let records = JSON.parse(cmp.get('v.searchResults'));
                            //let records = cmp.get('v.searchResults');
                            let recordId = cmp.get('v.recordId');
                            //console.log('Records found: ------------- ', JSON.stringify(records));
                            if (records != null) {
                                //console.log('Total Records found: ------------- ', records.length);
                            }
                            //console.log('Record ID: ------------------ ', recordId);
            
                            sforce.opencti.getSoftphoneLayout({
                                callback: function(result) {
                                    let softPhoneLayout = JSON.parse(JSON.stringify(result));
                                    //console.log('softPhoneLayout ----------> ', JSON.stringify(softPhoneLayout));
                                    let screenPopType = softPhoneLayout.returnValue.Inbound.screenPopSettings.MultipleMatches.screenPopType;
                                    //console.log('Screen Pop Type: ------------ ', screenPopType);
                                    let screenPopData = softPhoneLayout.returnValue.Inbound.screenPopSettings.MultipleMatches.screenPopData;
            
                                    var phoneNumber = cmp.get('v.phone');
                                    //console.log('phoneNumber -------------->' + encodeURIComponent(phoneNumber));
            
                                    if (cmp.get("v.listViewCall") == true) {
                                        //console.log('record id for calls from list view --- ', recordId);
                                        sforce.opencti.screenPop({
                                            type: sforce.opencti.SCREENPOP_TYPE.SOBJECT,
                                            params: { recordId: recordId },
                                            callback: function(response) {
                                               //console.log('SObject screenPop callback executed');
                                                cmp.getEvent('editPanel').setParams({
                                                    label: 'Open CTI Softphone: ' + cmp.get('v.state')
                                                }).fire();
                                            }
                                        });
                                    } else if (records && records.length > 1) {
                                        //console.log('Multiple records found -----------' + records.length);
                                        if (screenPopType === 'PopToVisualforce') {
                                            //console.log('Redirecting to VF page.');
                                            sforce.opencti.setSoftphonePanelVisibility({
                                                visible: true,
                                                callback: function() {}
                                            });
                                            //console.log('screenPop Closed -------');
                                            sforce.opencti.screenPop({
                                                type: sforce.opencti.SCREENPOP_TYPE.URL,
                                                params: {
                                                    url: '/apex/' + screenPopData + '?MobileNumber=' + encodeURIComponent(phoneNumber)
                                                },
                                            });
                                        } else if (screenPopType === 'PopToFlow') {
                                            //console.log('Redirecting to Flow.');
                                            sforce.opencti.screenPop({
                                                type: sforce.opencti.SCREENPOP_TYPE.FLOW,
                                                params: {
                                                    flowDevName: screenPopData,
                                                    flowArgs: [{ name: 'phoneNumber', type: 'String', value: phoneNumber }]
                                                },
                                                callback: function(response) {
                                                    // Additional logic can be added here if needed
                                                }
                                            });
                                        }  else if (screenPopType != 'PopToFlow' || screenPopType != 'PopToVisualforce'){
                                            if (cmp.get('v.recordId') != undefined) {
                                            sforce.opencti.screenPop({
                                                type: sforce.opencti.SCREENPOP_TYPE.SOBJECT,
                                                params: { recordId: cmp.get('v.recordId') },
                                            });
                                            }
                                        }
                                    } else if (records && records.length === 1) {
                                        recordId = records[0].Id;
                                        //console.log('Single record found. Opening record with ID:', recordId);
                                        sforce.opencti.screenPop({
                                            type: sforce.opencti.SCREENPOP_TYPE.SOBJECT,
                                            params: { recordId: recordId },
                                            callback: function(response) {
                                                //console.log('SObject screenPop callback executed');
                                                cmp.getEvent('editPanel').setParams({
                                                    label: 'Open CTI Softphone: ' + cmp.get('v.state')
                                                }).fire();
                                            }
                                        });
                                    } else {
                                        //console.log('No records found.');
                                        let noMatchObj = softPhoneLayout.returnValue.Inbound.screenPopSettings.NoMatch.screenPopData;
                                        //console.log('noMatchObj --- ' , noMatchObj);
        
                                        if (orgNameSpace != null && orgNameSpace != 'undefined'){
                                            objName = orgNameSpace + '__'+ noMatchObj;
                                            //console.log('objectName With NameSpace --- ' , objName);
        
                                            var getObjectType = cmp.get("c.getObjectType");
                                            getObjectType.setParams({
                                                objectName : objName
                                            });
        
                                            getObjectType.setCallback(this, (response) => {
                                                var state = response.getState();
                                                if (state === "SUCCESS") {
                                                    //console.log('returned result --- ' , response.getReturnValue());
        
                                                    if (response.getReturnValue() == 'True') {
                                                        IsCustomObject = true;
                                                    }
                                                    //console.log('IsCustomObject --- ' , IsCustomObject);
        
                                                    if (noMatchObj != null && noMatchObj != undefined) {
                                                        if (IsCustomObject == true) {
                                                            let customObjectName = noMatchObj +  '__c';
                                                            //console.log('customObjectName ----'  , customObjectName);
                                                        
                                                            let entityName = orgNameSpace + '__' + customObjectName;
                                                            //console.log('entityName ---- ',entityName );
        
                                                            sforce.opencti.screenPop({
                                                                type: sforce.opencti.SCREENPOP_TYPE.NEW_RECORD_MODAL,
                                                                params: {
                                                                    entityName: entityName
                                                                },
                                                                callback: function(result) {
                                                                    if (result.success) {
                                                                        //console.log('New record modal opened successfully');
                                                                    } else {
                                                                        console.error('Error opening new record modal:', result.errors);
                                                                    }
                                                                }
                                                            });
        
                                                        }else{
                                                            sforce.opencti.screenPop({
                                                                type: sforce.opencti.SCREENPOP_TYPE.NEW_RECORD_MODAL,
                                                                params: {
                                                                    entityName: noMatchObj
                                                                },
                                                                callback: function(result) {
                                                                    if (result.success) {
                                                                        //console.log('New record modal opened successfully');
                                                                    } else {
                                                                        console.error('Error opening new record modal:', result.errors);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }
                                                } else {
                                                    var errors = response.getError();
                                                    console.log('found errors' , errors);
                                                }
                                            });
                                            $A.enqueueAction(getObjectType);
        
                                        } else {
        
                                            objName = noMatchObj;
                                            //console.log('objectName Without NameSpace --- ' , objName);
        
                                            var getObjectType = cmp.get("c.getObjectType");
                                            getObjectType.setParams({
                                                objectName : objName
                                            });
        
                                            getObjectType.setCallback(this, (response) => {
                                                var state = response.getState();
                                                if (state === "SUCCESS") {
                                                    //console.log('returned result --- ' , response.getReturnValue());
        
                                                    if (response.getReturnValue() == 'True') {
                                                        IsCustomObject = true;
                                                    }
                                                    //console.log('IsCustomObject --- ' , IsCustomObject);
        
                                                    if (noMatchObj != null && noMatchObj != undefined) {
                                                        if (IsCustomObject == true) {
                                                            let customObjectName = noMatchObj +  '__c';
                                                            //console.log('customObjectName ----'  , customObjectName);
                                                        
                                                            let entityName = customObjectName;
                                                            //console.log('entityName ---- ',entityName );
        
                                                            sforce.opencti.screenPop({
                                                                type: sforce.opencti.SCREENPOP_TYPE.NEW_RECORD_MODAL,
                                                                params: {
                                                                    entityName: entityName
                                                                },
                                                                callback: function(result) {
                                                                    if (result.success) {
                                                                        //console.log('New record modal opened successfully');
                                                                    } else {
                                                                        console.error('Error opening new record modal:', result.errors);
                                                                    }
                                                                }
                                                            });
        
                                                        }else{
                                                            sforce.opencti.screenPop({
                                                                type: sforce.opencti.SCREENPOP_TYPE.NEW_RECORD_MODAL,
                                                                params: {
                                                                    entityName: noMatchObj
                                                                },
                                                                callback: function(result) {
                                                                    if (result.success) {
                                                                        //console.log('New record modal opened successfully');
                                                                    } else {
                                                                        console.error('Error opening new record modal:', result.errors);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }
                                                } else {
                                                    var errors = response.getError();
                                                    console.log('found errors' , errors);
                                                }
                                            });
                                            $A.enqueueAction(getObjectType);
                                        }
                                    }
                                }
                            });
                        }
                    }).fire();
                    cmp.set("v.showCallPanel", false);

                    // console.log('Got namespace ----' ,response.getReturnValue());
                    // if(response.getReturnValue() != null && response.getReturnValue() != 'undefined'){
                    //     orgNameSpace = response.getReturnValue();
                    // }
                }
            });
            $A.enqueueAction(getOrgNameSpace);
        } 
        } catch (error) {
            console.log('error at screenPopAndCall method of callInitiatedPanelHelper --- ', JSON.stringify(error));
            console.log('error message at screenPopAndCall method of callInitiatedPanelHelper --- ', JSON.stringify(error.message));
        }
    },
    // on Accept, accept the call by bringing up the Connected Panel
    renderConnectedPanel : function(cmp){
        try{
            var recordId = cmp.get('v.recordId');        
            var account = cmp.get('v.account');        
            cmp.getEvent('renderPanel').setParams({
                type : 'c:connectedPanel',
                attributes : {
                    showDialPad : false,
                    recordId : recordId,
                    callType : 'Inbound',
                    account : account,
                    recordName: cmp.get('v.recordName'),
                    presence : cmp.get('v.presence')
                }
            }).fire();
        }
        catch (error) {
            console.log('error at renderConnectedPanel method of callInitiatedPanelHelper --- ' , JSON.stringify(error));
            console.log('error message at renderConnectedPanel method of callInitiatedPanelHelper --- ' , JSON.stringify(error.message));
        }          
    },
    
    apiData : function(cmp, event, helper) {  
        try{
            var action = cmp.get("c.getServiceSettings");
            action.setCallback(this,function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    cmp.set("v.baseUrl",response.getReturnValue().DialShreeCTI2__Base_Url__c);
                    cmp.set("v.countryCodeMeta",response.getReturnValue().DialShreeCTI2__Country_Code__c);
                }
            });
            
            var action2 = cmp.get("c.dialUserInfoCs");
            action2.setCallback(this,function(response){
                var state = response.getState();
                if (state === "SUCCESS") {                
                    cmp.set("v.dialUser",response.getReturnValue().DialShreeCTI2__Dialshree_User__c);
                    cmp.set("v.dialPwd",response.getReturnValue().DialShreeCTI2__Dialshree_Password__c);
                }
            });

            var action3 = cmp.get("c.apiWrapperList");
            action3.setCallback(this,function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    cmp.set("v.wapperApiObj",response.getReturnValue());
                    this.screenPopAndCall(cmp);
                }
            });
            $A.enqueueAction(action);
            $A.enqueueAction(action2);
            $A.enqueueAction(action3);
        }   
        catch (error) {
            console.log('error at apiData method of callInitiatedPanelHelper --- ' , JSON.stringify(error));
            console.log('error message at apiData method of callInitiatedPanelHelper --- ' , JSON.stringify(error.message));
        }  
        
    },

    parkGrabHangJquery : function(cmp, methodUrl, param) { 
        try{
            var parkGrabHangUrl = cmp.get("v.baseUrl") + methodUrl + param + '&agent_user=' + cmp.get("v.dialUser");
            // if(cmp.get('v.inputText') !=  null && cmp.get('v.inputText') != 'undefined'){
            //    var inputText = cmp.get('v.inputText');
            // }
            
            fetch(parkGrabHangUrl)
                .then(response => {
                   return response.json();
                })
                .then(data => {
                    if (data.status) {
                        if (param == '&value=PARK_CUSTOMER') {
                            cmp.set("v.isPark", false);
                        }
                        if (param == '&value=GRAB_CUSTOMER') {
                            cmp.set("v.isPark", true);
                        }
                        if (methodUrl == cmp.get("v.wapperApiObj").hangUp) {
                            cmp.getEvent('renderPanel').setParams({
                                type: 'c:DialShreeDisposition',
                                toast: {
                                    'type': 'normal',
                                    'message': 'Call was ended.'
                                },
                                attributes: {
                                    'wapperApiObj': cmp.get("v.wapperApiObj"),
                                    'baseUrl': cmp.get("v.baseUrl"),
                                    'dialUser': cmp.get("v.dialUser"),
                                    'campaignId': sessionStorage.getItem('campaignId'),
                                    'recordId' : cmp.get("v.recordId"),
                                    'NoMatchObject' : cmp.get("v.NoMatchObject")
                                },
   
                            }).fire();
                        }
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        }
        catch (error) {
            console.log('error at parkGrabHangJquery method of callInitiatedPanelHelper --- ' , JSON.stringify(error));
            console.log('error message at parkGrabHangJquery method of callInitiatedPanelHelper --- ' , JSON.stringify(error.message));
        }  
    }
})