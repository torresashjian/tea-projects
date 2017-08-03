var types = require('./types/types.js');
var requestTarget = require('./internal/requestTarget.js');

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

function TeaIterator (){
}

TeaIterator.getParamNames = function(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '')
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES)
    if(result === null)
        result = []
    return result
};

TeaIterator.addMembersMetadata = function(teaObject, agentObjectType, binder) {
    var membersReference = types.createAgentObjectReference();
    // Add Name
    membersReference.name = "members";
    // Add Customization
    membersReference.customization = binder.getMembersMetadata("customization", teaObject);
    // Add multiplicity
    membersReference.multiplicity = true;
    agentObjectType.reference.push(membersReference);
};

TeaIterator.addReferencesMetadata = function(teaObject, agentObjectType, binder) {
    var references = binder.getPropertyValue('references', teaObject);
    for (var reference in references){
        var agentObjectReference = types.createAgentObjectReference();
        // Add Name
        agentObjectReference.name = reference;
        // Add multiplicity TODO Check impact of always returning arrays
        agentObjectReference.multiplicity = true;
        var referenceMetadata = references[reference];
        if(referenceMetadata != undefined){
            // Get customization from reference metadata
            agentObjectReference.customization = binder.getJsonPropertyValue("customization", referenceMetadata);
            // If reference name is overriden
            var refName = binder.getJsonPropertyValue("name", referenceMetadata);
            if(refName != undefined){
                agentObjectReference.name = refName;
            }
            // Get type from reference metadata
            agentObjectReference.type = binder.getJsonPropertyValue("type", referenceMetadata);
        }
        agentObjectType.reference.push(agentObjectReference);
    }
};



TeaIterator.addOperationsMetadata = function(teaObject, agentObjectType, binder) {
    var operations = binder.getPropertyValue('operations', teaObject);
    for (var operation in operations){
        var agentOperation = types.createAgentOperation();
        // Add Name
        agentOperation.name = operation;
        // TODO support async operations
        agentOperation.async = false;
        // Add default returnValue
        agentOperation.returnValue = "object";
        var operationMetadata = operations[operation];
        if(operationMetadata != undefined){
            // Get customization from operation metadata
            agentOperation.customization = binder.getJsonPropertyValue("customization", operationMetadata);
            // If operation name is overriden
            var opName = binder.getJsonPropertyValue("name", operationMetadata);
            if(opName != undefined){
                agentOperation.name = opName;
            }
            // Get description from operation metadata
            agentOperation.description = binder.getJsonPropertyValue("description", operationMetadata);
            // Get developerNotes from operation metadata
            agentOperation.developerNotes = binder.getJsonPropertyValue("developerNotes", operationMetadata);
            // Get httpMethod from operation metadata
            agentOperation.httpMethod = binder.getJsonPropertyValue("httpMethod", operationMetadata);
            if(agentOperation.httpMethod === undefined){
                agentOperation.httpMethod = "PUT";
            }
            // Get internal from operation metadata
            agentOperation.internal = binder.getJsonPropertyValue("internal", operationMetadata);
            if(agentOperation.internal === undefined){
                agentOperation.internal = false;
            }
            // Get hideFromClients from operation metadata
            agentOperation.hideFromClients = binder.getJsonPropertyValue("hideFromClients", operationMetadata);
            // TODO add return json schema
            // If operation return value is overriden
            var returnValue = binder.getJsonPropertyValue("returnValue", operationMetadata);
            if(returnValue != undefined){
                agentOperation.returnValue = returnValue;
            }
            // Check for parameters
            var paramNum = teaObject[operation].length;
            if(paramNum > 0){
                agentOperation.parameter = [];
                var paramNames = TeaIterator.getParamNames(teaObject[operation]);
                for (var paramName in paramNames){
                    var agentParam = types.createAgentParam();
                    agentParam.name = paramNames[paramName];
                    agentParam.description = paramNames[paramName];
                    agentParam.type = "object";
                    agentParam.optional = true;
                    agentParam.developerNotes = "";
                    agentParam.multiValued = false;
                    agentOperation.parameter.push(agentParam);
                }
            }
        }
        agentObjectType.operation.push(agentOperation);
    }
};



