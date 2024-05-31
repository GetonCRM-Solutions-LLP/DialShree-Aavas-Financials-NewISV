({
	onInit : function(component, event, helper){
        try {
            helper.pauseListApiJquey(component, event, helper); 
        } catch (error) {
            console.log('error at onInit method of DialShreePauseListController --- ' , JSON.stringify(error));
            console.log('error message at onInit method of DialShreePauseListController --- ' , JSON.stringify(error.message));
        }
    },
  
    handleDblClick : function(component, event, helper){
        try {
            var eventVaule = event.currentTarget.dataset.id;
            var pauseLabel = event.target.outerText;
            helper.pauseCodeJquey(component, eventVaule, pauseLabel);
        } catch (error) {
            console.log('error at handleDblClick method of DialShreePauseListController --- ' , JSON.stringify(error));
            console.log('error message at handleDblClick method of DialShreePauseListController --- ' , JSON.stringify(error.message));
        }
    },

    handleClick : function(component, event, helper){
        try {
            var pauseArr = component.get('v.pauseJson');
            pauseArr.forEach(function(element){
                    if(element.pause_code_name === event.target.outerText){
                        element.isHighlighted = true;
                    }else{
                        element.isHighlighted = false;
                    }
            })
            component.set('v.pauseJson', pauseArr);
        } catch (error) {
            console.log('error at handleClick method of DialShreePauseListController --- ' , JSON.stringify(error));
            console.log('error message at handleClick method of DialShreePauseListController --- ' , JSON.stringify(error.message));
        }
    }
})