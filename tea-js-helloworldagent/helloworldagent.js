// Access Agent Module
var agent = require('/Users/mtorres/dev/incubator/nodejs/tea-js-library/agent/agent.js');
var binder = require('/Users/mtorres/dev/incubator/nodejs/tea-js-library/agent/api/binder.js');
// Create Tea Agent Server
var teaAgentServer = agent.createTeaAgentServer("JsHelloWorld", "1.0", "Hello World Agent In JS", 8887, "/jshw");



function JsHelloWorldAgent(){

    this.name = "JsHelloWorldAgent";
    this.description = "Js hello world agent";
    this.typeName = "JsHWProduct";
    this.typeDescription = "Js Hw product info";
    this.members = {};
    this.members['helloworldMembers'] = '{"customization":"Tea Members customization Metadata Here"}';
    this.references = {};
    this.references['helloworldReference'] = '{"customization":"Tea References customization Metadata Here"}';
    this.operations = {};
    this.operations['helloworldOperation'] = '{"customization":"Tea Operation customization Metadata Here"}';
    /**
    // Optional Way to define custom binder
    this.teaBinder =	new binder.createTeaBinder();
	this.teaBinder.name = "renamedName"; 
	**/
	// Define permissions
	//this.permissions = '[{"name":"Lifecycle", "desc":"Permission1 description Here"}, {"name":"Update", "desc":"Permission2 description Here"}]'
   	
}



JsHelloWorldAgent.prototype.helloworldMembers = function () {
    return "In HelloWorld Members: ";
};

JsHelloWorldAgent.prototype.helloworldOperation = function (inParam) {
    return "In HelloWorld Operation: "+ inParam;
};

JsHelloWorldAgent.prototype.helloworldReference = function () {
    return "In HelloWorld Reference : ";
};

// Register top level object
teaAgentServer.registerTopLevelTeaObject(new JsHelloWorldAgent());

// Start the server
teaAgentServer.start();
