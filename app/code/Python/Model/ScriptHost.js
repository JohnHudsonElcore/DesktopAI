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
	/**
	 * @param {Function|Callable} call - the function to call when a message is received.
	 */
	onMessage(call)
	{
		this.callbacks.push(call);
	}
	/**
	 * @param {Function|Callable} call - the function to call when a error is received.
	 */
	onError(call)
	{
		this.errorCatch.push(call);
	}
	/**
	 * @param {String} argument - add an argument to python on execution
	 */
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
		this.container.stdout.on('data' , (data) => {
			data = Buffer.from(data).toString('utf-8');

			this.callbacks.forEach((call) => call(data));
		});
		this.container.stderr.on('data' , (data) => {
			data = Buffer.from(data).toString('utf-8');

			this.errorCatch.forEach((call) => call(data));
		});
	}
	/**
	 * @role - kill off python container.
	 */
	stop()
	{
		this.container.kill();
	}
}

module.exports = Python_ScriptHost;