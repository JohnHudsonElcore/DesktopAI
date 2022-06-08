import sys
import os
import asyncio
sys.path.append("C:/Users/John.Hudson/OneDrive - AIM Smarter/Desktop/DesktopAI//app/python//lib/ui/__pycache__")

sys.path.append("C:/Users/John.Hudson/OneDrive - AIM Smarter/Desktop/DesktopAI//app/python//lib/ui")
os.chdir("C:/Users/John.Hudson/OneDrive - AIM Smarter/Desktop/DesktopAI/")

import WindowComponent
import View

sys.path.append("C:/Users/John.Hudson/OneDrive - AIM Smarter/Desktop/DesktopAI//apps/ext/TestPYApp")
import Events


win = WindowComponent.Window()
win.setId("window")
win.fromJSON(View.View.getObject('apps/ext/TestPYApp/layouts/app.json' , 'no-ud'))

asyncio.run(win.listen())

logo = win.findViewById('software-icon')

logo.addEventListener(Events.LogoClickListener(logo))

