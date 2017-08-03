var types = require('../types/types.js');

function RequestTarget(teaObject, binder) {
    this.teaObject = teaObject;
    this.binder = binder;
    this.invokeTask = function(agentUrl, req, task){
        console.log('task.taskId: '+task.taskId);
        var result = teaObject[task.operationName](task.params);
        return JSON.stringify(types.createTaskExecutionResponse(task.taskId, result, "done", 100, "done", 1, 1, null, null));
    };
    this.invoke = function(agentUrl, req){
        var objectType = agentUrl[1];
        if(agentUrl.length == 3){
            // Case property without key
            var propertyName = agentUrl[2];
            return this.invokeProperty(propertyName, req);
        } else if(agentUrl.length == 4){
            // Check if it is reference
            if(agentUrl[2] == 'reference'){
                //TODO process reference
            } else {
                var key = agentUrl[2];
                var propertyName = agentUrl[3];

            }
        } else{
            // TODO other dispatching options
        }
    };
    this.invokeProperty = function(propertyName, req){
        // TODO check if it is part of operations or members or references
         return teaObject[propertyName]();
    };
};


exports.createRequestTarget = function (teaObject, binder) {
    console.log('Creating RequestTarget');
    return new RequestTarget(teaObject, binder);
};


