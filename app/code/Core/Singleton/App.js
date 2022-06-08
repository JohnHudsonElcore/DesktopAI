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

		this.loadApps('core');
		this.loadApps('ext');
		this.inited = true;
		console.log('Emitting ready');
		this.emit('system-load' , {

		})
	}
	getUser()
	{
		if(!this.currentUser)
		{
			let User = ObjectPool.getModel('security/user');
			this.currentUser = new User();
			this.currentUser.load(1);		
		}
		return this.currentUser;
	}
	loadApps(codepool)
	{
		let apps = fs.readdirSync(ObjectPool.Root() + '/apps/' + codepool);

		const base = ObjectPool.Root() + '/apps/' + codepool + '/';
		apps.forEach( (app) => {
			const _app = base + '/' + app + '/';
			let manifest = require(_app + '/manifest');


			for(let evName in manifest.events)
			{
				manifest.events[evName].forEach( ( scriptToCall ) => {
					this.on(evName , () => {
						let path = ObjectPool.Root() + '/apps/' + codepool + '/' + app + '/' + scriptToCall;

						if(fs.existsSync(path + '.js'))
						{
							this.runScript(path);
						}else{

						}
					});

				} );					
			}
		});
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

	LaunchService( { type , app , service } )
	{
		let serviceKey = (type + "_" + app.meta.name + "_" + service).split("/").join("").toLowerCase();
		if(!this.services)
		{
			this.services = {};
		}
		if(this.services[serviceKey])
		{
			console.log("Service already running: " , app , service);
			return;
		}
		let scrpath = app.basePath + '/' + service;

		const serv = require(scrpath);

		let inst = new serv({
				resource: ObjectPool , 
				app: this
			});

		this.services[serviceKey] = inst;
	}

	Launch( codepool = 'core' , appName ) {

		try{
			ApplicationLauncher.Hide();
		}catch(e)
		{
			//not found, dont worry
		}

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
			if(this.current && this.current.onDestroy)
			{
				this.current.onDestroy();
			}
			if(app.onCreate){
				this.current = app;
				app.dir = baseDir;

				try{
					app.onCreate();
				}catch(e)
				{
					console.error(e);
				}
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