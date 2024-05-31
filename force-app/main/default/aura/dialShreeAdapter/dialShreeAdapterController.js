/*
Copyright 2016 salesforce.com, inc. All rights reserved.

Use of this software is subject to the salesforce.com Developerforce Terms of Use and other applicable terms that salesforce.com may make available, as may be amended from time to time. You may not decompile, reverse engineer, disassemble, attempt to derive the source code of, decrypt, modify, or create derivative works of this software, updates thereto, or any part thereof. You may not use the software to engage in any development activity that infringes the rights of a third party, including that which interferes with, damages, or accesses in an unauthorized manner the servers, networks, or other properties or services of salesforce.com or any third party.

WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL SALESFORCE.COM HAVE ANY LIABILITY FOR ANY DAMAGES, INCLUDING BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR DAMAGES BASED ON LOST PROFITS, DATA OR USE, IN CONNECTION WITH THE SOFTWARE, HOWEVER CAUSED AND, WHETHER IN CONTRACT, TORT OR UNDER ANY OTHER THEORY OF LIABILITY, WHETHER OR NOT YOU HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
*/

/* global $A */
/* global sforce */
({
    // store call center settings, so they're easily accessible ny all panels. Bring up the CTI login panel.
    init: function(cmp, event, helper) {
        try{
            //  var vfOrigin = "https://" + cmp.get("v.vfHost");
            window.addEventListener("message", function(event) {
                var eventResponse = JSON.parse(JSON.stringify(event.data));
                if(eventResponse.logged_in === true){
                    cmp.set('v.logStatus', eventResponse.logged_in)
                }
            }, false);
            helper.apiData(cmp, event, helper); 
        }
        catch (error) {
            console.log('error at init method of dialShreeAdapterController --- ' , JSON.stringify(error));
            console.log('error message at init method of dialShreeAdapterController --- ' , JSON.stringify(error.message));
        } 
      
    },

    // renderPanel event handler. Used to replace the current view with a given panel.
    renderPanel: function(cmp, event, helper) {
        try{
            var params = event.getParams();
            helper.renderPanel(cmp, params);
        }
        catch (error) {
            console.log('error at renderPanel method of dialShreeAdapterController --- ' , JSON.stringify(error));
            console.log('error message at renderPanel method of dialShreeAdapterController --- ' , JSON.stringify(error.message));
        } 
    },

    // getSettings event handler. Returns the stored call center settings.
    getSettings: function(cmp, event, helper) {
        try{
            var callback = event.getParams().callback;
            helper.getCallCenterSettings(cmp, callback);
        }
        catch (error) {
            console.log('error at getSettings method of dialShreeAdapterController --- ' , JSON.stringify(error));
            console.log('error message at getSettings method of dialShreeAdapterController --- ' , JSON.stringify(error.message));
        } 
    },

    // editPanel event handler. Updates the softphone panel label.
    editPanel: function(cmp, event, helper) {
        try{
            //  var params = event.getParams();
            // if (params.label) {
                sforce.opencti.setSoftphonePanelLabel({
                    label: $A.get("$Label.c.SoftPhone_Header")
                });
            //}
        }
        catch (error) {
            console.log('error at editPanel method of dialShreeAdapterController --- ' , JSON.stringify(error));
            console.log('error message at editPanel method of dialShreeAdapterController --- ' , JSON.stringify(error.message));
        } 
      
    },
    renderFieldEventHandler: function(cmp, event, helper){
        try{
            cmp.set('v.logStatus', false);
        }
        catch (error) {
            console.log('error at renderFieldEventHandler method of dialShreeAdapterController --- ' , JSON.stringify(error));
            console.log('error message at renderFieldEventHandler method of dialShreeAdapterController --- ' , JSON.stringify(error.message));
        } 
    },

    regenerateSession: function(cmp, event, helper){
        try{
            helper.regenerateSessionSet(cmp, event, helper); 
        }
        catch (error) {
            console.log('error at regenerateSession method of dialShreeAdapterController --- ' , JSON.stringify(error));
            console.log('error message at regenerateSession method of dialShreeAdapterController --- ' , JSON.stringify(error.message));
        } 
    }

})