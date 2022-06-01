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
		let timestr = this.getTime();
		let binds = {
			users_name: this.app.getUser().getName() , 
			time: timestr , 
			date: (new Date()).toLocaleDateString('en-GB') ,
			date_day: this.getDayName()
		}

		this.resource.loadContentView('app://dashboard.html' , binds);

		this.timeUpdate = setInterval(
			() => {
				try{
					this.resource.getPageObject('.date-widget .time').textContent = this.getTime();
					this.resource.getPageObject('.date-widget .date').textContent = (new Date()).toLocaleDateString('en-GB').split('/').join('-');
					this.resource.getPageObject('.date-widget .dayname').textContent = this.getDayName();
				}catch(e)
				{
					//not rendered yet
				}
			}
		 , 250);
	}
	getDayName(){
		let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		let d = new Date();
		let dayName = days[d.getDay()];
		return dayName;
	}
	getTime()
	{
		let d = new Date();

		let timestr = '';

		timestr += this.addZero(d.getHours()) + ':' +
				   this.addZero(d.getMinutes()) + ':' +
				   this.addZero(d.getSeconds());

		return timestr;
	}
	addZero(int)
	{
		if(int < 10)
		{
			return '0' + int;
		}
		return int;
	}
}
module.exports = Dashboard_Launcher;