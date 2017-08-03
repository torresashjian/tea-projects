/* 
Package agent provides the api to create a TeaAgentServer, register TeaObjects
and start the Agent Server 
*/
package agent

import (
	"fmt"
    "net/http"
    "strconv"
    "log"
    "github.com/migueltorreslopez/tea-go-library/agent/types"
    "reflect"
    "github.com/migueltorreslopez/tea-go-library/agent/tags"
    "encoding/json"
    "io/ioutil"
)

var agentExtenderInfo *types.AgentExtenderInfo
var agentExtenderDetails *types.AgentExtenderDetails
var topLevelObjectType *types.AgentObjectType
var agentTopLevelTeaObject interface{}
 
// TeaAgentServer struct
type TeaAgentServer struct {
	Name, Version, Info, ContextPath string
	Port int
	IsTopLevelObjectRegistered bool
	AgentExtenderDetails *types.AgentExtenderDetails
}

// Create new TeaAgentServer
func NewTeaAgentServer(name string, version string, info string, port int, contextPath string) *TeaAgentServer{
	// Initialize Tea Agent Server
	teaAgentServer := &TeaAgentServer{Name: name, Version: version, Info: info, Port: port, ContextPath: contextPath, IsTopLevelObjectRegistered: false}
	// Create Agent Extender Info
	teaAgentServer.AgentExtenderDetails = types.CreateAgentExtenderDetails(teaAgentServer.Name, teaAgentServer.Version, teaAgentServer.Info)
	log.Println("Tea Agent Server created...")
	return teaAgentServer
}


	
func (teaAgentServer *TeaAgentServer) RegisterTopLevelTeaObject(topLevelTeaObject interface{}) {
	agentTopLevelTeaObject = topLevelTeaObject
	//topLevelElem := reflect.ValueOf(topLevelTeaObject)
	//fmt.Println(reflect.ValueOf(topLevelTeaObject).Elem().Field(1).)
	//fmt.Println(reflect.ValueOf(topLevelTeaObject).Elem().NumField())
	//reflect.ValueOf(myHelloWorldTopLevel).FieldByName("HelloWorld").Call([]reflect.Value{reflect.ValueOf("Hiiiii")})
	agentOperations := createAgentOperations (topLevelTeaObject)
	topLevelObjectType = types.NewAgentObjectType(teaAgentServer.Info, "TOP_LEVEL", "", agentOperations , teaAgentServer.Name, false, false, false, false)	
}



// Start the Tea Agent Server
func (teaAgentServer *TeaAgentServer) Start() {
	// Configure Root Handler
	configureRootHandler(teaAgentServer)
	// Configure AgentExtenderInfo handler
	configureAgentExtenderInfoHandler(teaAgentServer)
	// Configure AgentExtenderDetails handler
	configureAgentExtenderDetailsHandler(teaAgentServer)
	// Configure Ping handler
	configurePingHandler(teaAgentServer)
	// Configure Task handler
	configureTaskHandler(teaAgentServer)
		
	err := http.ListenAndServe(":" + strconv.Itoa(teaAgentServer.Port), nil)
	if err != nil {
  		log.Fatal("Error Configuring Agent Details: ", err)
  	}

}

// Configure Root Handler
func configureRootHandler(teaAgentServer *TeaAgentServer){
  	// Configure root agent
	http.HandleFunc("/", rootHandler)
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Agent up and running!")
}

// Configure Agent Extender Info Handler
func configureAgentExtenderInfoHandler(teaAgentServer *TeaAgentServer){
	// Configure Agent Info
	agentExtenderInfo = types.NewAgentExtenderInfo(true, "1.0.0-SNAPSHOT", teaAgentServer.Info,  "60:C5:47:98:BF:B7", teaAgentServer.Name, "REST", teaAgentServer.Version)
	http.Handle(teaAgentServer.ContextPath+"/agent/info", agentExtenderInfo)
}

// Configure Agent Extender Details Handler
func configureAgentExtenderDetailsHandler(teaAgentServer *TeaAgentServer){
	// Configure Agent Extender Details
	agentExtenderDetails = types.NewAgentExtenderDetails(agentExtenderInfo, []*types.AgentObjectType{topLevelObjectType})
  	http.Handle(teaAgentServer.ContextPath+"/agent/extender", agentExtenderDetails)
}

// Configure Ping Handler
func configurePingHandler(teaAgentServer *TeaAgentServer){
	// Configure Ping Reply
	pingReply := types.NewPingReply(teaAgentServer.Name, teaAgentServer.Version)
  	// Configure ping handler
	http.Handle(teaAgentServer.ContextPath+"/agent/ping", pingReply)
}

