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
    screenPopAndCall : function(cmp) {
        cmp.getEvent('getSettings').setParams({
            callback: function(settings) {
                sforce.opencti.screenPop({
                    type : sforce.opencti.SCREENPOP_TYPE.SOBJECT,
                    params : { recordId : cmp.get('v.recordId') },
                    callback : function(response) {
                        cmp.getEvent('editPanel').setParams({
                            label : 'Open CTI Softphone: ' + cmp.get('v.state')
                        }).fire();
                        
                        var toNumber = cmp.get('v.phone');
                        // if(toNumber == undefined && cmp.get('v.recordId') == undefined && cmp.get('v.newLeadPage')){
                        if(toNumber == undefined && cmp.get('v.recordId') == undefined ){
                            toNumber = cmp.get('v.recordName');
                            sforce.opencti.getSoftphoneLayout({
                                callback: function(result) {
                                    let softPhoneLayout = JSON.parse(JSON.stringify(result));
                                    let noMatchObj = softPhoneLayout.returnValue.Inbound.screenPopSettings.NoMatch.screenPopData;
                                    if(noMatchObj){
                                        sforce.opencti.screenPop({
                                            type : sforce.opencti.SCREENPOP_TYPE.NEW_RECORD_MODAL,
                                            params : { entityName: noMatchObj , defaultFieldValues: { Phone : toNumber} },
                                            callback: function (result) {
                                                if (result.success) {
                                            } else {
                                                // Handle errors if necessary
                                            } }
                                        });
                                    }
                                }
                            });

                            /* sforce.opencti.saveLog( {
                                value:{ },
                                callback: function( result ) {
                                    console.log( 'Result is', JSON.stringify( result ) );
                                    console.log( 'Record Id is', result.returnValue.recordId );
                                    sforce.opencti.screenPop( {
                                        type : sforce.opencti.SCREENPOP_TYPE.NEW_RECORD_MODAL,
                                        params : { entityName: "Lead" , defaultFieldValues: { Phone : toNumber} },
                                        callback : function( result ) { console.log( 'Result is ' + JSON.stringify( result ) ) }
                                    } );
                                }
                            } );*/
                        }                

                        if(cmp.get('v.recordId') != undefined){
                            sforce.opencti.screenPop({
                                type : sforce.opencti.SCREENPOP_TYPE.SOBJECT,
                                params : { recordId : cmp.get('v.recordId') },
                            });
                        }
                    }
                })
             }
        }).fire();
    },

    // on Accept, accept the call by bringing up the Connected Panel
    renderConnectedPanel : function(cmp){
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
    },
    
    apiData : function(cmp, event, helper) {  
             
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
    },

    parkGrabHangJquery : function(cmp, methodUrl, param) { 
         var parkGrabHangUrl = cmp.get("v.baseUrl") + methodUrl + param + '&agent_user=' + cmp.get("v.dialUser");
         
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
                                 'campaignId': sessionStorage.getItem('campaignId')
                             },

                         }).fire();
                     }
                 }
             })
             .catch(error => {
                 console.error(error);
             })
    }
})