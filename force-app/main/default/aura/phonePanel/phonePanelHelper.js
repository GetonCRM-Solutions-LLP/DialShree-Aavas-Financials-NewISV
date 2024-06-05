/*
Copyright 2016 salesforce.com, inc. All rights reserved.

Use of this software is subject to the salesforce.com Developerforce Terms of Use and other applicable terms that salesforce.com may make available, as may be amended from time to time. You may not decompile, reverse engineer, disassemble, attempt to derive the source code of, decrypt, modify, or create derivative works of this software, updates thereto, or any part thereof. You may not use the software to engage in any development activity that infringes the rights of a third party, including that which interferes with, damages, or accesses in an unauthorized manner the servers, networks, or other properties or services of salesforce.com or any third party.

WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL SALESFORCE.COM HAVE ANY LIABILITY FOR ANY DAMAGES, INCLUDING BUT NOT LIMITED TO, DIRECT, INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, OR DAMAGES BASED ON LOST PROFITS, DATA OR USE, IN CONNECTION WITH THE SOFTWARE, HOWEVER CAUSED AND, WHETHER IN CONTRACT, TORT OR UNDER ANY OTHER THEORY OF LIABILITY, WHETHER OR NOT YOU HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
*/

/*global sforce*/
({
    // adds an onCLickToDial listener
    // This listener brings up the softphone every time click to dial is fired
    // and renders the callInitiatedPanel panel with the event payload
    handleOutgoingCalls : function(cmp) {
        try {
            console.log('in handleOutgoingCalls method');
            var listener = function(payload) {
                sforce.opencti.setSoftphonePanelVisibility({
                    visible : true,
                    callback : function() {
                        if (cmp.isValid() && cmp.get('v.status') == 'PAUSED') {
                            cmp.set('v.spinner', true); 
                            
                            var attributes = {
                                'state' : cmp.get("v.callType"),
                                'recordName' : payload.recordName,
                                'phone' : payload.number,
                                // 'title' : '',
                                // 'account' : '',
                                'presence' : cmp.get('v.presence'),
                                'campaignId' : cmp.get('v.campaignId'),
                                'recordId' : payload.recordId,
                                'listViewCall' : true
                            };
                            console.log('recordId ----------' +attributes.recordId);
                            var phoneNo = attributes.phone;
                            phoneNo = phoneNo.replace(/\D/g, "");
                            var manaulDialUrl = cmp.get('v.baseUrl')+cmp.get('v.manualDialApi')+'&phone_code='+cmp.get('v.countryCodeMeta')+'&value='+phoneNo+'&agent_user='+cmp.get('v.dialUser');
                            
                            fetch(manaulDialUrl)
                            .then(response => {
                                return response.json();
                            })
                            .then(data => {
                                if (data.status) {    
                                    attributes.state = cmp.get("v.callType");
                                    cmp.set('v.spinner', false);              
                                    cmp.getEvent('renderPanel').setParams({
                                        type : 'c:callInitiatedPanel',
                                        attributes : attributes
                                    }).fire();
                                }
                            })
                            .catch(error => {
                                console.error(error);
                            })
                        }
                    }
                });
            };
            sforce.opencti.onClickToDial({
                listener : listener
            });      
        } catch (error) {
            console.log('error at handleOutgoingCalls method of phonePanelHelper --- ' , JSON.stringify(error));
            console.log('error message at handleOutgoingCalls method of phonePanelHelper --- ' , JSON.stringify(error.message));
        }  
    },
    
    // toggles the Call button from disabled to enabled, if the input number is valid
    updateButtonStatus : function(cmp) {
        try {
            if (this.isValidPhoneNumber(cmp)) {
                cmp.set('v.callDisabled',false);
            } else {
                cmp.set('v.callDisabled',true);
            }
        } catch (error) {
            console.log('error at updateButtonStatus method of phonePanelHelper --- ' , JSON.stringify(error));
            console.log('error message at updateButtonStatus method of phonePanelHelper --- ' , JSON.stringify(error.message));
        }
    },
    
    // returns true if phone number is a valid integer, i.e. at least 3 digits
    isValidPhoneNumber : function(cmp) {
        try {
            var inputValue = cmp.get('v.inputValue');
            if(inputValue != undefined){
                return (inputValue.length >= 3 && !isNaN(parseFloat(inputValue)) && isFinite(inputValue));
            }else{
                return false;
            }
        } catch (error) {
            console.log('error at isValidPhoneNumber method of phonePanelHelper --- ' , JSON.stringify(error));
            console.log('error message at isValidPhoneNumber method of phonePanelHelper --- ' , JSON.stringify(error.message));
        }
    },
    
    // find a matching record for a number
    // if there's a match - initiate call panel with record details
    // if not, initiate call panel with only number and state
    callNumber : function(cmp, number,stateId) { 
        console.log('in callNumber method -----------'); 
        try {
            var attributes = {
                'state' : 'Dialing',
                'recordName' : number,
                'stateId' : stateId,
                'phone' : number
            };
            /*var record = cmp.get('v.searchResults')
            && cmp.get('v.searchResults')[0];*/  
    
            if(cmp.get('v.searchResults')){
                console.log('searchResults -----------' +cmp.get('v.searchResults'));
                for (var reclength = 0; reclength < cmp.get('v.searchResults').length; reclength++) {
                   var record = cmp.get('v.searchResults')
                                && cmp.get('v.searchResults')[reclength]; 
                   if (record) {            
                       attributes.recordName = record.Name;
                       attributes.phone = number;       
                    //    attributes.title = record.Title;
                    //    attributes.account = record.Account;
                       attributes.recordId = record.Id;
                       break;
                   }
               }
            }
            // else{
            //     attributes.phone = number;    
            //     console.log('else phone -----' +attributes.phone);   
            // }    
            //cmp.set('v.searchResults', []);  
            this.initiateCallPanel(cmp, attributes);
        } catch (error) {
            console.log('error at callNumber method of phonePanelHelper --- ' , JSON.stringify(error));
            console.log('error message at callNumber method of phonePanelHelper --- ' , JSON.stringify(error.message));
        }  
    },
    
    // // strip alphabetic characters from numbers and returns true if numbers are matching
    // matchingNumbers : function(number1, number2){
    //     try {
    //         var target = number2.replace(/\D/g,'');
    //         return number1.replace(/\D/g,'') == target && target.length > 0;
    //         /*var numA = number1.replace(/^0+/, '');
    //         var numB = number2.replace(/^0+/, '');
    //         var target = numB.replace(/\D/g,'');
    //         return numA.replace(/\D/g,'') == target && target.length > 0;*/
    //     } catch (error) {
    //         console.log('error at matchingNumbers method of phonePanelHelper --- ' , JSON.stringify(error));
    //         console.log('error message at matchingNumbers method of phonePanelHelper --- ' , JSON.stringify(error.message));
    //     }
    // },
    
    // when clicking on a contact card, initiate call panel with contact card details
    callContact : function(cmp, record) {
        try {
            if (!record ) {
                throw new Error('Something went wrong. Try again or contact your admin.');
            };
            var attributes = {
                'state' : 'Dialing',
                'recordName' : record.Name,
                'phone' : cmp.get("v.inputValue"),
                'title' : record.Title,
                'account' : record.Account,
                'recordId' : record.Id
            };        
            this.initiateCallPanel(cmp, attributes);
        } catch (error) {
            console.log('error at callContact method of phonePanelHelper --- ' , JSON.stringify(error));
            console.log('error message at callContact method of phonePanelHelper --- ' , JSON.stringify(error.message));
        }
    },
    
    // find a matching record using Open CTI runApex()
    // optionally run a callback function onCompletion
    search: function(cmp, inputValue, onCompletion) {
        try {
            cmp.set('v.searchResults', []);
            let _self = this;
            sforce.opencti.getSoftphoneLayout({
                callback: function(result) {
                    var softPhoneLayoutJSON = JSON.stringify(result);
    
                    console.log('softPhoneLayoutJSON --- ' +softPhoneLayoutJSON);
                    var softPhoneLayoutJSONParsed = JSON.parse(softPhoneLayoutJSON);
                    var NoMatchObject = softPhoneLayoutJSONParsed.returnValue.Inbound.screenPopSettings.NoMatch.screenPopData;
                    console.log('NoMatchObject --- ' +NoMatchObject);
                    cmp.set("v.NoMatchObject" , NoMatchObject);
                    console.log(cmp.get("v.NoMatchObject"));
    
                    if (inputValue != undefined) {
                        if (inputValue.length < 2) {
                            cmp.set('v.message', 'Enter at least two characters');
                            return;
                        };
                        var softPhoneJSON = {
                            'searchvalue': inputValue,
                            'softPhoneLayoutJSON': softPhoneLayoutJSON
                        };
                        var args = {
                            apexClass: 'DialShreeCTI2.SoftphoneContactSearchController',
                            methodName: 'getContacts',
                            methodParams: 'softPhoneParams=' + encodeURIComponent(JSON.stringify(softPhoneJSON)),
                            //methodParams: 'name=' + mapString,
                            callback: function(result) {
                                if (result.success) {
                                    var searchResults;
                                    if (result.returnValue != null || result.returnValue != undefined) {
                                        searchResults = JSON.parse(result.returnValue.runApex);
                                        let obj = JSON.parse(softPhoneLayoutJSON);
                                        let inboundObjects = Object.keys(obj.returnValue.Inbound.objects);
                                        let records = _self.getRecordWithPriority(searchResults, inboundObjects);
                                        let record; 
                                        console.log('record --------------------' +records);
                                        let multirecords = cmp.set('v.searchResults', records);
                                        console.log('multirecords ----------' +JSON.stringify(cmp.get('v.searchResults')));
                                        cmp.set('v.searchResults', records);
                                        if (!record || records.length == 0) {
                                            cmp.set('v.message', 'No results found');
                                        }
                                        onCompletion && onCompletion(cmp, inputValue);
                                    }
                                } else {
                                    throw new Error('Unable to perform a search using Open CTI. Contact your admin.');
                                }
                            }
                        };
                        sforce.opencti.runApex(args);
                    }
                }
            });
        } catch (error) {
            console.log('error at search method of phonePanelHelper --- ' , JSON.stringify(error));
            console.log('error message at search method of phonePanelHelper --- ' , JSON.stringify(error.message));
        }
    },

    getRecordWithPriority : function(records , priorityList){
        try {
            for (let priorityType of priorityList) {
                for (let record of records) {
                    if (record && record.length > 0 && record[0] && record[0].attributes) {
                        let recordType = record[0].attributes.type;
                        if (recordType.toLowerCase() === priorityType.toLowerCase()) {
                            return record;
                        }
                    }
                }
            }
            return [];
        } catch (error) {
            console.log('error at getRecordWithPriority method of phonePanelHelper --- ' , JSON.stringify(error));
            console.log('error message at getRecordWithPriority method of phonePanelHelper --- ' , JSON.stringify(error.message));
        }
    },
    
    // sets the presence to the new presence
    // and updates the message on the phone panel based on the new presense
    updatePresence : function(cmp, event, helper) {
        try {
            var newStatus = event.getParams().newStatus;  
            cmp.set('v.presence', newStatus);
            var newMessage = 'Search for a contact';
            var manualWrapperObj =  cmp.get("v.wapperApiObj") ;
            
            if (newStatus === 'Pause') {
                newMessage = "You're currently pasue for calls";
                cmp.set('v.showDialPad',false);
                this.pauseCallJquery(cmp, manualWrapperObj.pause);
             
                cmp.getEvent('renderPanel').setParams({
                    type : 'c:DialShreePauseList',
                    toast : {'type': 'normal', 'message': 'Call was pause.'},
                    attributes : {
                        'wapperApiObj' : cmp.get("v.wapperApiObj"),
                        'baseUrl' : cmp.get("v.baseUrl"),
                        'dialUser' : cmp.get("v.dialUser"),
                        'presence' : cmp.get('v.presence'),
                        'campaignId' : sessionStorage.getItem('campaignId')
                    },   
                   
                }).fire();
            };
            
            if (newStatus === 'Available') {
                newMessage = "You're currently available for calls";
                this.pauseCallJquery(cmp, manualWrapperObj.resume);
            }
            cmp.set('v.message', newMessage);
        } catch (error) {
            console.log('error at updatePresence method of phonePanelHelper --- ' , JSON.stringify(error));
            console.log('error message at updatePresence method of phonePanelHelper --- ' , JSON.stringify(error.message));
        }
    },
    
    // renders the callInitiatedPanel panel
    initiateCallPanel : function(cmp, attributes) {    
        try { 
            console.log('phoneNumber --- ' , attributes.phone);
            console.log('calling initiateCallPanel method', JSON.parse(JSON.stringify(cmp.get("v.searchResults"))));  
            cmp.set('v.spinner', true); 
            var attributes = attributes;
            attributes.state = cmp.get("v.callType");
            attributes.countryCode = cmp.get("v.countryCode");
            attributes.presence = cmp.get('v.presence'); 
            attributes.NoMatchObject = cmp.get("v.NoMatchObject");
            attributes.searchResults = JSON.stringify(cmp.get("v.searchResults"));
            console.log('search ---------' +attributes.searchResults);
            if(attributes.countryCode == '' || attributes.countryCode == undefined){
                attributes.countryCode = cmp.get("v.countryCodeMeta");
            }
            var phoneNo = attributes.phone;
            
            if(phoneNo == undefined){
                phoneNo = attributes.recordName;
            }
            phoneNo = phoneNo.replace(/\D/g, "");
    
            var manaulDialUrl = cmp.get('v.baseUrl')+cmp.get('v.manualDialApi')+'&phone_code='+attributes.countryCode+'&value='+phoneNo+'&agent_user='+cmp.get('v.dialUser');
            
            sforce.opencti.setSoftphonePanelVisibility({
                visible : true,
                callback : function() {
    
                    if(attributes.stateId != 'IncomingCall' && cmp.get('v.status') == 'PAUSED'){                    
                        fetch(manaulDialUrl)
                        .then(response => {
                            return response.json();
                        })
                        .then(data => {
                            if (data.status) {           
                                cmp.set('v.spinner', false);         
                                cmp.getEvent('renderPanel').setParams({
                                    type : 'c:callInitiatedPanel',
                                    attributes : attributes
                                }).fire();
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        })
                    }else{
                        attributes.state = cmp.get("v.callType");
                        cmp.set('v.spinner', false);
                        cmp.getEvent('renderPanel').setParams({
                            type : 'c:callInitiatedPanel',
                            attributes : attributes
                        }).fire();
                    }
                }
            })
        } catch (error) {
            console.log('error at initiateCallPanel method of phonePanelHelper --- ' , JSON.stringify(error));
            console.log('error message at initiateCallPanel method of phonePanelHelper --- ' , JSON.stringify(error.message));
        } 
    }, 

    pauseCallJquery : function(cmp, methodUrl) { 
        try {
            var pauseCallUrl = cmp.get("v.baseUrl")+methodUrl+'&agent_user='+cmp.get("v.dialUser");
            fetch(pauseCallUrl)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    if (data.status) {              
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        } catch (error) {
            console.log('error at pauseCallJquery method of phonePanelHelper --- ' , JSON.stringify(error));
            console.log('error message at pauseCallJquery method of phonePanelHelper --- ' , JSON.stringify(error.message));
        }        
    }
})