function addOperationsMetadata(teaObject, agentObjectType, binder) {
    var membersReference = types.createAgentObjectReference();
    // Add Name
    membersReference.name = "members";
    // Add Customization
    membersReference.customization = binder.getMembersMetadata("customization", teaObject);
    // Add multiplicity
    membersReference.multiplicity = true;
    agentObjectType.reference.push(membersReference);
}
/**
 * Iterate through TopLevelTeaObject properties to create metadata
 * @param topLevelTeaObject
 * @param agentExtenderDetails
 * @param binder
 * @constructor
 */
function TopLevelTeaAgentIterator(topLevelTeaObject, agentExtenderDetails, binder, requestTargets){
    this.topLevelTeaObject = topLevelTeaObject;
    this.agentExtenderDetails  = agentExtenderDetails;
    this.binder = binder;
    this.requestTargets = requestTargets;
    this.agentObjectType = types.createAgentObjectType();
    this.iterate = function (){
        console.log('Iterating..');
        this.recordStaticMetadata();
        this.requestTargets[this.agentObjectType.name] = requestTarget.createRequestTarget(topLevelTeaObject, binder);
        agentExtenderDetails.objectType.push(this.agentObjectType) ;
    };

    this.recordStaticMetadata = function(){
        console.log('Recording top level metadata..');
        // Create AgentObjectType
        this.agentObjectType.reference = [];
        this.agentObjectType.operation = [];
        // Get name value
        this.agentObjectType.name = binder.getPropertyValue('name', this.topLevelTeaObject);
        // Get typeName value
        //this.agentObjectType.typeName = binder.getPropertyValue('typeName', this.topLevelTeaObject);
        // Get typeDescription value
        this.agentObjectType.description = binder.getPropertyValue('typeDescription', this.topLevelTeaObject);
        // Get concept
        this.agentObjectType.concept = "TOP_LEVEL";
        // Get developerNotes
        this.agentObjectType.developerNotes = binder.getPropertyValue('developerNotes', this.topLevelTeaObject);
        // Set shared ownership
        this.agentObjectType.sharedOwnership = false;
        // Get special types
        this.agentObjectType.specialTypes = binder.getPropertyValue('specialTypes', this.topLevelTeaObject);
        // Get customization
        this.agentObjectType.customization = binder.getPropertyValue('customization', this.topLevelTeaObject);
        // Get hasStatus
        this.agentObjectType.hasStatus = binder.hasProperty("status", this.topLevelTeaObject);
        // Top Level does not have config
        this.agentObjectType.hasConfig = false;
        // Get hasChildren
        this.agentObjectType.hasChildren = binder.hasProperty("members", this.topLevelTeaObject);
        // Get member
        if(this.agentObjectType.hasChildren){
            TeaIterator.addMembersMetadata(this.topLevelTeaObject, this.agentObjectType, binder);
        }
        // Get references
        if(binder.hasProperty("references", this.topLevelTeaObject)){
            TeaIterator.addReferencesMetadata(this.topLevelTeaObject, this.agentObjectType, binder);
        }
        // Get operations
        if(binder.hasProperty("operations", this.topLevelTeaObject)){
            TeaIterator.addOperationsMetadata(this.topLevelTeaObject, this.agentObjectType, binder);
        }
        // Get Permissions
        /**if(binder.hasProperty("permissions", this.topLevelTeaObject)){
            if(this.agentExtenderDetails.permission == undefined){
                this.agentExtenderDetails.permission = [];
            }
            var permissions = binder.getPropertyValue('permissions', this.topLevelTeaObject);
            // Get Json Value
            this.agentExtenderDetails.permission.push(binder.parseJsonObject(permissions));
        }  **/
        // Get default privileges
        /**if(binder.hasProperty("defaultPrivileges", this.topLevelTeaObject)){
            if(this.agentExtenderDetails.defaultPrivileges == undefined){
                this.agentExtenderDetails.defaultPrivileges = [];
            }
            var defaultPrivileges = binder.getPropertyValue('defaultPrivileges', this.topLevelTeaObject);
            // Get Json Value
            this.agentExtenderDetails.defaultPrivileges.push(binder.parseJsonObject(defaultPrivileges));
        } **/
        // Get default roles
         /**if(binder.hasProperty("defaultRoles", this.topLevelTeaObject)){
            if(this.agentExtenderDetails.defaultRoles == undefined){
                this.agentExtenderDetails.defaultRoles = [];
            }
            var defaultRoles = binder.getPropertyValue('defaultRoles', this.topLevelTeaObject);
            // Get Json Value
            this.agentExtenderDetails.defaultRoles.push(binder.parseJsonObject(defaultRoles));
        }  **/
        // Get views
         /**if(binder.hasProperty("defaultViews", this.topLevelTeaObject)){
            if(this.agentExtenderDetails.defaultViews == undefined){
                this.agentExtenderDetails.defaultViews = [];
            }
            var defaultViews = binder.getPropertyValue('defaultViews', this.topLevelTeaObject);
            // Get Json Value
            this.agentExtenderDetails.defaultViews.push(binder.parseJsonObject(defaultViews));
        } **/



        // TODO The top level tea object does not support get configuration operation validator
        // TODO members should only have 1 function validator
        // TODO validate property json properties in metadatas
        // TODO validate reference name
        // TODO validate referenceType available in reference metadata
        // TODO validate method parameters?
        // TODO validate operation name
        // TODO does agentOperation need uri template??
        // TODO metadata for agentParam Description
        // TODO TeaRequires permission for TeaOperation
        // TODO add permissions, privileges roles and views
        // TODO do we need specialTypes?
        // TODO do we need notifications?
        // TODO what do we do if 2 registration has same objectType?
        /**
         * TODO Add this in the validator
        if(typeNamePropertyValue == undefined){
            var errorMessage = 'The typeName is not set for TopLevelTeaObject: '+ namePropertyValue;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }   **/

    };

    this.recordRequestTargets = function(){
        console.log('Recording top level request targets..');
    }
};

