/**
 * Validate TopLevelTeaObject
 * @param topLevelTeaObject
 * @param agentExtenderDetails
 * @param binder
 * @constructor
 */
function TopLevelTeaAgentValidator(topLevelTeaObject, agentExtenderDetails, binder){
    this.topLevelTeaObject = topLevelTeaObject;
    this.agentExtenderDetails  = agentExtenderDetails;
    this.binder = binder;
    this.validate = function (){
        console.log('Validating..');
        this.ValidateStaticMetadata();
    };

    this.ValidateStaticMetadata = function(){
    };
};

exports.createTopLevelTeaAgentValidator = function (topLevelTeaObject, agentExtenderDetails, binder){
    console.log('Creating TopLevelTeaAgentValidator');
    return new TopLevelTeaAgentValidator(topLevelTeaObject, agentExtenderDetails, binder);
};


