const ObjectPool = require('./../../ObjectPool');

const fs = require('fs');

class App
{
	constructor()
	{
		this.inited = false;
		this.events = {};
		this.current = null;
	}
	init()
	{
		if(this.inited)
		{
			return;
		}
		//load apps and register events.

		let apps = fs.readdirSync(ObjectPool.Root() + '/apps/core');

		const base = ObjectPool.Root() + '/apps/core/';
		apps.forEach( (app) => {
			const _app = base + '/' + app + '/';
			let manifest = require(_app + '/manifest');


			for(let evName in manifest.events)
			{
				manifest.events[evName].forEach( ( scriptToCall ) => {
					this.on(evName , () => {
						let path = ObjectPool.Root() + '/apps/core/' + app + '/' + scriptToCall;

						if(fs.existsSync(path + '.js'))
						{
							this.runScript(path);
						}else{

						}
					});

				} );					
			}
		});
		this.inited = true;
		console.log('Emitting ready');
		this.emit('system-load' , {

		})
	}
	runScript(path)
	{
		let obj = require(path);

		let inst = new obj(ObjectPool);

		inst.execute(this);
	}
	emit(eventName , data)
	{
		if(!this.events[eventName])
		{
			this.events[eventName] = [];
		}
		this.events[eventName].forEach((call) => {
			try{
				console.log('emitted ' + eventName);
				call(data);

			}catch(e)
			{
				console.error(e);
			}
		});
	}
	on(eventName , call)
	{
		if(!this.events[eventName])
		{
			this.events[eventName] = [];
		}
		this.events[eventName].push(call);
	}
	Launch( codepool = 'core' , appName ) {
		let baseDir = ObjectPool.Root() + '/apps/' + codepool + '/' + appName + '/';

		try{
			let manifest = require(baseDir + 'manifest');

			let entry = manifest.launch;

			let entryPath = baseDir + '/' + entry;

			if( !fs.existsSync(entryPath + '.js') )
			{
				alert('App not found: [ENOENT] ' + appName);
				return;
			}

			let index = require(entryPath);

			let app = new index({
				resource: ObjectPool , 
				app: this
			});

			if(app.onCreate){
				this.current = app;
				app.dir = baseDir;

				app.onCreate();
			}else{
				alert('Couldn\'t launch app ' + appName + ' no onCreate method');
			}
		}catch(e)
		{
			console.error(e);
			alert('App not found: [E_ERROR] ' + appName);
		}
	}
}

module.exports = App;