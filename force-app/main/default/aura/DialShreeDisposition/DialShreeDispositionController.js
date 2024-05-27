
/* global $A */
({
    onInit : function(component, event, helper){        
        helper.dispoListJquey(component, event, helper);
    },
    
    handleDblClick : function(component, event, helper){
        var eventVaule = event.currentTarget.dataset.id;
        if(eventVaule != 'CALLBK'){          
            helper.dispoCodeJquey(component, eventVaule, event, helper);             
        } else {
          
            component.set("v.isDateTimePicker",true);
            component.set('v.callbackValue', eventVaule);
            var currentDate = new Date();
            component.set("v.currentDateTime", currentDate.toISOString());
            component.set("v.hideDateTime",false);
        }
       
    },   
    handleClick : function(component, event, helper){
        var disArr = component.get('v.dispJson');
        disArr.forEach(function(element){
                if(element.status === event.currentTarget.dataset.id){
                    element.isHighlighted = true;
                }else{
                    element.isHighlighted = false;
                }
        })
        component.set('v.dispJson', disArr);
    },
    callBackSet :function(component, event, helper){
        
        var selectDateTime = new Date(component.get("v.dateTimeValue"));        
        var currentTime = new Date(component.get("v.currentDateTime"));        
        if(selectDateTime != null && selectDateTime > currentTime){
            var callBackBool;
            if(component.get("v.callbackType")){
                callBackBool = 'USERONLY'
            }
            else{
                callBackBool = 'ANYONE';
            }  
            
            var cbComment = component.get("v.callbackComm");
            cbComment = encodeURIComponent(cbComment);
            
            var selDate = component.get("v.dateTimeValue");
            var formattedDate = $A.localizationService.formatDate(selDate, "yyyy-MM-ddTHH:mm:ss");            
            component.set("v.dateTimeValue", formattedDate);
            formattedDate = formattedDate.replace("T", "+");        
            var passParam = "CALLBK&callback_datetime=" + formattedDate + "&callback_type="+callBackBool+"&callback_comments="+cbComment;
            helper.dispoCodeJquey(component, passParam );  
        }
        else{
            component.getEvent('renderPanel').setParams({               
                toast : {'type': 'warning', 'message': 'Please select valid Date time.'}                
            }).fire(); 
        }
    },
    
    onAgentInputTransmit : function(component, event, helper){
        var agentInputTransmit = event.getParam('agentLeadId');
        if(agentInputTransmit != null && agentInputTransmit != 'undefined'){
            component.set("v.agentLeadId" , agentInputTransmit);
        } 
    }
})