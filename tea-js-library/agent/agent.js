var types = require('./types/types.js');
var binder = require('./api/binder.js');
var dispatchers = require('./dispatchers.js');
var iterators = require('./iterators.js');
var validators = require('./validators.js');
var coreTeaObject = require('./internal/coreTeaObject.js');

/**
 * Constructor for Tea Agent Server
 * @param type
 * @constructor
 */
function TeaAgentServer(name, version, info, port, contextPath) {
    this.name = name;
    this.version = version;
    this.info = info;
    this.port = port;
    this.contextPath = contextPath;
    this.isTopLevelObjectRegistered = false;
    this.initialized = false;
    this.requestTargets = [];
    // Create Agent Extender Details
    this.agentExtenderDetails = types.createAgentExtenderDetails(this.name, this.version, this.info);
    // Create CoreTeaObject
    this.coreTeaObject = coreTeaObject.createCoreTeaObject(this.agentExtenderDetails);
    this.registerSingletonTeaObject(this.coreTeaObject);
    this.requestDispatcher = dispatchers.createRequestDispatcher(this.agentExtenderDetails, this.requestTargets);
}

TeaAgentServer.prototype = {
    get id(){
        this.agentExtenderDetails.id;
    },
    set id(val){
        this.agentExtenderDetails.id = val;
    }
};

/**
 * Create New Tea Agent Server
 * @param name
 * @param version
 * @param info
 * @param port
 * @param contextPath
 * @returns {TeaAgentServer}
 */
exports.createTeaAgentServer = function(name, version, info, port, contextPath){
    return new TeaAgentServer(name, version, info, port, contextPath);
};

/**
 * Register Top Level Tea Object
 * @param teaObject
 */
TeaAgentServer.prototype.registerTopLevelTeaObject = function(teaObject){
    console.log('Registering Top Level Object');
    if(this.initialized){
        var errorMessage = 'Agent is already initialized.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    if(this.isTopLevelObjectRegistered){
        var errorMessage = 'Cannot register more than one TopLevelTeaObject.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    this.isTopLevelObjectRegistered = true;
    var customBinder = this.getTeaBinder(teaObject);
    // Use TopLevelTeaObjectIterator
    var iterator = new iterators.createTopLevelTeaAgentIterator(teaObject, this.agentExtenderDetails, customBinder, this.requestTargets);
    iterator.iterate();
    // Validate TopLevelTeaObject
    var validator = new validators.createTopLevelTeaAgentValidator(teaObject, this.agentExtenderDetails, customBinder);
    validator.validate();
};


/**
 * Register Singleton Tea Object
 * @param singletonTeaObject
 */
TeaAgentServer.prototype.registerSingletonTeaObject = function(teaObject){
    console.log('Registering Singleton Object');
    if(this.initialized){
        var errorMessage = 'Agent is already initialized.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    var customBinder = this.getTeaBinder(teaObject);
    // Use SingletonTeaObjectIterator
    var iterator = new iterators.createSingletonTeaAgentIterator(teaObject, this.agentExtenderDetails, customBinder, this.requestTargets);
    iterator.iterate();
    // Validate SingletonTeaObject
    //var validator = new validators.createTopLevelTeaAgentValidator(teaObject, this.agentExtenderDetails, customBinder);
    //validator.validate();
};

/**
 * Gets the Tea Binder for a tea object
 * If no binder is found, then a default one is returned
 * @param teaObject
 */
TeaAgentServer.prototype.getTeaBinder = function(teaObject){
    var customBinder = teaObject['teaBinder'];
    // Check that the binder is correct
    if(customBinder == undefined){
        customBinder = new binder.createTeaBinder();
    }  else if(!(customBinder instanceof binder.constructor)){
        var errorMessage = 'Invalid binder type, should be TeaBinder.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    return customBinder;
}


/**
 * Start the Tea Agent Server
 */
TeaAgentServer.prototype.start = function(){
    this.initialized = true;
    if(this.http == undefined){
        this.http = require('http');
    }
    contextPath = this.contextPath;
    configureRootHandler = this.configureRootHandler;
    configureAgentExtenderInfoHandler = this.configureAgentExtenderInfoHandler;
    console.log('Creating http server listen to port: '+this.port);
    this.http.createServer(this.requestDispatcher.processRequest).listen(this.port);
};


/**
 * Stop the Tea Agent Server
 */
TeaAgentServer.prototype.stop = function(){
    this.initialized = false;
    if(this.http != undefined){
        this.http.close();
    }
};


//function executeFunctionByName(functionName, context /*, args */) {
//    var args = Array.prototype.slice.call(arguments, 2);
//    var namespaces = functionName.split(".");
//    var func = namespaces.pop();
//    for (var i = 0; i < namespaces.length; i++) {
//        context = context[namespaces[i]];
//    }
//    return context[func].apply(context, args);
//}
