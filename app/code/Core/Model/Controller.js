/**
 * This applies a more MVC approach to the system. 
 * Controllers take in a web request, and handle it accordingly. 
 * Routing these controllers by default will follow
 * package/controller_path/action
 */

class Controller
{
	constructor( request , response )
	{
		this.request = request;
		this.response = response;


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