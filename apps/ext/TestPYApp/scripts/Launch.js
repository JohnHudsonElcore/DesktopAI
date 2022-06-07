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
			workingDir: this.resource.Root()
		});
		this.pyapp.onMessageRecieved((message) => {
			this.listenForUI(message);
		})

		this.pyapp.launch();
	}
	onDestroy()
	{
		super.onDestroy();
		this.pyapp.destroy();
	}
}
module.exports = PyTestApp;