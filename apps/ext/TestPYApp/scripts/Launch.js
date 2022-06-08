const ObjectPool = require('../../../../app/code/ObjectPool');

const PythonUIApp = ObjectPool.getInterface('python/PythonUIApp');

class PyTestApp extends PythonUIApp
{
	constructor({ resource , app })
	{
		super();
		this.resource = resource;
		this.app = app;

	}

	onCreate()
	{
		let PythonApp = this.resource.getModel('python/app');

		this.pyapp = new PythonApp({
			script: 'TestPYApp/init.py' , 
			workingDir: this.resource.Root() , 
			self: this
		});
		this.pyapp.onMessageRecieved((message) => {
			this.listenForUI(message);
		})
		this.onEventFired((eventName , event) => {
			this.pyapp.sendToPython(JSON.stringify({
				'message-type': 'event' , 
				'event-name': eventName , 
				'event': event , 
				'component-id': event.target.id
			}));
		});

		this.pyapp.launch();
	}
	onDestroy()
	{
		super.onDestroy();
		this.pyapp.destroy();
	}
}
module.exports = PyTestApp;