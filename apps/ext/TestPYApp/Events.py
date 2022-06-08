import View

class LogoClickListener(View.Event):
	def __init__(self , component):
		super().__init__()
		self.component = component

	def onclick(self , event):
		self.component.addCss('borders' , '10px solid white')
		self.component.update()