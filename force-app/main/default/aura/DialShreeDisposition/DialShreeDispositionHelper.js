({    
    dispoListJquey : function(component, event, helper) {      
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
                } else {
                    component.set('v.spinner', false);
                }
            });
    },

    dispoCodeJquey : function(component, passParam ,event, helper ) {  
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
    },

    pauseJquey : function(component, event, helper) {  
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
    }
})