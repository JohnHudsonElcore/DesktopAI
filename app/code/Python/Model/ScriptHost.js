const ObjectPool = require('./../../ObjectPool');

const {spawn} = require('child_process');

class Python_ScriptHost
{
	constructor()
	{
		this.commandLine = {
			PythonDir: ObjectPool.Root() + '/bin/python/python.exe' , 
			arguments: [

			]
		};
		this.callbacks = [];
		this.errorCatch = [];
	}
	onMessage(call)
	{
		this.callbacks.push(call);
	}
	onError(call)
	{
		this.errorCatch.push(call);
	}
	addArgument(argument)
	{
		this.commandLine.arguments.push(argument);
	}

	execute()
	{
		this.container = spawn(
			this.commandLine.PythonDir , 
			this.commandLine.arguments
		);
		console.log('Executing Python');
		this.container.stdout.on('data' , (data) => {
			data = Buffer.from(data).toString('utf-8');

			this.callbacks.forEach((call) => call(data));
		});
		this.container.stderr.on('data' , (data) => {
			data = Buffer.from(data).toString('utf-8');

			this.errorCatch.forEach((call) => call(data));
		});
	}
	stop()
	{
		this.container.kill();
	}
}

module.exports = Python_ScriptHost;