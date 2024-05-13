({
	onInit : function(component, event, helper){
        helper.pauseListApiJquey(component, event, helper); 
    },
  
    handleDblClick : function(component, event, helper){
        var eventVaule = event.currentTarget.dataset.id;
        
        var pauseLabel = event.target.outerText;
        helper.pauseCodeJquey(component, eventVaule, pauseLabel);
    },
    handleClick : function(component, event, helper){
        var pauseArr = component.get('v.pauseJson');
        pauseArr.forEach(function(element){
                if(element.pause_code_name === event.target.outerText){
                    element.isHighlighted = true;
                }else{
                    element.isHighlighted = false;
                }
        })

        component.set('v.pauseJson', pauseArr);
    }
})