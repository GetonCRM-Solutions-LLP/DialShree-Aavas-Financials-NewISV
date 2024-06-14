({
    doInit: function (component, event, helper) {
        try {
            component.set("v.isHangXferDoneRendering", false);
            component.set("v.isDoneRendering", false);
            component.set("v.isGrabDoneRendering", false);
            helper.transferGroupListJqery(component);
            helper.transferAgentListJqery(component);
        } catch (error) {
            console.log('error at doInit method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at doInit method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }
    },
    
    handleBlind: function (component, event, helper) {        
        try {
            var val = "BLIND_TRANSFER";
            var val2 = "&phone_number=" + component.get("v.externalNumber");
            
            if (component.get("v.externalNumber") != undefined && component.get("v.externalNumber") != '') {
                component.set('v.spinner', true);
                helper.transferJqery(component, val, val2);
            } else {
                component.getEvent('renderPanel').setParams({
                    toast: {
                        'type': 'warning',
                        'message': 'Please add number.'
                    }
                }).fire();
            }
        } catch (error) {
            console.log('error at handleBlind method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at handleBlind method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }
    },
    handleDialCustom: function (component, event, helper) {
        try {
            if (component.get("v.externalNumber") != undefined && component.get("v.consult") === true) {
                component.getEvent('renderPanel').setParams({
                    toast: {
                        'type': 'warning',
                        'message': 'Please uncheck CONSULTATIVE or remove external number.'
                    }
                }).fire();
            } else {
                var val = "DIAL_WITH_CUSTOMER";
                if (component.get("v.consult")) {
                    val = val + "&consultative=YES";
                }
                if (component.get("v.dialOver")) {
                    val = val + "&dial_override=YES";
                }

                var val2 = ''
                if (component.get("v.externalNumber") != undefined) {
                    val2 = "&phone_number=" + component.get("v.externalNumber");
                }
                if ((component.get("v.internalGroup") != "") && (component.get("v.internalGroup") != '--- None ---') && component.get("v.consult") == true) {
                    val2 = "&ingroup_choices=" + component.get("v.internalGroup");
                }
                if ((component.get("v.agent") != "") && (component.get("v.agent") != '--- None ---') && component.get("v.consult") == true) {
                    val2 = "&ingroup_choices=AGENTDIRECT&phone_number=" + component.get("v.agent");
                }

                if (val2 != '') {
                    if (!component.get("v.isDoneRendering")) {
                        component.set("v.isDoneRendering", true);
                        component.set("v.isHangXferDoneRendering", false);
                        component.set("v.isGrabDoneRendering", false);
                        helper.transferJqery(component, val, val2);
                    }
                } else {
                    component.getEvent('renderPanel').setParams({
                        toast: {
                            'type': 'warning',
                            'message': 'Consultative checkbox select and unselect during agent or Internal transfer selection.'
                        }
                    }).fire();
                }
            }
        } catch (error) {
            console.log('error at handleDialCustom method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at handleDialCustom method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }
    },

    handleParkDial: function (component, event, helper) {
        try {
            if (component.get("v.externalNumber") != undefined && component.get("v.consult") === true) {
                component.getEvent('renderPanel').setParams({
                    toast: {
                        'type': 'warning',
                        'message': 'Please uncheck CONSULTATIVE or remove external number.'
                    }
                }).fire();
            } else {
                var val = "PARK_CUSTOMER_DIAL";
                if (component.get("v.consult")) {
                    val = val + "&consultative=YES";
                }
                var val2 = ''
                if (component.get("v.externalNumber") != undefined) {
                    val2 = "&phone_number=" + component.get("v.externalNumber");
                }
                if ((component.get("v.internalGroup") != "") && (component.get("v.internalGroup") != '--- None ---') && component.get("v.consult") == true) {
                    val2 = "&ingroup_choices=" + component.get("v.internalGroup");
                }
                if ((component.get("v.agent") != "") && (component.get("v.agent") != '--- None ---') && component.get("v.consult") == true) {
                    val2 = "&ingroup_choices=AGENTDIRECT&phone_number=" + component.get("v.agent");
                }

                if (val2 != '') {
                    if (!component.get("v.isDoneRendering")) {
                        component.set("v.isDoneRendering", true);
                        component.set("v.isGrabDoneRendering", false);
                        component.set("v.isHangXferDoneRendering", false);
                        helper.transferJqery(component, val, val2);
                    }
                } else {
                    component.getEvent('renderPanel').setParams({
                        toast: {
                            'type': 'warning',
                            'message': 'Consultative checkbox select and unselect during agent or Internal transfer selection.'
                        }
                    }).fire();
                }
            }
        } catch (error) {
            console.log('error at handleParkDial method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at handleParkDial method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }
    },

    handleGrabDial: function (component, event, helper) {
        try {
            if (!component.get("v.isGrabDoneRendering")) {
                component.set("v.isGrabDoneRendering", true);
                component.set("v.isHangXferDoneRendering", false);
                component.set("v.isDoneRendering", false);
                helper.grabJquery(component, "&value=GRAB_CUSTOMER");
            }
        } catch (error) {
            console.log('error at handleGrabDial method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at handleGrabDial method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }
    },

    handleInternal: function (component, event, helper) {
        try {
            var val = "LOCAL_CLOSER";
            var val2 = "";
            if ((component.get("v.internalGroup") != "") && (component.get("v.internalGroup") != '--- None ---')) {
                val2 = "&ingroup_choices=" + component.get("v.internalGroup");
            }
    
            if ((component.get("v.agent") != "") && (component.get("v.agent") != '--- None ---')) {
                val2 = "&ingroup_choices=AGENTDIRECT&phone_number=" + component.get("v.agent");
            }
    
            if (val2 != "") {
                component.set('v.spinner', true);
                helper.transferJqery(component, val, val2);
            } else {
                component.getEvent('renderPanel').setParams({
                    toast: {
                        'type': 'warning',
                        'message': 'Please select atleast one valid interal group.'
                    }
                }).fire();
                component.set('v.spinner', false);
    
            }
        } catch (error) {
            console.log('error at handleInternal method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at handleInternal method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }
    },

    handleLeaveThreeWay: function (component, event, helper) {  
        try {
            if(component.get("v.internalGroup") != '' || component.get("v.agent") != '' ||
            (component.get("v.externalNumber") != '' && component.get("v.externalNumber") != undefined))
         {    
             component.set('v.spinner', true);
             var val = "LEAVE_3WAY_CALL";
             var val2 = "";
             helper.transferJqery(component, val, val2);
         }else{
             component.getEvent('renderPanel').setParams({
                 toast: {
                     'type': 'warning',
                     'message': 'Please select atleast one valid option.'
                 }
             }).fire();
         }
        } catch (error) {
            console.log('error at handleLeaveThreeWay method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at handleLeaveThreeWay method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }      
    },

    handleHangupXfer: function (component, event, helper) {
        try {
            if(component.get("v.internalGroup") != '' || component.get("v.agent") != '' ||
            (component.get("v.externalNumber") != '' && component.get("v.externalNumber") != undefined))
         {    
             if (!component.get("v.isHangXferDoneRendering")) {
                 component.set("v.isHangXferDoneRendering", true);
                 component.set("v.isDoneRendering", false);
                 component.set("v.isGrabDoneRendering", false);
                 var val = "HANGUP_XFER";
                 var val2 = "";
                 helper.transferJqery(component, val, val2);
             }
         }else{
             component.getEvent('renderPanel').setParams({
                 toast: {
                     'type': 'warning',
                     'message': 'Please select atleast one valid option.'
                 }
             }).fire();
         }
        } catch (error) {
            console.log('error at handleHangupXfer method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at handleHangupXfer method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }
    },

    handleHangupBoth: function (component, event, helper) {
        try {
            if(component.get("v.internalGroup") != '' || component.get("v.agent") != '' ||
            (component.get("v.externalNumber") != '' && component.get("v.externalNumber") != undefined))
         {    
             component.set('v.spinner', true);
             var val = "HANGUP_BOTH";
             var val2 = "";
             helper.transferJqery(component, val, val2);
         }else{
             component.getEvent('renderPanel').setParams({
                 toast: {
                     'type': 'warning',
                     'message': 'Please select atleast one valid option.'
                 }
             }).fire();
         }
        } catch (error) {
            console.log('error at handleHangupBoth method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at handleHangupBoth method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }
    },

    handletransGroupList: function (component, event, helper) {
        try {
            if (!component.get("v.isInternalDoneRendering")) {
                component.set("v.isInternalDoneRendering", true);
                helper.transferGroupListJqery(component);
            }
        } catch (error) {
            console.log('error at handletransGroupList method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at handletransGroupList method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }
    },

    handleTransferGroup: function (component, event, helper) {
        try {
            component.set("v.agent", "");
            var selectedValue = event.getParam("value");
            component.find("selectItemAgent").set("v.value", "");
            component.set("v.internalGroup", selectedValue);
        } catch (error) {
            console.log('error at handleTransferGroup method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at handleTransferGroup method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }
    },

    handletransAgentList: function (component, event, helper) {
        try {
            helper.transferAgentListJqery(component);
        } catch (error) {
            console.log('error at handletransAgentList method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at handletransAgentList method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }
    },

    handleTransferAgent: function (component, event, helper) {
        try {
            component.set("v.internalGroup", "");
            var selectedValue = event.getParam("value");
            component.find("selectItem").set("v.value", "");
            component.set("v.agent", selectedValue);
            if(selectedValue === "" || selectedValue === undefined || selectedValue === null || selectedValue === '') {
                component.set("v.consult", false);
            }else{
                component.set("v.consult", true);
            }
        } catch (error) {
            console.log('error at handleTransferAgent method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at handleTransferAgent method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }
    },

    handleClose : function(component, event, helper) {
        try {
            component.getEvent('renderPanel').setParams({
                type : 'c:callInitiatedPanel',
                toast : {'type': 'normal', 'message': 'You can start again.'},
                attributes : {
                    'wapperApiObj' : component.get("v.wapperApiObj"),
                    'baseUrl' : component.get("v.baseUrl"),
                    'dialUser' : component.get("v.dialUser"),
                    'dialPwd' : component.get("v.dialPwd"),
                    'campaignId' : component.get("v.campaignId"),
                    'state' : component.get("v.state"),
                    'recordName' : component.get("v.recordName"),
                    'phone' : component.get("v.phone"),
                    'title' : component.get("v.title"),
                    'account' : component.get("v.account"),
                    'presence' : component.get('v.presence'),
                    'countryCode' : component.get('v.countryCode'), 
                    'stateId' : 'IncomingCall',
                    'tickerTime' : component.get("v.tickerTime"),
                    'isPark' : component.get("v.callInitiatePark"),
                    'isTransferParkActive' : false,
                    'newLeadPage' : false,
                    'isChecked': true,
                },
            }).fire();
        } catch (error) {
            console.log('error at handleClose method of DialShreeTransferCallModalController --- ' , JSON.stringify(error));
            console.log('error message at handleClose method of DialShreeTransferCallModalController --- ' , JSON.stringify(error.message));
        }
    }
})