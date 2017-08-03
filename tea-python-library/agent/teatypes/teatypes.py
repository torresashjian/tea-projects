class AgentExtenderInfo(object):
	def __init__(self, id , name, version, agentInfo, protocol, machineId, indexEnabled, libraryVersion, exposePythonAPI):
		self.id = id
		self.name = name
		self.version = version
		self.agentInfo = agentInfo
		self.protocol = protocol
		self.machineId = machineId
		self.indexEnabled = indexEnabled
		self.libraryVersion = libraryVersion
		self.exposePythonAPI = exposePythonAPI
		
class AgentExtenderDetails(AgentExtenderInfo):
	def __init__(self, id , name, version, agentInfo, protocol, machineId, indexEnabled, libraryVersion, exposePythonAPI):
		super(AgentExtenderDetails, self).__init__(id , name, version, agentInfo, protocol, machineId, indexEnabled, libraryVersion, exposePythonAPI)