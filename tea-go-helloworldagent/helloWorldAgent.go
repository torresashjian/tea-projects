package main

import (
	"fmt"
	"github.com/migueltorreslopez/tea-go-library/agent"
)

type MyHelloWorldTopLevel struct {
	HelloWorld func(string) string `{"teaOperation":{"methodType":"UPDATE"}}`
	HelloWorld2 func(string) string `{"teaOperation":{"methodType":"UPDATE"}}`
}

func HelloWorld(in string) string{
	fmt.Println("Inside Hello World Function here: "+in)
	return "Hello World!!! "+in
}


func HelloWorld2(in string) string{
	fmt.Println("Inside Hello World2 Function here: "+in)
	return "Hello World2!!! "+in
}

/*
Main Method to create new TeaAgentServer and register TeaObjects and start server
*/
func main() {
    fmt.Println("starting Go Hello World agent")
    // Create new Tea Agent Server
    teaAgentServer := agent.NewTeaAgentServer("GoHelloWorld", "1.0", "Hello World Agent In go", 8888, "/gohw") 
    
    teaAgentServer.RegisterTopLevelTeaObject(&MyHelloWorldTopLevel{HelloWorld:HelloWorld, HelloWorld2:HelloWorld2})
    teaAgentServer.Start();
}