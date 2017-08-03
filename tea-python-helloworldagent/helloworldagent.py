import agent

print "starting Python Hello World agent";
#Create new Tea Agent Server
teaAgentServer = agent.TeaAgentServer("PythonHelloWorld", "1.0", "Hello World Agent In python", 8886, "/gopy")
teaAgentServer.start()