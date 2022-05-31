class SystemReadyLaunchDash
{
	constructor()
	{

	}

	execute(app)
	{
		app.Launch('core' , 'Dashboard');
	}
}

module.exports = SystemReadyLaunchDash;