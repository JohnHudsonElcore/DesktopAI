class Dashboard_Launcher
{
	constructor({
		resource , 
		app
	})
	{
		this.resource = resource;
		this.app = app;

		this.homepageWidgets = [];

		app.emit('dashboard-widgets' , {
			dashboard: this
		});
	}
	addWidget(widget)
	{
		if(!widget.tagName)
		{
			throw new Error("Widget needs to be a HTML Element");
		}

		let container = this.app.getPageObject('.widget-container');

		container.appendChild(widget);
	}
	onCreate()
	{
		this.resource.loadContentView('app://dashboard.html');
	}
}
module.exports = Dashboard_Launcher;