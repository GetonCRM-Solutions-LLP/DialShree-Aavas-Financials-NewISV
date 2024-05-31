/*
Copyright 2016 salesforce.com, inc. All rights reserved.

Use of this software is subject to the salesforce.com Developerforce Terms of Use and other applicable terms that salesforce.com may make available, as may be amended from time to time. You may not decompile, reverse engineer, disassemble, attempt to derive the source code of, decrypt, modify, or create derivative works of this software, updates thereto, or any part thereof. You may not use the software to engage in any development activity that infringes the rights of a third party, including that which interferes with, damages, or accesses in an unauthorized manner the servers, networks, or other properties or services of salesforce.com or any third party.

WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL SALESFORCE.COM HAVE ANY LIABILITY FOR ANY DAMAGES, INCLUDING BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR DAMAGES BASED ON LOST PROFITS, DATA OR USE, IN CONNECTION WITH THE SOFTWARE, HOWEVER CAUSED AND, WHETHER IN CONTRACT, TORT OR UNDER ANY OTHER THEORY OF LIABILITY, WHETHER OR NOT YOU HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
*/
/* global $A */
({
    autoHide : function(component) {
        try {
            var self = this;
            if (component.get('v.typeClass') != 'slds-theme--error') {
                setTimeout($A.getCallback(self.toggleToastClassHide), component
                        .get('v.timeout'), component);
            }
        } catch (error) {
            console.log('error at autoHide method of toastHelper --- ' , JSON.stringify(error));
            console.log('error message at autoHide method of toastHelper --- ' , JSON.stringify(error.message));
        }
    },

    toggleToastClassHide : function(component) {
        try {
            $A.util.addClass(component, 'slds-fall-into-ground');
            $A.util.removeClass(component, 'slds-rise-from-ground');
        } catch (error) {
            console.log('error at toggleToastClassHide method of toastHelper --- ' , JSON.stringify(error));
            console.log('error message at toggleToastClassHide method of toastHelper --- ' , JSON.stringify(error.message));
        }
    },

    toggleToastClassShow : function(component) {
        try {
            $A.util.removeClass(component, 'slds-fall-into-ground');
            $A.util.addClass(component, 'slds-rise-from-ground');
        } catch (error) {
            console.log('error at toggleToastClassShow method of toastHelper --- ' , JSON.stringify(error));
            console.log('error message at toggleToastClassShow method of toastHelper --- ' , JSON.stringify(error.message));
        }
    },

    setToastType : function(component, event) {
        try {
            var type = event.getParams().value.type.toLowerCase();
            switch (type) {
            case 'normal':
                component.set('v.typeClass', '');
                return true;
            case 'success':
                component.set('v.typeClass', 'slds-theme--success');
                return true;
            case 'warning':
                component.set('v.typeClass', 'slds-theme--warning');
                return true;
            case 'error':
                component.set('v.typeClass', 'slds-theme--error');
                return true;
            }
            return false;
        } catch (error) {
            console.log('error at setToastType method of toastHelper --- ' , JSON.stringify(error));
            console.log('error message at setToastType method of toastHelper --- ' , JSON.stringify(error.message));
        }
    }
})