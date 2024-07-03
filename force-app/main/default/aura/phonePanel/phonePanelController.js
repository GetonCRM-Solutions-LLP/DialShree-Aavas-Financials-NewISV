/*
Copyright 2016 salesforce.com, inc. All rights reserved.

Use of this software is subject to the salesforce.com Developerforce Terms of Use and other applicable terms that salesforce.com may make available, as may be amended from time to time. You may not decompile, reverse engineer, disassemble, attempt to derive the source code of, decrypt, modify, or create derivative works of this software, updates thereto, or any part thereof. You may not use the software to engage in any development activity that infringes the rights of a third party, including that which interferes with, damages, or accesses in an unauthorized manner the servers, networks, or other properties or services of salesforce.com or any third party.

WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL SALESFORCE.COM HAVE ANY LIABILITY FOR ANY DAMAGES, INCLUDING BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR DAMAGES BASED ON LOST PROFITS, DATA OR USE, IN CONNECTION WITH THE SOFTWARE, HOWEVER CAUSED AND, WHETHER IN CONTRACT, TORT OR UNDER ANY OTHER THEORY OF LIABILITY, WHETHER OR NOT YOU HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
*/

/*global $A*/
({
    // on initialization, get the Call Center Settings and enable click to dial
    init: function(cmp, event, helper) { 
        try {
            cmp.set('v.searchResults', []);

            var recordsFiltration = cmp.get("c.getCTIRecordsFiltration");
            recordsFiltration.setCallback(this,function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    //console.log('dynamic record filtration --- ' , response.getReturnValue().DialShreeCTI2__Dynamic_Record_Filtration__c);         
                    cmp.set("v.dynamicFiltration", response.getReturnValue().DialShreeCTI2__Dynamic_Record_Filtration__c);
                    cmp.set("v.filtrationApexClass", response.getReturnValue().DialShreeCTI2__Filtration_Apex_Class_Name__c);
                }
            });
            $A.enqueueAction(recordsFiltration);

            helper.handleOutgoingCalls(cmp); 
        } catch (error) {
            console.log('error at init method of phonePanelController --- ' , JSON.stringify(error));
            console.log('error message at init method of phonePanelController --- ' , JSON.stringify(error.message));
        } 
    },

    // dial from dial pad: first check for a matching record, and then dial it
    searchAndCallNumber: function(cmp, event, helper) {
        try {
            var number = cmp.get('v.inputValue');
            helper.search(cmp, number, function(cmp, number){
                helper.callNumber(cmp, number);
            });
        } catch (error) {
            console.log('error at searchAndCallNumber method of phonePanelController --- ' , JSON.stringify(error));
            console.log('error message at searchAndCallNumber method of phonePanelController --- ' , JSON.stringify(error.message));
        } 
    },
    
    // when you hit Enter, if it's a valid phone number, check for a matching record, and then dial it.
    // otherwise, search and display search results
    validateCountryCode: function(cmp,event, helper){
        try {
            var regex = /^[0-9+]+$/ ;
            var inputCode = cmp.find("countryInput");
            var errorHolder = cmp.find("errorDisplay");
            var inputCodeValue = inputCode.get("v.value");
            if (!inputCodeValue.match(regex)) {
                if(inputCodeValue === ""){
                    $A.util.addClass(errorHolder, 'slds-hide');
                    $A.util.removeClass(inputCode, 'error-border');
                }else{
                    $A.util.removeClass(errorHolder, 'slds-hide');
                    $A.util.addClass(inputCode, 'error-border');
                    cmp.set('v.errorText' , "Only Digits and + symbol is allowed!"); 
                }             
            }else{
                cmp.set('v.errorText' , "");
                $A.util.removeClass(inputCode, 'error-border');
                $A.util.addClass(errorHolder, 'slds-hide');
            }
        } catch (error) {
            console.log('error at validateCountryCode method of phonePanelController --- ' , JSON.stringify(error));
            console.log('error message at validateCountryCode method of phonePanelController --- ' , JSON.stringify(error.message));
        }
    },

    handleKeyUp: function(cmp, event, helper) {
        try {
            if (event.getParams().keyCode == 13) { //enter
                cmp.set('v.showDialPad', false);
                if(cmp.get('v.inputValue') == undefined){
                    cmp.set('v.inputValue','');
                }
               
                var inputValue = cmp.get('v.inputValue');  
                
                if (helper.isValidPhoneNumber(cmp)) {
                    helper.search(cmp, inputValue, function(cmp, inputValue){
                        helper.callNumber(cmp, inputValue);
                    });
                } else {
                    helper.search(cmp, inputValue);
                }
            }
        } catch (error) {
            console.log('error at handleKeyUp method of phonePanelController --- ' , JSON.stringify(error));
            console.log('error message at handleKeyUp method of phonePanelController --- ' , JSON.stringify(error.message));
        }
    },
    handleCall: function(cmp,event,helper){
        try {
            cmp.set('v.showDialPad', false);
            if(cmp.get('v.inputValue') == undefined){
                   cmp.set('v.inputValue','');
            }
           var inputValue = cmp.get('v.inputValue');    
            if (helper.isValidPhoneNumber(cmp)) {
                   helper.search(cmp, inputValue, function(cmp, inputValue){
                       helper.callNumber(cmp, inputValue);
                   });
            } else {
                   helper.search(cmp, inputValue);
           }
        } catch (error) {
            console.log('error at handleCall method of phonePanelController --- ' , JSON.stringify(error));
            console.log('error message at handleCall method of phonePanelController --- ' , JSON.stringify(error.message));
        }
	},
    
    // update search bar with every key click, and update the status of the Call button
    handleKeyClick: function(cmp, event, helper) {
        try {
            cmp.set('v.inputValue', cmp.get('v.inputValue') + event.getParam('value'));
            helper.updateButtonStatus(cmp);
        } catch (error) {
            console.log('error at handleKeyClick method of phonePanelController --- ' , JSON.stringify(error));
            console.log('error message at handleKeyClick method of phonePanelController --- ' , JSON.stringify(error.message));
        }
    },

    // handler for the dial pad icon, toggle dial pad on click
    toggleDialPad: function (cmp, event, helper) {
        try {
            var showDialPad = !cmp.get('v.showDialPad');
            cmp.set('v.showDialPad', showDialPad);
            cmp.set('v.inputValue', '');
            cmp.set('v.searchResults', []);
            if (showDialPad) {
                var toggleMessage = cmp.find("message");
                $A.util.toggleClass(toggleMessage, "toggle");
            }
        } catch (error) {
            console.log('error at toggleDialPad method of phonePanelController --- ' , JSON.stringify(error));
            console.log('error message at toggleDialPad method of phonePanelController --- ' , JSON.stringify(error.message));
        }
    },

    // handler for the onlinePresenceChanged event. fired when the value of status dropdown is changing.
    onOnlinePresenceChanged: function (cmp, event, helper) {
        try {
            helper.updatePresence(cmp, event, helper);
        } catch (error) {
            console.log('error at onOnlinePresenceChanged method of phonePanelController --- ' , JSON.stringify(error));
            console.log('error message at onOnlinePresenceChanged method of phonePanelController --- ' , JSON.stringify(error.message));
        }
    },

    // this method is called when once clicks on a search result card
    handleSelectCard: function (cmp, event, helper) {
        try {
            var index = event.currentTarget.getAttribute('data-value');
            var selectedRecord = cmp.get('v.searchResults')[index];
            if (!selectedRecord.Phone) {
                cmp.set('v.searchResults', []);
                cmp.set('v.message', "This contact doesn't have a phone number");
            } else {
                helper.callContact(cmp, selectedRecord);
            }
        } catch (error) {
            console.log('error at handleSelectCard method of phonePanelController --- ' , JSON.stringify(error));
            console.log('error message at handleSelectCard method of phonePanelController --- ' , JSON.stringify(error.message));
        }
    },
    
    handleApplicationEvent : function(cmp, event, helper) {   
        try {
            var liveStatusObj = event.getParam("liveStatusObj"); 
            var number = liveStatusObj.data.phone_number;
            helper.search(cmp, number, function(cmp, number){
                helper.callNumber(cmp, number,'IncomingCall');
            });
        } catch (error) {
            console.log('error at handleApplicationEvent method of phonePanelController --- ' , JSON.stringify(error));
            console.log('error message at handleApplicationEvent method of phonePanelController --- ' , JSON.stringify(error.message));
        }   
    },

    handleStatusEvent : function(cmp, event, helper) {      
        try {
            var liveStatusObj = event.getParam("liveStatusObj");         
            if(liveStatusObj.data.rtr_status == ''){
                cmp.set("v.status",liveStatusObj.data.status);  
            }else{
                cmp.set("v.status",liveStatusObj.data.rtr_status);
            }
            
            if(liveStatusObj.data.ingroup == ''){
                cmp.set("v.callType",liveStatusObj.data.call_type);
            }else{
                var callTypeInbound = liveStatusObj.data.call_type +' - '+liveStatusObj.data.ingroup;
                cmp.set("v.callType",callTypeInbound);
            } 
        } catch (error) {
            console.log('error at handleStatusEvent method of phonePanelController --- ' , JSON.stringify(error));
            console.log('error message at handleStatusEvent method of phonePanelController --- ' , JSON.stringify(error.message));
        } 
    },

    handleStatusDropdownEvent : function(component, event, helper) {
        try {
            var actionType = event.getParam('actionType');
            if (actionType == "Logout" || actionType == "Session Activated" ) {
                component.set("v.showTicker" , false);
            }
        } catch (error) {
            console.log('error at handleStatusDropdownEvent method of phonePanelController --- ' , JSON.stringify(error));
            console.log('error message at handleStatusDropdownEvent method of phonePanelController --- ' , JSON.stringify(error.message));
        }
    }
})