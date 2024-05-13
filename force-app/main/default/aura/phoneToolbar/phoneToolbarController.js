/*
Copyright 2016 salesforce.com, inc. All rights reserved.

Use of this software is subject to the salesforce.com Developerforce Terms of Use and other applicable terms that salesforce.com may make available, as may be amended from time to time. You may not decompile, reverse engineer, disassemble, attempt to derive the source code of, decrypt, modify, or create derivative works of this software, updates thereto, or any part thereof. You may not use the software to engage in any development activity that infringes the rights of a third party, including that which interferes with, damages, or accesses in an unauthorized manner the servers, networks, or other properties or services of salesforce.com or any third party.

WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL SALESFORCE.COM HAVE ANY LIABILITY FOR ANY DAMAGES, INCLUDING BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR DAMAGES BASED ON LOST PROFITS, DATA OR USE, IN CONNECTION WITH THE SOFTWARE, HOWEVER CAUSED AND, WHETHER IN CONTRACT, TORT OR UNDER ANY OTHER THEORY OF LIABILITY, WHETHER OR NOT YOU HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
*/

/* global $A */
({
    // bring up the help window
    showModal : function(cmp, event, helper) {
        // TODO: Try not to reference `document`.
        document.getElementById('backGroundSectionId').style.display = 'block';
    },
    parentAction: function(cmp,event,handler){
        var objChild = cmp.find('childAttr');
        cmp.set('v.userLoggedStatus', objChild.get('v.userLoggedStatus'));
        var renderObj = $A.get("e.c:renderFieldEvent");                    
        renderObj.setParams({
            "userLogged" :  cmp.get('v.userLoggedStatus')});
        renderObj.fire();
    },
    // close the help window
    showHelp : function(cmp, event, helper) {
        // TODO: Try not to reference `document`.
        document.getElementById('backGroundSectionId').style.display = 'none';
    },

    // get the incoming phone number from call center settings, then if there's a matching record
    // bring up a call panel with the record details.
    simulateIncomingCall : function(cmp, event, helper) {
        cmp.getEvent('getSettings').setParams({
            callback: function(settings) {
                var number = settings['/reqPhoneDemoSettings/reqIncomingNumber'];
                helper.search(cmp, number, function(cmp, result) {
                    var record = result ? result : {
                        Name : number
                    };
                    cmp.getEvent('renderPanel').setParams({
                        type : 'c:callInitiatedPanel',
                        attributes : {
                            'state' : 'Incoming',
                            'recordName' : record.Name,
                            'phone' : record.Phone,
                            'title' : record.Title,
                            'account' : record.Account,
                            'recordId' : record.Id,
                            'presence' : cmp.get('v.presence')
                        }
                    }).fire();
                })
            }
        }).fire();

    },
    renderPanel: function(cmp, event, helper) {
        var params = event.getParams();
        
        //helper.renderPanel(cmp, params);
        cmp.get('v.presence',params.attributes.presence);
    },
})