/**
 * Binder base class for all Tea Properties
 * @constructor
 */
function TeaBinder(){

}

TeaBinder.prototype.getPropertyValue = function (propertyName, object){
    // Get name property name
    var namePropertyName = this[propertyName];
    return object[namePropertyName];
}

TeaBinder.prototype.getJsonPropertyValue = function (propertyName, object){
    try {
        var parsedJson = JSON.parse(object); // Produces a SyntaxError
        return parsedJson[propertyName];
    } catch (error) {
        // Handle the error
        console.log("Error Message: "+error.message);
        var errorMessage =  "Invalid Json format found for property: "+propertyName;
        console.log(errorMessage);
        throw Error(errorMessage);
    }
}

TeaBinder.prototype.parseJsonObject = function (object){
    try {
        return JSON.parse(object); // Produces a SyntaxError
    } catch (error) {
        // Handle the error
        console.log("Error Message: "+error.message);
        throw Error(error.message);
    }
}

TeaBinder.prototype.hasProperty = function (propertyName, object){
    // Get name property name
    var namePropertyName = this[propertyName];
    return namePropertyName in object;
}


TeaBinder.prototype.getMembersMetadata = function (propertyName, object){
    var members = this.getPropertyValue('members', object);
    for (var member in members){
        var memberMetadata = members[member];
        if(memberMetadata != undefined){
            // Get customization from member metadata
            return this.getJsonPropertyValue(propertyName, memberMetadata);
        }
    }
}


exports.createTeaBinder = function(){
    console.log('Creating TeaBinder ..');
    return new TeaBinder();
};

/**
 * Define the name property
 */
Object.defineProperty(TeaBinder.prototype, 'name', {
    value: "name",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the description
 */
Object.defineProperty(TeaBinder.prototype, 'description', {
    value: "name",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the typeName property
 */
Object.defineProperty(TeaBinder.prototype, 'typeName', {
    value: "typeName",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the typeDescription property
 */
Object.defineProperty(TeaBinder.prototype, 'typeDescription', {
    value: "typeDescription",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the developerNotes property
 */
Object.defineProperty(TeaBinder.prototype, 'developerNotes', {
    value: "developerNotes",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the specialTypes property
 */
Object.defineProperty(TeaBinder.prototype, 'specialTypes', {
    value: "specialTypes",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the customization property
 */
Object.defineProperty(TeaBinder.prototype, 'customization', {
    value: "customization",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the status property
 */
Object.defineProperty(TeaBinder.prototype, 'status', {
    value: "status",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the status property
 */
Object.defineProperty(TeaBinder.prototype, 'config', {
    value: "config",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the members property for base Tea object
 * members should be a map of key values,
 * where key is the function and value is the metadata
 */
Object.defineProperty(TeaBinder.prototype, 'members', {
    value: "members",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the references property for base Tea object
 * references should be a map of key values,
 * where key is the function and value is the metadata
 */
Object.defineProperty(TeaBinder.prototype, 'references', {
    value: "references",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the operations property for base Tea object
 * references should be a map of key values,
 * where key is the function and value is the metadata
 */
Object.defineProperty(TeaBinder.prototype, 'operations', {
    value: "operations",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the tea permissions property for base Tea object
 */
Object.defineProperty(TeaBinder.prototype, 'permissions', {
    value: "permissions",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the shared Ownership property for base Tea object
 */
Object.defineProperty(TeaBinder.prototype, 'sharedOwnership', {
    value: "sharedOwnership",
    writable: true,
    enumerable: true,
    configurable: true
});

/**
 * Define the shared Ownership property for base Tea object
 */
Object.defineProperty(TeaBinder.prototype, 'concept', {
    value: "concept",
    writable: true,
    enumerable: true,
    configurable: true
});
