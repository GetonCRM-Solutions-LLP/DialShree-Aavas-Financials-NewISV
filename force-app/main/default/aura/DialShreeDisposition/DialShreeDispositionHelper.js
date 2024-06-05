({    
    dispoListJquey : function(component, event, helper) {    
        try {
            component.set('v.spinner', true); 
             
            var dispoListUrl = component.get("v.baseUrl")+component.get("v.wapperApiObj").dispositionList+'&campaign_id='+component.get("v.campaignId");
            
            fetch(dispoListUrl)
                .then(response => {               
                     return response.text();
                })
                .then(data => {
                    var resJson = JSON.parse(data);
                    if (resJson.status) {                    
                        component.set('v.spinner', false);
                        component.set('v.isError', false);
                        component.set("v.dispJson", resJson.data);
    
                        var statusMap = {};
                        resJson.data.forEach(function(item) {
                            statusMap[item.status] = item.status_name;
                        });
                        console.log('statusMap --- ' ,JSON.stringify(statusMap));
                        component.set("v.statusMap" ,statusMap);
                        
                    } else {
                        component.set('v.spinner', false);
                    }
                });
        } catch (error) {
            console.log('error at dispoListJquey method of DialShreeDispositionHelper --- ' , JSON.stringify(error));
            console.log('error message at dispoListJquey method of DialShreeDispositionHelper --- ' , JSON.stringify(error.message));
        }  
    },

    dispoCodeJquey : function(component, passParam ,event, helper ) {  
        try {
            component.set('v.spinner', true);   
            component.set("v.isDateTimePicker",false);
            component.set("v.hideDateTime",true); 
           
            var dispoCodeUrl = component.get("v.baseUrl")+component.get("v.wapperApiObj").disposition+'&value='+passParam+'&agent_user='+component.get("v.dialUser");
            fetch(dispoCodeUrl)
                .then(response => {
                    if (response.ok) return response.json()
                    throw new Error('Network response was not ok.')
                })
                .then(data => {
                        if (data.status) {
    
                            let mapOfData= new Map();
                            for (let key in data.data) {
                                if (data.data.hasOwnProperty(key)) {
                                    mapOfData.set(key, data.data[key]);
                                }
                            }
                            const dataMap = Object.fromEntries(mapOfData);
                            this.handleMapppings(component, event, dataMap);
    
                            if(!component.get("v.pauseCheck")){
                                
                                component.set('v.spinner', false); 
                                component.getEvent('renderPanel').setParams({
                                    type : 'c:dialShreeAdapter',
                                    toast : {'type': 'normal', 'message': 'Call was ended.'},                            
                                    attributes : {
                                        'wapperApi' : component.get("v.wapperApiObj"),
                                        'baseUrl' : component.get("v.baseUrl"),
                                        'dialUser' : component.get("v.dialUser"),
                                        'campaignId' : sessionStorage.getItem('campaignId'),
                                        'presence' : 'Available'
                                    },
                                }).fire(); 
                            }else{
                                setTimeout(() => { this.pauseJquey(component, event, helper);}, 2000);
                            }
    
                        } else {
                            component.set('v.spinner', false); 
                        }
                });
        } catch (error) {
            console.log('error at dispoCodeJquey method of DialShreeDispositionHelper --- ' , JSON.stringify(error));
            console.log('error message at dispoCodeJquey method of DialShreeDispositionHelper --- ' , JSON.stringify(error.message));
        }  
    },

    pauseJquey : function(component, event, helper) {  
        try {
            var pauseUrl = component.get("v.baseUrl")+component.get("v.wapperApiObj").pause+'&value='+'PAUSE'+'&agent_user='+component.get("v.dialUser");

            fetch(pauseUrl)
                .then(response => {
                    if (response.ok) return response.json()
                    throw new Error('Network response was not ok.')
                })
                .then(data => {
                    if (data.status) {
                        component.set('v.spinner', false); 
                        component.getEvent('renderPanel').setParams({
                            type : 'c:dialShreeAdapter',
                            toast : {'type': 'normal', 'message': 'Call was ended.'},                            
                            attributes : {
                                'wapperApi' : component.get("v.wapperApiObj"),
                                'baseUrl' : component.get("v.baseUrl"),
                                'dialUser' : component.get("v.dialUser"),
                                'campaignId' : sessionStorage.getItem('campaignId'),
                                'presence' : 'Pause'
                            },
                        }).fire(); 
                    }else{
                        component.set('v.spinner', false); 
                    }
                });
        } catch (error) {
            console.log('error at pauseJquey method of DialShreeDispositionHelper --- ' , JSON.stringify(error));
            console.log('error message at pauseJquey method of DialShreeDispositionHelper --- ' , JSON.stringify(error.message));
        }  
    },

    handleMapppings : function(component, event, dataMap, helper){
        try {
            var statusMap = JSON.parse(JSON.stringify(component.get("v.statusMap")));
            var CommunicationTreckingMap = {
                'recordId': component.get("v.recordId"),
                'dispositionData': dataMap,
                'statusMap' : statusMap,
                'NoMatchObject' : component.get("v.NoMatchObject")
            };
            let Stringdata = JSON.stringify(CommunicationTreckingMap);
            var action = component.get("c.InternalClassCall");
            action.setParams({
                dataMap:Stringdata
            });
            action.setCallback(this, (response) => {
                var state = response.getState();
                if (state === "SUCCESS") {
                } else {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.error("Error message: " + errors[0].message);
                        }
                    } else {
                        console.error("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);
            this.transmitAgentData(component, event, helper);
        } catch (error) {
            console.log('error at handleMapppings method of DialShreeDispositionHelper --- ' , JSON.stringify(error));
            console.log('error message at handleMapppings method of DialShreeDispositionHelper --- ' , JSON.stringify(error.message));
        }  
    },

    transmitAgentData : function (component, event, helper){
        try {
            var encodedInputText = encodeURIComponent(component.get("v.inputText"));

            var updateLeadURL = component.get("v.baseUrl")+'elision-api/main.php?source=test'+'&action=update_lead'+'&lead_id='+component.get("v.agentLeadId")+'&address2='+encodedInputText;
            fetch(updateLeadURL)
                .then(response => {
                    if (response.ok) return response.json()
                })
                .then(data => {
                    if(data.status){
                        
                    }else{
                        console.error("Error received at transmitAgentData, verify updateLeadURL parameters");
                    }
                })
                .catch(error => {
                    console.error(error);
                })
        } catch (error) {
            console.log('error at transmitAgentData method of DialShreeDispositionHelper --- ' , JSON.stringify(error));
            console.log('error message at transmitAgentData method of DialShreeDispositionHelper --- ' , JSON.stringify(error.message));
        }  
    }
})