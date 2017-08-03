var exceptions = require('./exceptions/exceptions.js');
var objectId = require('./api/objectId.js');

// Regex to process url
var regex = /(?:[^\/\\]+|\\.)+/g;

//  Info template
//TODO figure out the conflict of names in info
var INFO_TEMPLATE = "/{type:.*}/{key:.*}"
//  Config template (can operation template be this??)
var CONFIG_TEMPLATE = "/{type:.*}/{key:.*}/config"
//  Status template (can operation template be this??)
var STATUS_TEMPLATE = "/{type:.*}/{key:.*}/status"
//  Member template (can operation template be this??)
var MEMBERS_TEMPLATE = "/{type:.*}/{key:.*}/members"
//  Reference template
var REFERENCE_TEMPLATE = "/{type:.*}/{key:.*}/reference/{refName:.*}"
// Operation template
var PROPERTY_TEMPLATE = "/{type:.*}/{key:.*}/{opName:.*}"


var agentDispatcher = function(){
};

agentDispatcher.processRequest = function(req, res, body, agentUrl, agentExtenderDetails, requestTargets){
    // Find request target
    var objectType = agentUrl[1];
    if(objectType != undefined){
        // Find request Target for objectType
        var requestTarget = requestTargets[objectType];
        if(requestTarget != undefined){
            var result = requestTarget.invoke(agentUrl, req);
            res.writeHead(200, {'Content-Type': 'application/json'});
            if(result != undefined){
                res.write(result);
            }
            res.end();
        } else {
            // Throw an ObjectNotFound
            res.writeHead(499, {'Content-Type': 'application/json'});
            var onfException = exceptions.createTeaException('ObjectType not registered with name: '+objectType, 'Object not registered', -1, 404);
            res.write(JSON.stringify(onfException));
            res.end();
        }
    } else {
        // Throw an ObjectNotFound
        res.writeHead(499, {'Content-Type': 'application/json'});
        var onfException = exceptions.createTeaException('Object undefined for url: '+req.url, 'Object undefined', -1, 404);
        res.write(JSON.stringify(onfException));
        res.end();
    }
};

var taskDispatcher = function(){
};

taskDispatcher.processRequest = function(req, res, body, agentUrl, agentExtenderDetails, requestTargets){
    // Get Task Payload
    try {
        var data = JSON.parse(body);
        var task = {principal : '', operationName : '', sessionId : '', samlToken : '', methodType : '', key : '', objectType : ''};
        task.params = {};
        task.taskId = agentUrl[2];
        for (var property in data){
            if(task.hasOwnProperty(property)){
                task[property] = data[property];
            } else {
                task.params[property] = data[property];
            }
        }

    } catch (er) {
        // Throw an ObjectNotFound
        console.error(er);
        res.writeHead(499, {'Content-Type': 'application/json'});
        var onfException = exceptions.createTeaException('Wrong payload passed to task: '+req.url, 'Wrong payload passed to task', -1, 400);
        res.write(JSON.stringify(onfException));
        res.end();
        return;
    }
    try {
        // Find request Target for objectType
        var requestTarget = requestTargets[task.objectType];
        if(requestTarget != undefined){
            var result = requestTarget.invokeTask(agentUrl, req, task);
            res.writeHead(200, {'Content-Type': 'application/json'});
            if(result != undefined){
                res.write(result);
            }
            res.end();
        } else {
            // Throw an ObjectNotFound
            console.error(er);
            res.writeHead(499, {'Content-Type': 'application/json'});
            var onfException = exceptions.createTeaException('ObjectType not registered with name: '+task.objectType, 'Object not registered', -1, 404);
            res.write(JSON.stringify(onfException));
            res.end();
        }
    } catch (er) {
        // Throw an RequestTargetNotFound
        console.error(er);
        res.writeHead(499, {'Content-Type': 'application/json'});
        var onfException = exceptions.createTeaException('ObjectType not registered with name: '+task.objectType, 'Object not registered', -1, 404);
        res.write(JSON.stringify(onfException));
        res.end();
        return;
    }
};

function RequestDispatcher(agentExtenderDetails, requestTargets){
    this.agentExtenderDetails = agentExtenderDetails;
    this.requestTargets = requestTargets;
    this.processRequest = function(req, res){
        var body = '';
        // we want to get the data as utf8 strings
        // If you don't set an encoding, then you'll get Buffer objects
        req.setEncoding('utf8');

        // Readable streams emit 'data' events once a listener is added
        req.on('data', function (chunk) {
            body += chunk;
        })

        req.on('end', function () {
            var agentUrl = RequestDispatcher.prototype.getAgentUrl(req);
            if(agentUrl[1] === undefined){
                // Configure root handler
                console.log('ROOT HANDLER');
            } else if(agentUrl[1] === 'task'){
                taskDispatcher.processRequest(req, res, body, agentUrl, agentExtenderDetails, requestTargets);
            } else {
                agentDispatcher.processRequest(req, res, body, agentUrl, agentExtenderDetails, requestTargets);
            }
        })
    };
};

RequestDispatcher.prototype.getAgentUrl = function (req){
    var agentUrl = [];
    while (matched = regex.exec(req.url)) {
        agentUrl.push(matched[0]);
    }
    return agentUrl;
};


exports.createRequestDispatcher = function (agentExtenderDetails, requestTargets){
    console.log('Creating RequestDispatcher');
    return new RequestDispatcher(agentExtenderDetails, requestTargets);
};


