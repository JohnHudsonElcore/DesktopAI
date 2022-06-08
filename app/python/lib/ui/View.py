# @class lib.ui.View
# @author John Hudson
# the way view will work
# is by a nodeJS module
# listening for an update via command line
# this will output a JSON object
# which nodeJS will parse
# and create a layout 
# NodeJS and python will 
# listen to eachother
# NodeJS -> Python will be for events
# Python -> NodeJS layout updates.
# every View will need a "update" function
# and also a toJSON function.
# this will build a JSON tree
# which nodejs will use to render components.

import json
import os


class View:
	def __init__(self):
		self.children = []
		self.parent = None
		self.id = ""
		self.borderRadius = 'unset'
		self.events = {}
		self.attributes = {}
		self.isRoot = False
		self.css = {}
		self.events = []

	@staticmethod
	def root():
		return '../../';
	@staticmethod
	def getObject(path , useud = "use"):
		if useud == 'use':
			return View.root() + '/' + path
		else:
			return os.getcwd() + '/' + path

	"""
	@param {String} key - the key to use
	@param {String} value - the value to set to
	@return {View} self
	"""
	def attr(self , key , value):
		self.attributes[key] = value
		return self

	"""
	@param {String} key - the key to use
	@return {String} attr
	"""
	def getattr(self , key):
		return self.attributes[key]

	"""
	@param {String} eventName - the event to listen for
	@param {EventListener} eventListener - the event listener to listen
	"""
	def addEventListener(self , eventListener):
		self.events = self.events.append(eventListener)

	"""
	@param {String} eventName - the event to trigger
	@param {Mixed} data - the data to pass
	"""
	def emit(self , event , data):
		for handle in self.events:
			call = getattr(handle , 'on' + event , lambda: print('Unhandled event:' + event))
			call(data)

	"""
	:param integer width: The width of the View
	:param integer height: the height of the view
	"""
	def setSize(self , width , height):
		self.css['width'] = width
		self.css['height'] = height
		self.update()
		return self
	"""
	:param integer top: the Y position of the view, relative to parent
	:param integer left: the X position of the view, relative to parent
	"""
	def setPosition(self , top , left):
		self.css['top'] = top
		self.css['left'] = left
		return self
	"""
	:param string color: Hex/RGBA/HSV Colour
	"""
	def setTextColour(self , color):
		self.css['color'] = color
		return self
	"""
	:param string color: Hex/RGBA/HSV Colour
	"""
	def setBackgroundColour(self , color):
		self.css['background-color'] = color
		return self
	"""
	:param string image - relative to root directory of desktopAI
	"""
	def setBackgroundImage(self , img):
		self.css['background-image'] = img
		return self

	def setBorderRadius(self , radius):
		self.css['border-radius'] = radius

	"""
	: returns array - list of children
	"""
	def getChildren(self):
		return self.children
	
	def getCss(self):
		out = ''

		out += 'position:absolute;'
		
		for key in self.css:
			out += str(key) + ':' + self.css[str(key)] + ';'


		return out

	"""
	@param {String} key - the key to use i.e position
	@param {String} value - the value to set to i.e absolute
	@return {View} self
	"""
	def addCss(self , key , value):
		self.css[key] = value
		return self
	"""
	:param View child: the child view to add
	"""
	def addChild(self , child):
		self.children.append(child)
		child.setParent(self)
		return self
	"""
	:returns View parent: the parent view
	"""
	def getParent(self):
		return self.parent
	"""
	:param View parent: Set the parent
	"""
	def setParent(self , parent):
		self.parent = parent;

	"""
	@role update children, refreshes the output.
	"""
	def update(self):
		for child in self.children:
			child.update()
		self.toJSON()

	"""
	@return {String} DOM Element tag name
	"""
	def getNodeType(self):
		return 'div'

	"""
	@return {String} json - creates a JSON tree of components
	"""
	def toJSON(self):
		
		if self.getId() == '':
			raise Exception("All Components have to have an ID, they also have to unique!")
		out = """
			{
				\"message-type\": \"ViewComponent\" , 
				\"tagName\": \"""" + self.getNodeType() +  """\" , 
				\"css\": \"""" + self.getCss() + """\" , 
				\"id\": \"""" + self.getId() + """\" , 
				\"attributes\": """ + json.dumps(self.attributes) + """ , 
				\"is-root\": """ + str(self.isRoot).lower() + """ , 
				\"children\": [ """
		index = 0
		for child in self.getChildren():
			if index > 0:
				out += " , "
			out += child.toJSON()
			index += 1

		out += "\n]\n}"

		if self.parent is None:
			out += "\n\n\n";

		return out

	def setId(self , id):
		self.id = id
	def getId(self):
		return self.id

	"""
	@param {String} id - the ID of the component you're searching for
	@return {View|None} Child
	"""
	def findViewById(self , id):
		for child in self.children:
			if child.getId() == id:
				return child
			if child.findViewById(id) != None:
				return child.findViewById(id)
		return None

class Image(View):
	def __init__(self):
		super().__init__()
	
	def setSrc(self , src):
		self.attr('src' , src)
		return self

	def getNodeType(self):
		return 'img'

class Button(View):
	def __init__(self):
		super().__init__()

	def setText(self , text):
		self.attr('textContent' , text)









### NOW FOR A BASE EVENT LISTENER

"""
	This class is full of empty methods, extend this to add functionality for each
	event on a Component

	"keydown" , 
	"keyup" , 
	"focus" , 
	"blur" , 
	"mouseover" , 
	"mouseout" , 
	"contextmenu" , 
	"change" , 
	"input"
"""
class Event:
	def __init__(self):
		self.isEvent = True;

	def onclick(self , event):
		return self
	def ondblclick(self , event):
		return self
	def onkeydown(self , event):
		return self
	def onkeyup(self , event):
		return self
	def onfocus(self , event):
		return self
	def onblur(self , event):
		return self
	def onmouseover(self , event):
		return self
	def onmouseout(self , event):
		return self
	def oncontextmenu(self , event):
		return self
	def onchange(self , event):
		return self
	def oninput(self , event):
		return self