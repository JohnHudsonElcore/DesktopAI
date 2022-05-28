/**
 * This applies a more MVC approach to the system. 
 * Controllers take in a web request, and handle it accordingly. 
 * Routing these controllers by default will follow
 * package/controller_path/action
 */

const ObjectPool = require('./../../ObjectPool');
const fs   	 	 = require('fs');
const { dirname } = require('path');
const qs = require('querystring');

class Controller
{

	/**
	 * @param {HttpRequest} request - The http/https request
	 * @param {HttpResponse} response - the http/https response
	 * @description - This function loads the session, stores the request and response and checks if this area is a 
	 *                public one or a protected page.
	 */
	constructor( request , response )
	{
		this.request = request;
		this.response = response;
		this.layout = null; //allow a layout builder.

		this.rawPost = '';

		let _sess = ObjectPool.getModel('core/session');

		this.session = new _sess( request );

		
		if(this.isProtectedPage() && request.url.toString().indexOf('app/login') < 0)
		{
			if(this.getSession().has('logged-in'))
			{

			}else{
				this.redirect('/app/login/index');
			}
		}

	}

	/**
	 * @param {String} data - The Raw POST data string
	 * @note - This should only be called through the server, do not override this function, or call it elsewhere.
	 */
	setPostData(data)
	{
		this.rawPost = data;
	}

	/**
	 * @param {String} output - Accepted types are raw, json, http
	 * @returns {mixed} - raw: string, json: Object, http: Object
	 */
	getPostData(output = 'raw')
	{
		switch(output)
		{
			case 'raw':
				return  this.rawPost;
			case 'json':
				return JSON.parse(this.rawPost) ?? {};
			case 'http':
				return qs.parse(this.rawPost) ?? {};
		}
	}

	/**
	 * @param {String} layoutFile - the path to the layout from the project root.
	 * @example - 'default.json' -> app/layout/default.json
	 */
	loadLayout(layoutFile = 'default.json')
	{
		let _layout = ObjectPool.getModel('core/layout');

		this.layout = new _layout();
		this.layout.setId('root')
				   .setTemplate('page/1-column.html');

		//get file for layout.

		
		let blocks = JSON.parse(fs.readFileSync( dirname(require.main.filename) + '/app/layout/' + layoutFile , 'utf-8' ) )
		this.layout.load(
			blocks
		);
	}

	/**
	 * @param {String} url - the URL to redirect to.
	 */
	redirect(url)
	{
		this.redirected = true;
		this.getResponse().writeHead(302, {
		  'Location': url
		  //add other headers here...
		});
		this.getResponse().redirected = true;
		this.getResponse().end();
	}

	/**
	 * @description calls render on the layout object, which recursively calls render on child blocks when used.
	 */
	renderLayout()
	{
		if(!this.redirected){
			this.getResponse().end(this.layout.render());
		}
	}

	/**
	 * @returns {Boolean} - If Request is sent via XMLHttpRequest or fetch, returns true, otherwise it returns false.
	 */
	isAjax()
	{
		return this.getRequestHeader('X-Requested-With') === 'XMLHttpRequest' ||
			   this.getRequestHeader('X-Requested-With') === 'fetch';
	}
	/**
	 * @abstract - this needs to be overriden on a per controller basis.
	 * @return {Boolean} - if its a protected page, return true, otherwise return false.
	 */
	isProtectedPage()
	{
		return false;
	}

	/**
	 * @param {String} key - the key of the header to retrieve.
	 * @return {String}
	 */
	getRequestHeader(key)
	{
		return this.getRequest().headers[key];
	}


	//SETTERS AND GETTERS BELOW
	/**
	 * @return {HttpRequest} - the http/https request object
	 */
	getRequest = () => { return this.request }

	/**
	 * @return {HttpResponse} - the http/https response object
	 */
	getResponse = () => { return this.response }

	/**
	 * @return {Layout:Block} - returns the layout object (extends Block)
	 */
	getLayout = () => { return this.layout; }

	/**
	 * @param {String} id - the Blocks ID. (See corresponding layout file)
	 * @return {Block|false} - if the block is found, its returned, otherwise false is returned.
	 */
	block = (id) => { return this.layout.getChild(id); }

	/**
	 * @return {Session} - The Session
	 */
	getSession = () => { return this.session; }

}

module.exports = Controller;