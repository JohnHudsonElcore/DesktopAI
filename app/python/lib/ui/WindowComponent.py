import View
import json
import os

class Window(View.View):
	def __init__(self):
		super().__init__()
		self.isRoot = True
		self.addCss('top' , '0px').addCss('left' , '0px').addCss('right' , '0px').addCss('bottom' , '0px')
		
	async def listen(self):
		print(self.toJSON())
		try:
			
			update = input('')
			while update != '':
				self.handle(update)
			self.listen()

		except EOFError as e:
			print('{ "message-type": "error" , "error": "' + str(e) + '" }')
			self.listen()
			return self
	def handle(self , jsonstr):
		# print("\nEVENT:\n" + jsonstr + "\n======================\n")
		data = json.loads(jsonstr)

		if "message-type" in data:
			if data['message-type'] == "event":
				
				id = data['component-id']

				target = self.findViewById(id)

				if target != None:
					target.emit(data['event-name'] , data['event'])
			else:
				print('{"error": "Not a Event" }')

	def fromJSON(self , path):
		with open(path , 'r') as file:
			jsonstr = file.read()
			self.__buildTree(json.loads(jsonstr))

	def __buildTree(self , obj , parent = False):
		if not parent:
			parent = self
		component = None;
		if "Component" in obj:
			if "." in obj['Component']:
				component = self.getComponent(obj['Component'])
			else:
				component = self.getComponent("View." + obj['Component'])
		else:
			component = View.View()

		for attr in obj['attributes']:
			component.attr(attr , obj['attributes'][attr])
		component.setId(obj['id'])

		if "children" in obj:
			if obj['children'] != None:
				for child in obj['children']:
					self.__buildTree(child , component)

		if "css" in obj:
			props = obj['css'].split(";")

			for val in props:
				kv = val.split(":")
				if kv[0] != '':
					component.addCss(kv[0] , kv[1])

		parent.addChild(component)

	def getComponent(self , name):
	    components = name.split('.')
	    mod = __import__(components[0])
	    for comp in components[1:]:
	        mod = getattr(mod, comp)
	    return mod()
