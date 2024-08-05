/*
Copyright 2016 salesforce.com, inc. All rights reserved.

Use of this software is subject to the salesforce.com Developerforce Terms of Use and other applicable terms that salesforce.com may make available, as may be amended from time to time. You may not decompile, reverse engineer, disassemble, attempt to derive the source code of, decrypt, modify, or create derivative works of this software, updates thereto, or any part thereof. You may not use the software to engage in any development activity that infringes the rights of a third party, including that which interferes with, damages, or accesses in an unauthorized manner the servers, networks, or other properties or services of salesforce.com or any third party.

WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL SALESFORCE.COM HAVE ANY LIABILITY FOR ANY DAMAGES, INCLUDING BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR DAMAGES BASED ON LOST PROFITS, DATA OR USE, IN CONNECTION WITH THE SOFTWARE, HOWEVER CAUSED AND, WHETHER IN CONTRACT, TORT OR UNDER ANY OTHER THEORY OF LIABILITY, WHETHER OR NOT YOU HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
*/

/* global $A */
({
    // screen pop to the contact home, and use the call provider to make a call
    init : function(cmp, event, helper) {  
        try{
            cmp.set('v.spinner', true);
            if(cmp.get('v.tickerTime') == null){
                var now = new Date();
                cmp.set('v.tickerTime',now);
            } 
            helper.apiData(cmp, event, helper);        
            var camId = sessionStorage.getItem("campaignId");        
            cmp.set('v.campaignId',camId);     
        }     
        catch (error) {
            console.log('error at Init method of callInitiatedPanelController --- ' , JSON.stringify(error));
            console.log('error message at Init method of callInitiatedPanelController --- ' , JSON.stringify(error.message));
        }
    },

    // On incoming calls, this is a handler for the Accept button
    accept : function(cmp, event, helper) {
        try {
            // cmp.set('v.Isincoming',true);
            let incomingCall = cmp.get('v.Isincoming');
            if(incomingCall === false){
                cmp.set('v.Isincoming',true);
            }
            sessionStorage.setItem('Isincomingbool',   cmp.get('v.Isincoming'));
            helper.renderConnectedPanel(cmp);
        }
        catch (error) {
            console.log('error at accept method of callInitiatedPanelController --- ' , JSON.stringify(error));
            console.log('error message at accept method of callInitiatedPanelController --- ' , JSON.stringify(error.message));
        }        
    },

    // On incoming calls, this is a handler for the Decline button
    // taking you back to the phone panel
    decline : function(cmp, event, helper) {
        try{
            // cmp.set('v.Isincoming',true);
            let incomingCall = cmp.get('v.Isincoming');
            if(incomingCall === false){
                cmp.set('v.Isincoming',true);
            }
            sessionStorage.setItem('Isincomingbool',   cmp.get('v.Isincoming'));
            // Retrieve custom label value
            var customLabel = $A.get("$Label.c.Decline_Call");
            cmp.getEvent('renderPanel').setParams({
                type : 'c:phonePanel',
                toast : {'type': 'warning', 'message': customLabel},
                attributes : { presence : cmp.get('v.presence') }
            }).fire();
        }
        catch (error) {
            console.log('error at decline method of callInitiatedPanelController --- ' , JSON.stringify(error));
            console.log('error message at decline method of callInitiatedPanelController --- ' , JSON.stringify(error.message));
        }           
    },

    // On dialing calls, this is a handler for the End button
    // taking you back to the phone panel
    end : function(cmp, event, helper) {
        try{
            // cmp.set('v.Isincoming',true);
            if (!cmp.get("v.isDoneEndRendering")) {
                cmp.set("v.isDoneEndRendering", true);
                let incomingCall = cmp.get('v.Isincoming');
                if (incomingCall === false) {
                    cmp.set('v.Isincoming', true);
                }
                sessionStorage.setItem('Isincomingbool', cmp.get('v.Isincoming'));
                if(cmp.get("v.wapperApiObj") != null && cmp.get("v.wapperApiObj") != undefined){
                    helper.parkGrabHangJquery(cmp, cmp.get("v.wapperApiObj").hangUp, "");
                }  
            }
        }
        catch (error) {
            console.log('error at end method of callInitiatedPanelController --- ' , JSON.stringify(error));
            console.log('error message at end method of callInitiatedPanelController --- ' , JSON.stringify(error.message));
        }   
    },
    
    transfer : function(cmp, event, helper) {        
        try{
            //console.log("input text at transfer of callinit panel ===  " , cmp.get('v.inputText'));
            let incomingCall = cmp.get('v.Isincoming');
            if(incomingCall === false){
                cmp.set('v.Isincoming',true);
            }
            sessionStorage.setItem('Isincomingbool',   cmp.get('v.Isincoming'));
            cmp.getEvent('renderPanel').setParams({
                type : 'c:DialShreeTransferCallModal',
                toast : {'type': 'normal', 'message': 'Transfer your call.'},
                attributes : {
                    'wapperApiObj' : cmp.get("v.wapperApiObj"),
                    'baseUrl' : cmp.get("v.baseUrl"),
                    'dialUser' : cmp.get("v.dialUser"),
                    'dialPwd' : cmp.get("v.dialPwd"),
                    'campaignId' : cmp.get("v.campaignId"),
                    'state' : cmp.get("v.state"),
                    'recordName' : cmp.get("v.recordName"),
                    'phone' : cmp.get("v.phone"),
                    'title' : cmp.get("v.title"),
                    'account' : cmp.get("v.account"),
                    'presence' : cmp.get('v.presence'),
                    'recordId' : cmp.get('v.recordId'), 
                    'countryCode' : cmp.get('v.countryCode'),       
                    'tickerTime' : cmp.get('v.tickerTime'),
                    'callInitiatePark' : cmp.get("v.isPark"),
                    'inputText' : cmp.get('v.inputText')
                },
            }).fire();  
        }
        catch (error) {
            console.log('error at transfer method of callInitiatedPanelController --- ' , JSON.stringify(error));
            console.log('error message at transfer method of callInitiatedPanelController --- ' , JSON.stringify(error.message));
        }   
    },
    park : function(cmp, event, helper) {        
        try{
            if (!cmp.get("v.isDoneRendering")) {
                cmp.set("v.isDoneRendering", true);
                cmp.set("v.isDoneGrabRendering", false);
                let incomingCall = cmp.get('v.Isincoming');
                if (incomingCall === false) {
                    cmp.set('v.Isincoming', true);
                }
                sessionStorage.setItem('Isincomingbool', cmp.get('v.Isincoming'));
                helper.parkGrabHangJquery(cmp, cmp.get("v.wapperApiObj").park, "&value=PARK_CUSTOMER");
            }
        }
        catch (error) {
            console.log('error at park method of callInitiatedPanelController --- ' , JSON.stringify(error));
            console.log('error message at park method of callInitiatedPanelController --- ' , JSON.stringify(error.message));
        }   
    },
    grab : function(cmp, event, helper) {
       try{
             // cmp.set('v.Isincoming',true);
            if (!cmp.get("v.isDoneGrabRendering")) {
                cmp.set("v.isDoneGrabRendering", true);
                cmp.set("v.isDoneRendering", false);
                let incomingCall = cmp.get('v.Isincoming');
                if (incomingCall === false) {
                    cmp.set('v.Isincoming', true);
                }
                sessionStorage.setItem('Isincomingbool', cmp.get('v.Isincoming'));
                helper.parkGrabHangJquery(cmp, cmp.get("v.wapperApiObj").park, "&value=GRAB_CUSTOMER");
            }
       }
       catch (error) {
            console.log('error at grab method of callInitiatedPanelController --- ' , JSON.stringify(error));
            console.log('error message at grab method of callInitiatedPanelController --- ' , JSON.stringify(error.message));
        }   
    },
    closeModel : function(cmp, event, helper) {
        try{
            cmp.set('v.showConfirmDialog', false);
        }
        catch (error) {
            console.log('error at closeModel method of callInitiatedPanelController --- ' , JSON.stringify(error));
            console.log('error message at closeModel method of callInitiatedPanelController --- ' , JSON.stringify(error.message));
        }
	},
	
    handleApplicationEvent : function(cmp, event, helper) {
       try{
            var numEventsHandled = parseInt(cmp.get("v.numEvents")) + 1;
            cmp.set("v.numEvents", numEventsHandled);
        
            var liveStatusObj = event.getParam("liveStatusObj");
            var rtrStatus = liveStatusObj.data.rtr_status;
            var status = liveStatusObj.data.status;
            var state = liveStatusObj.data.call_type;
            var callTypeInbound = liveStatusObj.data.call_type +' - '+liveStatusObj.data.ingroup;
            cmp.set("v.callType" , liveStatusObj.data.call_type);

            if(liveStatusObj.data.ingroup == ''){
                cmp.set("v.state",state);
            }else{
                cmp.set("v.state",callTypeInbound);
            } 

            if((status == 'INCALL' && rtrStatus == '') || (status == '3-WAY') || (rtrStatus == '3-WAY') ){
                cmp.set('v.isTransferParkActive', false);
            }
            
            if(rtrStatus == 'DEAD' || rtrStatus == 'DISPO'){
                cmp.set('v.isTransferParkActive', true);           
                helper.parkGrabHangJquery(cmp, cmp.get("v.wapperApiObj").hangUp, "");
            }
            helper.phoneNumberMaskingSingleRecord(cmp);
        }

        catch (error) {
            console.log('error at handleApplicationEvent method of callInitiatedPanelController --- ' , JSON.stringify(error));
            console.log('error message at handleApplicationEvent method of callInitiatedPanelController --- ' , JSON.stringify(error.message));
        }   
    }
})