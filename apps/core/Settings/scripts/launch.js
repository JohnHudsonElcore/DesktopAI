class Settings_Launcher
{
	constructor({
		resource , 
		app
	})
	{
		this.resource = resource;
		this.app = app;

	}
	
	
	onCreate()
	{
		
		this.resource.loadContentView('app://settings.html');

	}
}
module.exports = Settings_Launcher;