({
    transferJqery: function (component, val, val2) {
        try {
            var transferUrl = component.get("v.baseUrl") + component.get("v.wapperApiObj").transfer +
            '&user=' + component.get("v.dialUser") +
            '&pass=' + component.get("v.dialPwd") +
            '&agent_user=' + component.get("v.dialUser") +
            '&value=' + val +
            val2;
      
        fetch(transferUrl)
            .then(response => {
                if (response.ok) return response.json()
                throw new Error('Network response was not ok.')
            }).then(data => {  
                if (data.status) {
                    if (val == 'HANGUP_BOTH' || val == 'LEAVE_3WAY_CALL' || val == 'BLIND_TRANSFER' || val == 'LOCAL_CLOSER') {
                        component.set('v.spinner', false);
                        component.getEvent('renderPanel').setParams({
                            type: 'c:DialShreeDisposition',
                            toast: {
                                'type': 'success',
                                'message': 'Transfer call successfully.'
                            },
                            attributes: {
                                'wapperApiObj': component.get("v.wapperApiObj"),
                                'baseUrl': component.get("v.baseUrl"),
                                'dialUser': component.get("v.dialUser"),
                                'campaignId' : component.get("v.campaignId")
                                // 'inputText' : component.get("v.inputText")
                            },
                        }).fire();
                    }
                    
                    if(val.includes("PARK_CUSTOMER_DIAL")){
                        component.set("v.isPark",false);
                        component.set('v.isHangupXferActive', false);
                        component.set('v.isDialButtonActive', true);
                        component.set('v.isBlindButtonActive', true);
                        component.set('v.isInternalButtonActive', true);
                    } 
                   else if(val.includes("DIAL_WITH_CUSTOMER") ){
                        component.set('v.isHangupXferActive', false);
                        component.set('v.isParkButtonActive', true);
                        component.set('v.isGrabButtonActive', true);
                        component.set('v.isBlindButtonActive', true);
                        component.set('v.isInternalButtonActive', true);
                    } 
                    else{
                        component.set('v.isBlindButtonActive', false);
                        component.set('v.isParkButtonActive', false);
                        component.set('v.isGrabButtonActive', false);
                        component.set('v.isInternalButtonActive', false);
                        component.set('v.isDialButtonActive', false);
                    }
                                       
                } else {
                    component.set('v.spinner', false);
                }
            });
        } catch (error) {
            console.log('error at transferJqery method of DialShreeTransferCallModalHelper --- ' , JSON.stringify(error));
            console.log('error message at transferJqery method of DialShreeTransferCallModalHelper --- ' , JSON.stringify(error.message));
        } 
    },

    transferGroupListJqery: function (component) {
        try {
            var opts = [];
            var transferGroupListUrl = component.get("v.baseUrl") + component.get("v.wapperApiObj").transferGroupList +
                '&campaign_id=' + component.get("v.campaignId");
                
            fetch(transferGroupListUrl)
                .then(response => {
                    if (response.ok) return response.json()
                    throw new Error('Network response was not ok.')
                }).then(data => {                
                    if (data.status) {
    
                        opts.push({
                            class: "optionClass",
                            label: "--- None ---",
                            value: ""
                        });
                        
                        if (data.data != undefined) {
                            for (var i = 0; i < data.data.length; i++) {
                                opts.push({
                                    "class": "optionClass",
                                    label: data.data[i],
                                    value: data.data[i]
                                });
                            }
                        }
                        component.set('v.internaloptions', opts);
                    } 
                });
        } catch (error) {
            console.log('error at transferGroupListJqery method of DialShreeTransferCallModalHelper --- ' , JSON.stringify(error));
            console.log('error message at transferGroupListJqery method of DialShreeTransferCallModalHelper --- ' , JSON.stringify(error.message));
        } 
    },

    transferAgentListJqery: function (component) {
        try {
            var opts = [];
            var transferAgentListUrl = component.get("v.baseUrl") + component.get("v.wapperApiObj").transferAgentList +
                '&campaign_id=' + component.get("v.campaignId")+'&agent_id='+component.get("v.dialUser");
    
            fetch(transferAgentListUrl)
                .then(response => {
                    if (response.ok) return response.json()
                    throw new Error('Network response was not ok.')
                }).then(data => {
                    if (data.status) {
                        opts.push({
                            class: "optionClass",
                            label: "--- None ---",
                            value: ""
                        });
                        var objJSON = data;                    
                        if (objJSON.data != undefined) {
                            for (var i = 0; i < objJSON.data.length; i++) {
                                opts.push({
                                    "class": "optionClass",
                                    label: objJSON.data[i].name + ' - ' + objJSON.data[i].id,
                                    value: objJSON.data[i].id
                                });
                            }
                        }
                        component.set('v.agentoptions', opts);
                    } 
                });
        } catch (error) {
            console.log('error at transferAgentListJqery method of DialShreeTransferCallModalHelper --- ' , JSON.stringify(error));
            console.log('error message at transferAgentListJqery method of DialShreeTransferCallModalHelper --- ' , JSON.stringify(error.message));
        } 
    },

    grabJquery : function(component,val) { 
        try {
            var grabUrl = component.get("v.baseUrl")+component.get("v.wapperApiObj").park+val+'&agent_user='+component.get("v.dialUser");
            fetch(grabUrl)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.status) {             
                    component.set("v.isPark",true);
                }
            })
            .catch(error => {
                console.error(error);
            })        
        } catch (error) {
            console.log('error at grabJquery method of DialShreeTransferCallModalHelper --- ' , JSON.stringify(error));
            console.log('error message at grabJquery method of DialShreeTransferCallModalHelper --- ' , JSON.stringify(error.message));
        } 
    }
})