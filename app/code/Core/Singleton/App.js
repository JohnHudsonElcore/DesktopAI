const ObjectPool = require('./../../ObjectPool');

class App
{
	constructor()
	{
		this.apps = [];
		this.current = null;
		this.events = {};
	}
	emit(eventName , data)
	{
		if(!this.events[eventName])
		{
			this.events[eventName] = [];
		}
		this.events[eventName].forEach((call) => {
			try{
				call(data)
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
	SwitchTo(appId)
	{
		this.apps.forEach( ( app ) => {
			if(app.processId == appId)
			{
				if(app.isPaused())
				{
					app.Resume();
				}
			}else{
				if(!app.isPaused())
				{
					app.pause();
				}
			}
		} );
	}
	Launch( codepool = 'internal' , modelShortCode ) {

		try {
			if ( codepool == 'internal' ) {
				let dec = ObjectPool._getObj(modelShortCode , 'App');

				let inst = new dec();

				this.current = inst;
				let procId = new Date().getTime();
				this.apps.push({
					instance: inst , 
					processId: procId
				});

				this.emit('app-changed' , {
					app: inst ,
					processId: procId
				});

				inst.onStart();
			}
		}catch(e)
		{
			console.error(e);
		}
	}
}

module.exports = App;