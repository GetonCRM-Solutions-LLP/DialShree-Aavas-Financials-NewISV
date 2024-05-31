({  
    pauseListApiJquey : function(component, event, helper) { 
        try {
            component.set('v.spinner', true); 
            var pauseListUrl = component.get("v.baseUrl")+component.get("v.wapperApiObj").pauseList+'&campaign_id='+component.get("v.campaignId");
    
            fetch(pauseListUrl)
                .then(response => {               
                     return response.text();
                })
                .then(data => { 
                    var pauseListJson = JSON.parse(data);
                    if (pauseListJson.status) {                   
                        component.set('v.spinner', false);
                        component.set('v.isError', false);
                        component.set("v.pauseJson",pauseListJson.data);
                    } else {
                        component.set('v.spinner', false);
                    }               
                });  
        } catch (error) {
            console.log('error at pauseListApiJquey method of DialShreePauseListHelper --- ' , JSON.stringify(error));
            console.log('error message at pauseListApiJquey method of DialShreePauseListHelper --- ' , JSON.stringify(error.message));
        }      
    },
    
    pauseCodeJquey : function(component, val, pauseLabel) {
        try {
            component.set('v.spinner', true); 
            var pauseCodeUrl = component.get("v.baseUrl")+component.get("v.wapperApiObj").pauseCode+'&value='+val+'&agent_user='+component.get("v.dialUser");
    
            fetch(pauseCodeUrl)
                .then(response => {
                    if (response.ok) return response.json()
                    throw new Error('Network response was not ok.')
                })
                .then(data => {     
                    if (data.status) {
                        component.set('v.spinner', false);
                        component.getEvent('renderPanel').setParams({
                            type : 'c:dialShreeAdapter',
                            toast : {'type': 'normal', 'message': 'Pause code '+val+' pass.'},
                            attributes : {
                                'wapperApi' : component.get("v.wapperApiObj"),
                                'baseUrl' : component.get("v.baseUrl"),
                                'dialUser' : component.get("v.dialUser"),
                                'presence' : 'Pause',
                                'pauseLabel' : pauseLabel
                            },           
                        }).fire();
    
                    } else {
                        component.set('v.spinner', false); 
                    }
                })
                .catch(error => {
                    component.set('v.spinner', false); 
                    console.error(error);                
                })
        } catch (error) {
            console.log('error at pauseCodeJquey method of DialShreePauseListHelper --- ' , JSON.stringify(error));
            console.log('error message at pauseCodeJquey method of DialShreePauseListHelper --- ' , JSON.stringify(error.message));
        }
    }      
})