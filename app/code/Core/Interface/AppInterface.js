const ObjectPool = require('./../../ObjectPool');

const fs = require('fs');

class AppInterface
{
	constructor()
	{
		this.paused = false;
	}
	onStart(){

	}
	isPaused()
	{
		return this.paused;
	}
	pause()
	{
		this.paused = true;
	}
	Resume()
	{
		this.paused = false;
	}
	Exit()
	{

	}
	getAppTemplate(path)
	{
		return fs.readFileSync(
			ObjectPool.Root() + '/app/code/' + path
		 , 'utf-8');
	}
	getWindow()
	{
		return document.querySelector('.content');
	}
	getComponent(qs)
	{
		return this.getWindow().querySelector(qs);
	}
}
module.exports = AppInterface;