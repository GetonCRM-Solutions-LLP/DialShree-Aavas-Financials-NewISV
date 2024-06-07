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
                        //console.log('statusMap --- ' ,JSON.stringify(statusMap));
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
                            //console.log('mapOfData --- ', mapOfData);
                            const dataMap = Object.fromEntries(mapOfData);
                            //console.log('dataMap ---' ,JSON.stringify(dataMap));
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
            //console.log ('inside handleMappings --- ', JSON.stringify(dataMap));
            //console.log('record Id --- ' ,component.get("v.recordId"));
            var statusMap = JSON.parse(JSON.stringify(component.get("v.statusMap")));
    
            //console.log(component.get("v.NoMatchObject"));
    
            var CommunicationTreckingMap = {
                'recordId': component.get("v.recordId"),
                'dispositionData': dataMap,
                'statusMap' : statusMap,
                'NoMatchObject' : component.get("v.NoMatchObject")
            };
    
            //console.log('CommunicationTreckingMap --- ' ,JSON.stringify(CommunicationTreckingMap));
            let Stringdata = JSON.stringify(CommunicationTreckingMap);
            var action = component.get("c.InternalClassCall");
            action.setParams({
                dataMap:Stringdata
            });
            action.setCallback(this, (response) => {
                var state = response.getState();
                if (state === "SUCCESS") {
                    //console.log('inside success');
                } else {
                    var errors = response.getError();
                    //console.log('found errors' , errors);
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
        } catch (error) {
            console.log('error at handleMapppings method of DialShreeDispositionHelper --- ' , JSON.stringify(error));
            console.log('error message at handleMapppings method of DialShreeDispositionHelper --- ' , JSON.stringify(error.message));
        }  
    }
})