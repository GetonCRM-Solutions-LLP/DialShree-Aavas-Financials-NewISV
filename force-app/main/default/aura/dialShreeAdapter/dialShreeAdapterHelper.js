/*
Copyright 2016 salesforce.com, inc. All rights reserved.

Use of this software is subject to the salesforce.com Developerforce Terms of Use and other applicable terms that salesforce.com may make available, as may be amended from time to time. You may not decompile, reverse engineer, disassemble, attempt to derive the source code of, decrypt, modify, or create derivative works of this software, updates thereto, or any part thereof. You may not use the software to engage in any development activity that infringes the rights of a third party, including that which interferes with, damages, or accesses in an unauthorized manner the servers, networks, or other properties or services of salesforce.com or any third party.

WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL SALESFORCE.COM HAVE ANY LIABILITY FOR ANY DAMAGES, INCLUDING BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR DAMAGES BASED ON LOST PROFITS, DATA OR USE, IN CONNECTION WITH THE SOFTWARE, HOWEVER CAUSED AND, WHETHER IN CONTRACT, TORT OR UNDER ANY OTHER THEORY OF LIABILITY, WHETHER OR NOT YOU HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
*/

/* global $A */
/* global sforce */
({
    // show spinner until the panel is fully rendered
    // render panel of a certain type (i.e. c:phonePanel)
    // optionally, show a toast on top of the new component
    renderPanel : function(cmp, params) {
        cmp.set('v.spinner', true);
        
        if (params.toast) {
            cmp.find('toast-message').set('v.content', params.toast);
        }
        if (params.type) {
            $A.createComponent(params.type, params.attributes, function(newPanel) {
                
                if (cmp.isValid()) {
                    cmp.set('v.body', [ newPanel ]);
                    cmp.set('v.spinner', false);
                    
                }
            });
        } else {
            cmp.set('v.spinner', false);
        }
        cmp.set('v.showfooter', true);
    },

    // use open CTI to update the panel label
    setPanelLabel : function(cmp, panelLabel) {
        if (panelLabel) {
            sforce.opencti.setSoftphonePanelLabel({
                label : panelLabel
            });
        }
    },
    
    // first time this method is called, it will fetch the settings using opencti.getCallCenterSettings 
    getCallCenterSettings: function(cmp, callbackFunc) {
        if (callbackFunc && cmp.get('v.settings')) {
            callbackFunc(cmp.get('v.settings'));
        } else {   //first time call
            sforce.opencti.getCallCenterSettings({
                callback : function(response) {
                    if (response.success) {
                        cmp.set('v.settings', response.returnValue);
                        callbackFunc(cmp.get('v.settings'));
                    } else {
                        throw new Error(
                            'Unable to load call center settings. Contact your admin.')
                    }
                }
            })
        }
    },
    callbackStatus : function(cmp, event,helper) {       
        window.setInterval(
            $A.getCallback(function() { 
                helper.statuCheckOpenCTI(cmp, event,helper);
            }), 1000
        );
    },

    //Call Status Check API Every 2 seconds 
    statuCheckOpenCTI : function(cmp, event,helper) {    
        var logStatus = cmp.get('v.logStatus');
        if(logStatus === true && cmp.get("v.wapperApi") != null && cmp.get("v.dialUser") != ''){ 
          
            var statuCheckUrl = cmp.get("v.baseUrl")+cmp.get("v.wapperApi").status+'&agent_user='+cmp.get("v.dialUser");
           
            fetch(statuCheckUrl)
            .then(response => {
                return response.json();
            })
            .then($A.getCallback(data => {
                if (data.status) {        

                    var agentleadId = data.data.lead_id;
                    console.log('agentleadId --- ' , agentleadId);
                    if(agentleadId != 'Undefined' && agentleadId != null && agentleadId != 0) {
                        var agentInputTransmitEvent = $A.get("e.c:agentInputTransmit");
                        agentInputTransmitEvent.setParams({
                            'agentLeadId' : agentleadId
                        })
                        agentInputTransmitEvent.fire();
                    }

                    sessionStorage.setItem("campaignId", data.data.campaign_id);
                    cmp.set("v.campaignId",data.data.campaign_id);

                    if(data.data.phone_number == ''){
                        cmp.set('v.phoneNo',data.data.phone_number); 
                    }
                   
                    if((data.data.phone_number != '') && (data.data.phone_number != cmp.get('v.phoneNo'))){                                     
                        var statusObj2 = $A.get("e.c:StatusChangeEvent"); 
                        if(statusObj2){
                            statusObj2.setParams({
                                "liveStatusObj" : data});
                            statusObj2.fire();
                        }               
                        cmp.set('v.phoneNo',data.data.phone_number); 
                    }

                    var statusObj1 = $A.get("e.c:StatusCheckEvent");

                    if(statusObj1){
                        statusObj1.setParams({
                            "liveStatusObj" : data});
                        statusObj1.fire();   
                    }
                    
                    if(data.data.rtr_status == ''){
                        cmp.set("v.status",data.data.status);  
                    }else{
                        cmp.set("v.status",data.data.rtr_status);
                    }
                   
                    cmp.set("v.session",data.data.session);

                    var callStatus = cmp.get('v.status');
                    var icon = (callStatus === 'PAUSED') ? "utility:pause" : (callStatus === 'READY') ? "utility:user" : (callStatus === 'INCALL') ? "utility:incoming_call" :
                        (callStatus === 'DIAL') ? "utility:dialing" : (callStatus === 'DISPO') ? "utility:picklist_type" : (callStatus === 'DEAD') ? "utility:end_call" : "utility:log_a_call";
                    cmp.set('v.iconName' , icon);
                }
            }))
            .catch(error => {
                console.error('statuCheck Api error=',error);
            })
        }
    },

    apiData : function(cmp, event, helper) { 
        var action = cmp.get("c.getServiceSettings");
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.baseUrl",response.getReturnValue().DialShreeCTI2__Base_Url__c);
                cmp.set("v.dialLogin",response.getReturnValue().DialShreeCTI2__Login__c);
                cmp.set("v.countryCodeMeta",response.getReturnValue().DialShreeCTI2__Country_Code__c);
            }
        });
        
        var action2 = cmp.get("c.dialUserInfoCs");
        action2.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS") {                
                cmp.set("v.dialUser",response.getReturnValue().DialShreeCTI2__Dialshree_User__c);
            }
        });

        var action3 = cmp.get("c.apiWrapperList");
        action3.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var resResult = response.getReturnValue();
                cmp.set("v.wapperApi",response.getReturnValue());
                this.wrapApiData(cmp, event, helper);
            }
        });
        
        $A.enqueueAction(action);
        $A.enqueueAction(action2);
        $A.enqueueAction(action3);
    },

    wrapApiData : function(cmp, event, helper) { 
        this.callbackStatus(cmp,event,helper);
       
        cmp.getEvent('renderPanel').setParams({
            type : 'c:phonePanel',
            toast : {'type': 'normal', 'message': 'Please start call.'},
            attributes : {
                'wapperApiObj' : cmp.get("v.wapperApi"),
                'manualDialApi' : cmp.get("v.wapperApi").manualDial,
                'baseUrl' : cmp.get("v.baseUrl"),
                'dialUser' : cmp.get("v.dialUser"),
                'presence' : cmp.get("v.presence"),
                'countryCodeMeta' : cmp.get("v.countryCodeMeta"),
                'pauseLabel' : cmp.get("v.pauseLabel"),
                'agentLeadId' : cmp.get("v.agentLeadId")
            },           
        }).fire();
    },

    regenerateSessionSet : function(cmp, event, helper) {         
        var logStatus = cmp.get('v.logStatus');
        if(logStatus === true && cmp.get("v.wapperApi") != null && cmp.get("v.dialUser") != ''){           
            var regenerateUrl = cmp.get("v.baseUrl")+cmp.get("v.wapperApi").regenerateSession+'&agent_user='+cmp.get("v.dialUser");
           
            if(regenerateUrl != undefined){
                fetch(regenerateUrl)
            .then(response => {
                return response.json();
            })
            .then($A.getCallback(data => {
                
                if (data.status) {
                    cmp.set("v.session",true);
                }
            }))
            .catch(error => {
                console.error('regenerateUrl Api error=',error);
            })
			}
            
        }
    }
})