/*
Copyright 2016 salesforce.com, inc. All rights reserved.

Use of this software is subject to the salesforce.com Developerforce Terms of Use and other applicable terms that salesforce.com may make available, as may be amended from time to time. You may not decompile, reverse engineer, disassemble, attempt to derive the source code of, decrypt, modify, or create derivative works of this software, updates thereto, or any part thereof. You may not use the software to engage in any development activity that infringes the rights of a third party, including that which interferes with, damages, or accesses in an unauthorized manner the servers, networks, or other properties or services of salesforce.com or any third party.

WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL SALESFORCE.COM HAVE ANY LIABILITY FOR ANY DAMAGES, INCLUDING BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR DAMAGES BASED ON LOST PROFITS, DATA OR USE, IN CONNECTION WITH THE SOFTWARE, HOWEVER CAUSED AND, WHETHER IN CONTRACT, TORT OR UNDER ANY OTHER THEORY OF LIABILITY, WHETHER OR NOT YOU HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
*/

/*global $A*/
({
    // on initialization, get the Call Center Settings and enable click to dial
    init: function(cmp, event, helper) { 
        console.log('IN phonepanelcontroller');
        cmp.set('v.searchResults', []);
        helper.handleOutgoingCalls(cmp); 
    },

    // dial from dial pad: first check for a matching record, and then dial it
    searchAndCallNumber: function(cmp, event, helper) {
        var number = cmp.get('v.inputValue');
        helper.search(cmp, number, function(cmp, number){
            helper.callNumber(cmp, number);
        });
    },
    
    // when you hit Enter, if it's a valid phone number, check for a matching record, and then dial it.
    // otherwise, search and display search results
    validateCountryCode: function(cmp,event, helper){
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
    },
    handleKeyUp: function(cmp, event, helper) {
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
    },
    handleCall: function(cmp,event,helper){
        console.log('67 - calling handleCall method -------');
         cmp.set('v.showDialPad', false);
         if(cmp.get('v.inputValue') == undefined){
                cmp.set('v.inputValue','');
         }
        var inputValue = cmp.get('v.inputValue');  
         console.log('73 - inputValue ----------' +inputValue);   
         if (helper.isValidPhoneNumber(cmp)) {
            console.log('75 - calling isValidPhoneNumber helper ------------');
                helper.search(cmp, inputValue, function(cmp, inputValue){
                    console.log(' 77 - calling helper search --------');
                    helper.callNumber(cmp, inputValue);
                    console.log ('79 - calling callNumber helper method ---------');
                });
         } else {
                helper.search(cmp, inputValue);
        }
	},
    // update search bar with every key click, and update the status of the Call button
    handleKeyClick: function(cmp, event, helper) {
        cmp.set('v.inputValue', cmp.get('v.inputValue') + event.getParam('value'));
        helper.updateButtonStatus(cmp);
    },

    // handler for the dial pad icon, toggle dial pad on click
    toggleDialPad: function (cmp, event, helper) {
        var showDialPad = !cmp.get('v.showDialPad');
        cmp.set('v.showDialPad', showDialPad);
        cmp.set('v.inputValue', '');
        cmp.set('v.searchResults', []);
        if (showDialPad) {
            var toggleMessage = cmp.find("message");
            $A.util.toggleClass(toggleMessage, "toggle");
        }
    },

    // handler for the onlinePresenceChanged event. fired when the value of status dropdown is changing.
    onOnlinePresenceChanged: function (cmp, event, helper) {
         helper.updatePresence(cmp, event, helper);
    },

    // this method is called when once clicks on a search result card
    handleSelectCard: function (cmp, event, helper) {
        var index = event.currentTarget.getAttribute('data-value');
        var selectedRecord = cmp.get('v.searchResults')[index];
        if (!selectedRecord.Phone) {
            cmp.set('v.searchResults', []);
            cmp.set('v.message', "This contact doesn't have a phone number");
        } else {
            helper.callContact(cmp, selectedRecord);
        }
    },
    
    handleApplicationEvent : function(cmp, event, helper) {      
        var liveStatusObj = event.getParam("liveStatusObj"); 
        var number = liveStatusObj.data.phone_number;
        helper.search(cmp, number, function(cmp, number){
            helper.callNumber(cmp, number,'IncomingCall');
        });
    },

    handleStatusEvent : function(cmp, event, helper) {       
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
    }
})