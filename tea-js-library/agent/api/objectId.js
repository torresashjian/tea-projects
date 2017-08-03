var exceptions = require('../exceptions/exceptions.js');

function ObjectId(agentId, agentTypeName, agentTypeVersion, objectTypeName, objectKey){
    this.agentId = agentId;
    this.agentTypeName = agentTypeName;
    this.agentTypeVersion = agentTypeVersion;
    this.objectTypeName = objectTypeName;
    this.objectKey = objectKey;
}

ObjectId.prototype.encodeIdToken = function(token) {
    if (typeof token === 'undefined' || token == null) {
        return '';
    }
    if (typeof token !== 'string') {
        if (typeof token === 'object') {
            token = token.toString();
        } else {
            throw 'token is not of type string';
        }
    }
    return encodeURIComponent(token);
};

ObjectId.prototype.decodeIdToken = function(token) {
    if (typeof token === 'undefined' || token == null) {
        return '';
    }
    if (typeof token !== 'string') {
        if (typeof token === 'object') {
            token = token.toString();
        } else {
            throw 'token is not of type string';
        }
    }
    return decodeURIComponent(token);
};

exports.createObjectId = function (agentId, agentTypeName, agentTypeVersion, objectTypeName, objectKey) {
    return new ObjectId(agentId, agentTypeName, agentTypeVersion, objectTypeName, objectKey);
};

exports.createObjectIdFromString = function (objectId) {
    var objectIdSplit = objectId.split(':');
    if(objectIdSplit.length != 5){
        throw new Error('Invalid ObjectId: '+objectId);
    }

    return new ObjectId(ObjectId.decodeIdToken(objectIdSplit[0]), ObjectId.decodeIdToken(objectIdSplit[1]), ObjectId.decodeIdToken(objectIdSplit[2]), ObjectId.decodeIdToken(objectIdSplit[3]), ObjectId.decodeIdToken(objectIdSplit[4]));
};