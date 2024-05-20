/*
Copyright 2016 salesforce.com, inc. All rights reserved.

Use of this software is subject to the salesforce.com Developerforce Terms of Use and other applicable terms that salesforce.com may make available, as may be amended from time to time. You may not decompile, reverse engineer, disassemble, attempt to derive the source code of, decrypt, modify, or create derivative works of this software, updates thereto, or any part thereof. You may not use the software to engage in any development activity that infringes the rights of a third party, including that which interferes with, damages, or accesses in an unauthorized manner the servers, networks, or other properties or services of salesforce.com or any third party.

WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL SALESFORCE.COM HAVE ANY LIABILITY FOR ANY DAMAGES, INCLUDING BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR DAMAGES BASED ON LOST PROFITS, DATA OR USE, IN CONNECTION WITH THE SOFTWARE, HOWEVER CAUSED AND, WHETHER IN CONTRACT, TORT OR UNDER ANY OTHER THEORY OF LIABILITY, WHETHER OR NOT YOU HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
*/

/* global $A */
/* global sforce */

({
    // expand the status dropdown on click
    toggleStatus: function(cmp) {
        var dropdown = cmp.find('dropdownContainer');
        $A.util.toggleClass(dropdown, 'slds-is-open');
    },

    // update the status dropdown (presence and icon)
    setStatusName: function(cmp, selectOption) {
        var newStatus = selectOption.getAttribute('data-value-name');
        var iconType = selectOption.getAttribute('data-value-iconType');
        cmp.set('v.presence', newStatus);
        this.renderIcon(cmp, iconType);
    },

    // update the status icon on the first row of the status dropdown
    renderIcon : function(cmp, iconType) {
        $A.createComponent("c:svg",
            {"class": 'slds-icon slds-icon--x-small slds-icon-text-'+iconType,
            "aura:id": "statusIcon",
            "xlinkHref": "/resource/slds/assets/icons/utility-sprite/svg/symbols.svg#record"},
            function(newIcon) {
                if (cmp.isValid()) {
                    cmp.set('v.icon', [ newIcon ]);
                }
            });
    },

    // on logout, disable click to dial and bring up the cti login panel
    handleLogout: function(cmp,event) {        
        this.logoutApiJQuey(cmp,event);
    },

    // set the panel label by firing the editPanel event
    setLabel: function (cmp, label) {
        cmp.getEvent('editPanel').setParams({
                label: label
        }).fire();
    },

    // notify the phone panel that the presence has changed
    notifyPhonePanel: function(cmp, helper, newStatus) {
        
        cmp.getEvent('onlinePresenceChanged').setParams({
            newStatus: newStatus
        }).fire();
    },    

    apiData : function(cmp, event, helper) {        
        var action = cmp.get("c.getServiceSettings");
        action.setCallback(this,function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.baseUrl",response.getReturnValue().DialShreeCTI2__Base_Url__c);
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
                cmp.set("v.wapperApiObj",response.getReturnValue());
            }
        });
        
        $A.enqueueAction(action);
        $A.enqueueAction(action2);
        $A.enqueueAction(action3);
    },

    logoutApiJQuey: function (cmp, event) {
        cmp.set('v.showSpinner', true);
        var logoutUrl;
        var manualWrapperObj = cmp.get("v.wapperApiObj");
        
        logoutUrl = cmp.get("v.baseUrl") + manualWrapperObj.logout + '&agent_user=' + cmp.get("v.dialUser");
        // var defaultSelectedOption;
        // defaultSelectedOption = document.createElement("option");
        // defaultSelectedOption.setAttribute('data-value-name','Pause');
        // defaultSelectedOption.setAttribute('data-value-iconType','');
        let self = this;
        self.renderIcon(cmp,'error');
        fetch(logoutUrl)
            .then(response => {
                return response.json();
            })
            .then(data => {
                var logStatus = data.data.value;
                var dropdownTarget = cmp.find('dropdownContainer');
                $A.util.removeClass(dropdownTarget, 'slds-is-open');
                cmp.set('v.userLoggedStatus', logStatus);
                cmp.set('v.presence', 'Pause');
               

                //this.renderIcon(cmp, 'error');
                var vx = cmp.get("v.method");
                //fire event from child and capture in parent
                $A.enqueueAction(vx);
                if (data.status) {
                    var callback = function (result) {
                        if (result.success) {
                            // var compEvent = $A.get("event.cmp.renderFieldEvent");
                            //console.log('-------compEvent-------', compEvent);
                            // compEvent.setParams("userLogged", "LOGOUT");
                            // compEvent.fire();
                            // sforce.opencti.disableClickToDial({
                            //     params : {logStatus : logStatus},
                            //     callback: callback
                            // });
                        } else {
                            throw new Error('Click to dial cannot be disabled.');
                        }
                    };
                    sforce.opencti.disableClickToDial({
                        params : {logStatus : logStatus},
                        callback: callback
                    });
                    setTimeout(() => {
                        cmp.set('v.showSpinner', false);
                    }, 5000)

                } else {
                    cmp.set('v.showSpinner', false);
                }
            })
            .catch(error => {
                cmp.set('v.showSpinner', false);
                console.error(error);
            })
        }
    })