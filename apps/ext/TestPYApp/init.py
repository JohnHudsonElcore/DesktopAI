import sys
import os
sys.path.append("C:/Users/John.Hudson/OneDrive - AIM Smarter/Desktop/DesktopAI//app/python//lib/ui/__pycache__")

sys.path.append("C:/Users/John.Hudson/OneDrive - AIM Smarter/Desktop/DesktopAI//app/python//lib/ui")
os.chdir("C:/Users/John.Hudson/OneDrive - AIM Smarter/Desktop/DesktopAI/")

import WindowComponent
import View

win = WindowComponent.Window()
win.setId("window")
win.fromJSON(View.View.getObject('apps/ext/TestPYApp/layouts/app.json' , 'no-ud'))


win.listen()