exports.createTopLevelTeaAgentIterator = function (topLevelTeaObject, agentExtenderDetails, binder, requestTargets){
    console.log('Creating TopLevelTeaAgentIterator');
    return new TopLevelTeaAgentIterator(topLevelTeaObject, agentExtenderDetails, binder, requestTargets);
};


/**
 * Iterate through TopLevelTeaObject properties to create metadata
 * @param teaObject
 * @param agentExtenderDetails
 * @param binder
 * @constructor
 */
function SingletonTeaAgentIterator(teaObject, agentExtenderDetails, binder, requestTargets){
    this.teaObject = teaObject;
    this.agentExtenderDetails  = agentExtenderDetails;
    this.binder = binder;
    this.requestTargets = requestTargets;
    this.iterate = function (){
        console.log('Iterating..');
        this.recordStaticMetadata();
        this.requestTargets[this.agentObjectType.typeName] = requestTarget.createRequestTarget(teaObject, binder);
        console.log('this.requestTargets in SingletonTeaAgentIterator: '+this.requestTargets['agent']);
    };

    this.recordStaticMetadata = function(){
        console.log('Recording singleton tea object metadata..');
        // Create AgentObjectType
        this.agentObjectType = types.createAgentObjectType();
        this.agentObjectType.reference = [];
        this.agentObjectType.operation = [];
        // Get name value
        this.agentObjectType.name = binder.getPropertyValue('name', this.teaObject);
        // Get typeName value
        this.agentObjectType.typeName = binder.getPropertyValue('typeName', this.teaObject);
        // Get typeDescription value
        this.agentObjectType.typeDescription = binder.getPropertyValue('typeDescription', this.teaObject);
        // Get concept
        this.agentObjectType.concept = binder.getPropertyValue('concept', this.teaObject);
        // Get developerNotes
        this.agentObjectType.developerNotes = binder.getPropertyValue('developerNotes', this.teaObject);
        // Set shared ownership
        this.agentObjectType.sharedOwnership = binder.getPropertyValue('sharedOwnership', this.teaObject);
        // Get special types
        this.agentObjectType.specialTypes = binder.getPropertyValue('specialTypes', this.teaObject);
        // Get customization
        this.agentObjectType.customization = binder.getPropertyValue('customization', this.teaObject);
        // Get hasStatus
        this.agentObjectType.hasStatus = binder.hasProperty("status", this.teaObject);
        // Get hasConfig
        this.agentObjectType.hasConfig = binder.hasProperty("hasConfig", this.teaObject);
        // Get hasChildren
        this.agentObjectType.hasChildren = binder.hasProperty("members", this.teaObject);
        // Get member
        if(this.agentObjectType.hasChildren){
            TeaIterator.addMembersMetadata(this.teaObject, this.agentObjectType, binder);
        }
        // Get references
        if(binder.hasProperty("references", this.teaObject)){
            TeaIterator.addReferencesMetadata(this.teaObject, this.agentObjectType, binder);
        }
        // Get operations
        if(binder.hasProperty("operations", this.teaObject)){
            TeaIterator.addOperationsMetadata(this.teaObject, this.agentObjectType, binder);
        }
        // Get Permissions
        /**if(binder.hasProperty("permissions", this.topLevelTeaObject)){
            if(this.agentExtenderDetails.permission == undefined){
                this.agentExtenderDetails.permission = [];
            }
            var permissions = binder.getPropertyValue('permissions', this.topLevelTeaObject);
            // Get Json Value
            this.agentExtenderDetails.permission.push(binder.parseJsonObject(permissions));
        }  **/
        // Get default privileges
        /**if(binder.hasProperty("defaultPrivileges", this.topLevelTeaObject)){
            if(this.agentExtenderDetails.defaultPrivileges == undefined){
                this.agentExtenderDetails.defaultPrivileges = [];
            }
            var defaultPrivileges = binder.getPropertyValue('defaultPrivileges', this.topLevelTeaObject);
            // Get Json Value
            this.agentExtenderDetails.defaultPrivileges.push(binder.parseJsonObject(defaultPrivileges));
        } **/
        // Get default roles
        /**if(binder.hasProperty("defaultRoles", this.topLevelTeaObject)){
            if(this.agentExtenderDetails.defaultRoles == undefined){
                this.agentExtenderDetails.defaultRoles = [];
            }
            var defaultRoles = binder.getPropertyValue('defaultRoles', this.topLevelTeaObject);
            // Get Json Value
            this.agentExtenderDetails.defaultRoles.push(binder.parseJsonObject(defaultRoles));
        }  **/
        // Get views
        /**if(binder.hasProperty("defaultViews", this.topLevelTeaObject)){
            if(this.agentExtenderDetails.defaultViews == undefined){
                this.agentExtenderDetails.defaultViews = [];
            }
            var defaultViews = binder.getPropertyValue('defaultViews', this.topLevelTeaObject);
            // Get Json Value
            this.agentExtenderDetails.defaultViews.push(binder.parseJsonObject(defaultViews));
        } **/



        // TODO The top level tea object does not support get configuration operation validator
        // TODO members should only have 1 function validator
        // TODO validate property json properties in metadatas
        // TODO validate reference name
        // TODO validate referenceType available in reference metadata
        // TODO validate method parameters?
        // TODO validate operation name
        // TODO does agentOperation need uri template??
        // TODO metadata for agentParam Description
        // TODO TeaRequires permission for TeaOperation
        // TODO add permissions, privileges roles and views
        // TODO do we need specialTypes?
        // TODO do we need notifications?
        /**
         * TODO Add this in the validator
         if(typeNamePropertyValue == undefined){
            var errorMessage = 'The typeName is not set for TopLevelTeaObject: '+ namePropertyValue;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }   **/

    };
};

exports.createSingletonTeaAgentIterator = function (teaObject, agentExtenderDetails, binder, requestTargets){
    console.log('Creating SingletonTeaAgentIterator');
    return new SingletonTeaAgentIterator(teaObject, agentExtenderDetails, binder, requestTargets);
};