// Configure Task Handler
func configureTaskHandler(teaAgentServer *TeaAgentServer){
	// Configure task handler
	http.HandleFunc(teaAgentServer.ContextPath+"/task/", taskHandler)
}

// Task Handler
func taskHandler(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        // Add error handling here
    }
    // Unmarshal the task
    var task = types.Task{}
    err = json.Unmarshal(body, &task)
    if err != nil {
        // Add error handling here
    }
    var tempParamValue string
    var params map[string]interface{}
    params = make(map[string]interface{})
    // Unmarshal the params
	var requestBodyMap map[string]interface{}
	json.Unmarshal(body, &requestBodyMap)
	for k := range requestBodyMap {
		//fmt.Println("reflect.ValueOf(task).FieldByName(k).Type:", getJsonFieldName(reflect.ValueOf(&task).Elem().FieldByName(k)))
		//fieldByName := reflect.ValueOf(task).FieldByName(k)
		//if  fieldByName.String() != ""{
        	//fmt.Println("k:", k, "v:", v)
		//}
		//fmt.Println("FieldByName:", fieldByName.String())
		if k != "principal" && k != "operationName" &&k != "sessionId" &&k != "samlToken" &&k != "methodType" &&k != "objectType" &&k != "key" {
			params[k] = requestBodyMap[k]
			tempParamValue = requestBodyMap[k].(string)
		}
    }
    
    //fmt.Println(requestBodyMap)
    
    fmt.Println(params)
    
    //b, err2 := json.Marshal(task)
	//if err2 != nil {
  	//	log.Fatal("ServeHTTP: ", err)
  	//	fmt.Println("Error"+err.Error())
  	//}
  	//fmt.Println(string(b[:]))
    
    
    methodResult := reflect.ValueOf(agentTopLevelTeaObject).Elem().FieldByName(task.OperationName).Call([]reflect.Value{reflect.ValueOf(tempParamValue)})
    b, err2 := json.Marshal(types.TaskExecutionResponse{TaskId:"1", Result: string(methodResult[0].String()), TaskStatus: "done"})
    if err2 != nil {
  		log.Fatal("ServeHTTP: ", err)
  		fmt.Println("Error"+err.Error())
  	}
    fmt.Fprintf(w, string(b[:]))
}

func getJsonFieldName(in reflect.Value) string{
	return string(in.Kind())
}

func createAgentOperations (teaObject interface{}) []*types.AgentOperation {
	var agentOperations = []*types.AgentOperation{}
	fields := reflect.ValueOf(teaObject).Elem()
 
	for i := 0; i < fields.NumField(); i++ {
		typeField := fields.Type().Field(i)
		teaFieldData := string(typeField.Tag);
		if teaFieldData != "" {
			r := tags.TeaField{}
    		json.Unmarshal([]byte(teaFieldData), &r)
    		//fmt.Printf("%+v", r)
    		if &r.TeaOperation != nil {
    			valueField := fields.Field(i)
				parameters := createOperationParameters(typeField, valueField)
    			newAgentOperation := types.NewAgentOperation(false, "tea Operation Description", r.TeaOperation.MethodType, false, typeField.Name, parameters, "", "string", "")
    			agentOperations = append(agentOperations, newAgentOperation)
				//fmt.Printf("Field Name: %s,\t Field Value: %v,\t Tag Value: %s\n", typeField.Name, valueField.Interface())
			}
		}
	}
	
	
	//fmt.Println(reflect.ValueOf(teaObject).Elem().NumField())
	return agentOperations
}

func createOperationParameters (fieldType reflect.StructField, valueField reflect.Value) []*types.OperationParameter {
	var parameters = []*types.OperationParameter{}
	//fmt.Println("valueField.Name: %s", valueField.Type())
	var funcType = fieldType.Type
	//fmt.Println("funcType.Kind(): %s", funcType.Kind())
	//fmt.Println("funcType.Name: %s", funcType.Name())
	if funcType.Kind() == reflect.Func {
		for i:=0; i<funcType.NumIn(); i++ {
            inputParam := funcType.In(i)
            //fmt.Println("reflect.ValueOf(inputParam): %s", inputParam)
            //fmt.Println("inputParam.Name: %s", inputParam.Name())
            //fmt.Println("inputParam.Kind: %s", inputParam.Kind())
            newOperationParameter := types.NewOperationParameter("ALIAS_DEFAULT_VALUE", "Param Description here", false, "ParamName", false, inputParam.String())
			parameters = append(parameters, newOperationParameter)
        }
	}
	return parameters
}


