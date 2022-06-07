const ObjectPool = require('./../../ObjectPool');
const fs = require('fs');
const ModTool = ObjectPool.getModel('python/modTool');


/**
 * This is for Python Apps, this creates
 * a console instance, and listens for updates
 * from a python app such as View Updates
 * and sends python events, so click events can
 * purely be in python!
 */
class App
{
	static DESKTOP_AI_ROOT = ObjectPool.Root();

	constructor(params = {})
	{
		if(!params.script)
		{
			throw new Error("No Script Assigned for Python App!");
		}
		if(!params.workingDir)
		{
			throw new Error("No Working Directory for your Python script");
		}
		this.config = params;

		this.messageCallbacks = [];
	}
	injectDependencies()
	{
		//this will modify the entry file, 
		//import OS if not imported.
		// and use os.chdir to the working Directory.
		try {
			let scr = fs.readFileSync(ObjectPool.Root() + '/apps/ext/' + this.config.script , 'utf-8');
			let mod = new ModTool(scr);

			console.log(scr);

			mod.addDependency({
				type: 'import' , 
				pkg: 'os'
			});
			mod.addDependency({
				type: 'import' , 
				pkg: 'sys'
			});

			mod.injectAtTop('os.chdir("' + (this.config.workingDir.split("\\").join('/')) + '")');

			this.coreLibraries().forEach((libDir) => {
				mod.injectAtTop('sys.path.append("' + libDir.split('\\').join('/') + '")');
			});

			let script = mod.rewrite();
			fs.writeFileSync(ObjectPool.Root() + '/apps/ext/' + this.config.script , script);

			return true;
		} catch (e) {

			console.error(e);
			return false;
		}

	}
	coreLibraries()
	{
		//this will build a single dimensional array of directories containing .py files.

		return this.scandir(ObjectPool.Root() + '/app/python/');
	}
	scandir(path)
	{
		let out = [];

		fs.readdirSync(path).forEach((item) => {
			if(fs.lstatSync(path + '/' + item).isDirectory())
			{
				let all = this.scandir(path + '/' + item);

				all.forEach((entry) => out.push(entry));
			}else{
				if(item.indexOf('.py') > -1)
				{
					if(out.indexOf(path) > -1){

					}else{
						out.push(path);
					}
				}
			}
		});
		return out;
	}
	launch()
	{
		if(this.injectDependencies())
		{
			//injected dependencies.
			//now execute and listen.

			let ScriptHost = ObjectPool.getModel('python/scriptHost');

			let execution = new ScriptHost();
			execution.addArgument(ObjectPool.Root() + '/apps/ext/' + this.config.script);
			this.execution = execution;
			execution.onMessage((message) => {
				this.messageCallbacks.forEach((call) => call(message));
			});
			execution.onError((e) => {
				console.error(e);
			})
			execution.execute();
		}
	}
	destroy()
	{
		this.execution.stop();
	}
	onMessageRecieved(call)
	{
		this.messageCallbacks.push(call);
	}
}

module.exports = App;