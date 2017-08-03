#!/usr/bin/python
from teatypes import teatypes
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

class MyHandler(BaseHTTPRequestHandler):
	def do_GET(self):
		try:
			self.send_response(200)
			self.send_header('Content-type',	'text/html')
			self.end_headers()
			self.wfile.write('Agent up and running!')
			return  
		except IOError:
			self.send_error(404,'File Not Found: %s' % self.path)
			
	def do_POST(self):
		try:
			self.send_response(200)
			self.send_header('Content-type', 'text/html')
			self.end_headers()
			self.wfile.write('Agent up and running!')
			return
		except IOError:
			self.send_error(404,'File Not Found: %s' % self.path)


class TeaAgentServer:
	def __init__(self, name, version, info, port, contextPath):
		print 'Hello World!', name;
		self.name = name
		self.version = version
		self.info = info
		self.port = port
		self.contextPath = contextPath
		self.agentExtenderDetails = teatypes.AgentExtenderDetails(None, self.name, self.version, self.info, "REST", None, False, "1.0.0", False)
		
	def start(self):
		try:
			print 'Starting Server: ', self.name;
			server = HTTPServer(('', self.port), MyHandler)
			print 'httpserver started ...'
			server.serve_forever()
		except IOError:
			print 'ERROR ...'



	