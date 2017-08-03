/**
 * Agent Extender Info Object
 * @param id
 * @param name
 * @param version
 * @param agentInfo
 * @param protocol
 * @param machineId
 * @param indexEnabled
 * @param libraryVersion
 * @constructor
 */
function AgentExtenderInfo(id, name, version, agentInfo, protocol, machineId, indexEnabled, libraryVersion, exposePythonAPI) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.agentInfo = agentInfo;
    this.protocol = protocol;
    this.machineId = machineId;
    this.indexEnabled = indexEnabled;
    this.libraryVersion = libraryVersion;
    this.exposePythonAPI = exposePythonAPI;
}

exports.createAgentExtenderInfo = function (id, name, version, agentInfo, protocol, machineId, indexEnabled, libraryVersion, exposePythonAPI){
    return new AgentExtenderInfo(id, name, version, agentInfo, protocol, machineId, indexEnabled, libraryVersion, exposePythonAPI);
}


function AgentExtenderDetails(id, name, version, agentInfo, protocol, machineId, indexEnabled, libraryVersion, exposePythonAPI) {
    AgentExtenderInfo.call(this, id, name, version, agentInfo, protocol, machineId, indexEnabled, libraryVersion, exposePythonAPI);
    this.objectType = [];
}

AgentExtenderDetails.prototype = Object.create(AgentExtenderInfo.prototype);
AgentExtenderDetails.prototype.constructor = AgentExtenderDetails;

exports.createAgentExtenderDetails = function (name, version, agentInfo) {
    console.log('Creating AgentExtenderDetails ..');
    return new AgentExtenderDetails(null, name, version, agentInfo, "REST", null, false, "2.2.0", false);
};

function AgentObjectType() {
}

exports.createAgentObjectType = function () {
    console.log('Creating AgentObjectType ..');
    return new AgentObjectType();
};

function AgentObjectReference() {

}

exports.createAgentObjectReference = function () {
    console.log('Creating AgentObjectReference ..');
    return new AgentObjectReference();
};


function AgentOperation() {

}

exports.createAgentOperation = function () {
    console.log('Creating AgentOperation ..');
    return new AgentOperation();
};


function AgentParam() {

}

exports.createAgentParam = function () {
    console.log('Creating AgentParam ..');
    return new AgentParam();
};


function AgentPermission() {

}

exports.createAgentPermission = function () {
    console.log('Creating AgentPermission ..');
    return new AgentPermission();
};


function AgentObjectStatus() {

}

exports.createAgentObjectStatus = function () {
    console.log('Creating AgentObjectStatus ..');
    return new AgentObjectStatus();
};


function PingReply(agentTypeName, agentTypeVersion, needsConnectionDetails) {
    this.agentTypeName = agentTypeName;
    this.agentTypeVersion = agentTypeVersion;
    this.needsConnectionDetails = needsConnectionDetails;
}

exports.createPingReply = function (agentTypeName, agentTypeVersion, needsConnectionDetails) {
    console.log('Creating PingReply ..');
    return new PingReply(agentTypeName, agentTypeVersion, needsConnectionDetails);
};


function TaskExecutionResponse(taskId, result, taskStatus, progress, progressStatus, startTime, stopTime, throwable, errorMessage) {
    this.taskId = taskId;
    this.result = result;
    this.taskStatus = taskStatus;
    this.progress = progress;
    this.progressStatus = progressStatus;
    this.startTime = startTime;
    this.stopTime = stopTime;
    this.throwable = throwable;
    this.errorMessage = errorMessage;
}

exports.createTaskExecutionResponse = function (taskId, result, taskStatus, progress, progressStatus, startTime, stopTime, throwable, errorMessage) {
    console.log('Creating TaskExecutionResponse ..');
    return new TaskExecutionResponse(taskId, result, taskStatus, progress, progressStatus, startTime, stopTime, throwable, errorMessage);
};
