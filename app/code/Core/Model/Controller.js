/**
 * This applies a more MVC approach to the system. 
 * Controllers take in a web request, and handle it accordingly. 
 * Routing these controllers by default will follow
 * package/controller_path/action
 */

const ObjectPool = require('./../../ObjectPool');
const fs   	 	 = require('fs');
const { dirname } = require('path');


class Controller
{
	constructor( request , response )
	{
		this.request = request;
		this.response = response;
		this.layout = null; //allow a layout builder.
	}
	loadLayout(layoutFile = 'default.json')
	{
		let _layout = ObjectPool.getModel('core/layout');

		this.layout = new _layout();

		//get file for layout.

		
		let blocks = JSON.parse(fs.readFileSync( dirname(require.main.filename) + '/app/layout/' + layoutFile , 'utf-8' ) )
		this.layout.load(
			blocks
		);
	}
	isAjax()
	{
		return this.getRequestHeader('X-Requested-With') === 'XMLHttpRequest' ||
			   this.getRequestHeader('X-Requested-With') === 'fetch';
	}
	getRequestHeader(key)
	{
		return this.getRequest().headers[key];
	}


	//SETTERS AND GETTERS BELOW
	getRequest = () => { return this.request }
	getResponse = () => { return this.response }


}

module.exports = Controller;