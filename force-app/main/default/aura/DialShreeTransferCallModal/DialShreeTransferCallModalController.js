({
    doInit: function (component, event, helper) {
        component.set("v.isHangXferDoneRendering", false);
        component.set("v.isDoneRendering", false);
        component.set("v.isGrabDoneRendering", false);
        helper.transferGroupListJqery(component);
        helper.transferAgentListJqery(component);
    },
    
    handleBlind: function (component, event, helper) {        
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
    },
    handleDialCustom: function (component, event, helper) {
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
        
    },
    handleParkDial: function (component, event, helper) {
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
        
    },
    handleGrabDial: function (component, event, helper) {
        if (!component.get("v.isGrabDoneRendering")) {
            component.set("v.isGrabDoneRendering", true);
            component.set("v.isHangXferDoneRendering", false);
            component.set("v.isDoneRendering", false);
            helper.grabJquery(component, "&value=GRAB_CUSTOMER");
        }
    },
    handleInternal: function (component, event, helper) {
        var val = "LOCAL_CLOSER";
        var val2 = "";
        //console.log('internal',component.get("v.internalGroup"));
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
        
    },
    handleLeaveThreeWay: function (component, event, helper) {        
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
    },
    handleHangupXfer: function (component, event, helper) {
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
    },
    handleHangupBoth: function (component, event, helper) {
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
    },
    handletransGroupList: function (component, event, helper) {
        if (!component.get("v.isInternalDoneRendering")) {
            component.set("v.isInternalDoneRendering", true);
            helper.transferGroupListJqery(component);
        }
    },
    handleTransferGroup: function (component, event, helper) {
        component.set("v.agent", "");
        var selectedValue = event.getParam("value");
        component.find("selectItemAgent").set("v.value", "");
        component.set("v.internalGroup", selectedValue);

    },
    handletransAgentList: function (component, event, helper) {
        helper.transferAgentListJqery(component);
    },
    handleTransferAgent: function (component, event, helper) {
        component.set("v.internalGroup", "");
        var selectedValue = event.getParam("value");
        component.find("selectItem").set("v.value", "");
        component.set("v.agent", selectedValue);
        if(selectedValue === "" || selectedValue === undefined || selectedValue === null || selectedValue === '') {
            component.set("v.consult", false);
        }else{
            component.set("v.consult", true);
        }
    },

    handleClose : function(component, event, helper) {
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
                

            },
        }).fire();
    }
})