package types

import (
	"fmt"
    "net/http"
    "log"
    "encoding/json"
)

type AgentExtenderInfo struct {
	Id string `json:"id"`  
	Name string `json:"name"` 
	Version string `json:"version"`
	AgentInfo string `json:"agentInfo"`
	Protocol string `json:"protocol"`
	Machineid string `json:"machineid"` 
	IndexEnabled bool `json:"index-enabled"`
	LibraryVersion string `json:"library-version"`
	ExposePythonApi bool `json:"expose-python-API"`
}

//DELETE
func NewAgentExtenderInfo(indexEnabled bool, libraryVersion string, agentInfo string, machineid string, name string, protocol string, version string) *AgentExtenderInfo {
	return &AgentExtenderInfo{IndexEnabled: indexEnabled, LibraryVersion: libraryVersion, AgentInfo: agentInfo,  Machineid: machineid, Name: name, Protocol: protocol, Version: version}
}

type AgentExtenderDetails struct {
	*AgentExtenderInfo
	AgentResourceUri string `json:"agent-resource-uri,omitempty"` 
	AgentObjectTypes []*AgentObjectType `json:"objectType"`
	Customization string `json:"customization,omitempty"`
    //defaultRoles;
    //defaultPrivileges;
    //defaultViews;
	DeveloperNotes string `json:"developerNotes,omitempty"`
    //extensionProperties;
}

func CreateAgentExtenderDetails (name string, version string, agentInfo string) *AgentExtenderDetails{
	// Create Agent Extender Info
	agentExtenderInfo := &AgentExtenderInfo{Name: name, Version: version, AgentInfo: agentInfo, Protocol: "REST", IndexEnabled: false, LibraryVersion: "1.0.0", ExposePythonApi: false}
	return &AgentExtenderDetails{AgentExtenderInfo: agentExtenderInfo}
}

type Customization struct {
}

type AgentObjectType struct {
	Description string `json:"description"`
	Concept string `json:"concept"`
	DeveloperNotes string `json:"developerNotes,omitempty"`
	Operations []*AgentOperation `json:"operation,omitempty"`
	//references
	//specialTypes
	Name string `json:"name"`
	HasChildren bool `json:"has-children"`
	HasConfig bool `json:"has-config"`
	HasStatus bool `json:"has-status"`
	SharedOwnership bool `json:"shared-ownership"`
}

type PingReply struct {
	AgentTypeName string `json:"agentTypeName"`
	AgentTypeVersion string `json:"agentTypeVersion"`
	MetadataChanges string `json:"metadataChanges,omitempty"`
}

type AgentOperation struct {
	Async bool `json:"async"`
	//customization
	Description string `json:"description"`
	HttpMethod string `json:"http-method"`
	Internal bool `json:"internal"`
	Name string `json:"name"`
    Parameters []*OperationParameter `json:"parameter,omitempty"`
    Requires string `json:"requires,omitempty"` 
    ReturnValue string `json:"return-value"` 
    UriTemplate string `json:"uri-template"`     
}

type OperationParameter struct {
	Alias string `json:"alias"`
	//default
	Description string `json:"description"`
	MultiValued bool `json:"multi-valued"`
	Name string `json:"name"`
	Optional bool `json:"optional"`
	ParamType string `json:"type"`
}

type TopLevelTeaObject struct {

}

func NewOperationParameter(alias string, description string, multiValued bool, name string, optional bool, paramType string) *OperationParameter {
	return &OperationParameter{Alias: alias, Description: description, MultiValued: multiValued, Name: name, Optional: optional, ParamType: paramType}
}

func NewAgentOperation(async bool, description string, httpMethod string, internal bool, name string, parameters []*OperationParameter, requires string, returnValue string, uriTemplate string) *AgentOperation {
	return &AgentOperation{Async: async, Description: description, HttpMethod: httpMethod, Internal: internal, Name: name, Parameters: parameters, Requires: requires, ReturnValue: returnValue, UriTemplate: uriTemplate}
}

func NewPingReply(agentTypeName string, agentTypeVersion string) *PingReply {
	return &PingReply{AgentTypeName: agentTypeName, AgentTypeVersion: agentTypeVersion}
}

func NewAgentObjectType(description string, concept string, developerNotes string, operations []*AgentOperation, name string, hasChildren bool, hasConfig bool, hasStatus bool, sharedOwnership bool) *AgentObjectType {
	return &AgentObjectType{Description: description, Concept: concept, DeveloperNotes: developerNotes, Operations: operations,  Name: name, HasChildren: hasChildren, HasConfig: hasConfig, HasStatus: hasStatus, SharedOwnership: sharedOwnership}
}

//DELETE
func NewAgentExtenderDetails(agentExtendedInfo *AgentExtenderInfo, agentObjectTypes []*AgentObjectType) *AgentExtenderDetails {
	return &AgentExtenderDetails{AgentExtenderInfo: agentExtendedInfo, AgentObjectTypes: agentObjectTypes}
}

func (i *AgentExtenderInfo) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	b, err := json.Marshal(i)
	if err != nil {
  		log.Fatal("ServeHTTP: ", err)
  		fmt.Println("Error"+err.Error())
  	}
  	fmt.Fprintf(w, string(b[:]))
}

func (i *AgentExtenderDetails) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	b, err := json.Marshal(i)
	if err != nil {
  		log.Fatal("ServeHTTP: ", err)
  		fmt.Println("Error"+err.Error())
  	}
  	fmt.Fprintf(w, string(b[:]))
}

func (i *PingReply) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	b, err := json.Marshal(i)
	if err != nil {
  		log.Fatal("ServeHTTP: ", err)
  		fmt.Println("Error"+err.Error())
  	}
  	fmt.Fprintf(w, string(b[:]))
}