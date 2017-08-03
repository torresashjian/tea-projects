var types = require('../types/types.js');
var jsonParser = require('../internal/jsonParser.js');

function CoreTeaObject(agentExtenderDetails) {
    this.agentExtenderDetails = agentExtenderDetails;
    this.name = "agent";
    this.description = "Internal Tea agent Tea Object";
    this.typeName = "agent";
    this.typeDescription = "Internal Tea agent Tea Object Type";
    this.concept = "GROUP";
    this.status = function () {
        var status = types.createAgentObjectStatus();
        status.state = "RUNNING";
        return status;
    };
    this.config = function () {
        if (this.machineConfig == undefined) {
            var os = require('os');
            this.machineConfig = {};
            machineConfig.machinename = os.hostname();
            machineConfig.arch = os.arch();
        }
        return machineConfig;
    };
    this.operations = {};
    this.operations['info', 'extender', 'ping', 'solutions'];
};

/**
 * Return the extender info
 * TODO Pass the httpRequest to get connection and server url info
 * @param inParam
 * @returns {string}
 */
CoreTeaObject.prototype.info = function () {
    console.log('Called Info!!!!!!');
    var agentExtenderInfo = types.createAgentExtenderInfo(this.agentExtenderDetails.id,
        this.agentExtenderDetails.name, this.agentExtenderDetails.version, this.agentExtenderDetails.agentInfo,
        this.agentExtenderDetails.protocol, this.agentExtenderDetails.machineId,
        this.agentExtenderDetails.indexEnabled, this.agentExtenderDetails.libraryVersion,
        this.agentExtenderDetails.exposePythonAPI);
    return JSON.stringify(agentExtenderInfo, jsonParser.getAgentExtenderDetailsReplacer());
};

CoreTeaObject.prototype.extender = function () {
    console.log('Called extender!!!!!!');
    return JSON.stringify(this.agentExtenderDetails, jsonParser.getAgentExtenderDetailsReplacer());
};

CoreTeaObject.prototype.ping = function () {
    return JSON.stringify(types.createPingReply(this.agentExtenderDetails.name, this.agentExtenderDetails.version, false));
};

CoreTeaObject.prototype.secondRegistration = function () {
    console.log('Called secondRegistration!!!!!!');
    //TODO do this second registration operation
    return "";
};

CoreTeaObject.prototype.solutions = function () {
    console.log('Called solutions!!!!!!');
    //TODO do this solutions operation
    return "";
};

CoreTeaObject.prototype.sessionDestroyed = function () {
    console.log('Called sessionDestroyed!!!!!!');
    //TODO do this sessionDestroyed operation
    return "";
};

exports.createCoreTeaObject = function (agentExtenderDetails) {
    console.log('Creating CoreTeaObject');
    return new CoreTeaObject(agentExtenderDetails);
};


