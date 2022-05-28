/**
 * 	The purpose of this, is to allow commands to be sent remotely.
 *  Such as sending commands from a mobile device or another 
 *  computer, and the Desktop PC.
 *  
 *  This will involve "trusting" another device first. 
 *  If the device isn't registered as trusted, then the command will
 *  error out.
 */ 

const http = require('http');
const https = require('https');
const url = require('url');
const AppServer = require('./../../ObjectPool');
const fs = require('fs');
const { dirname } = require('path');
const path = require('path');

	class Server 
	{
		/**
		 * @param {Integer} unsecurePort - The Unsecure HTTP Server Port
		 * @param {Integer} securePort - The Secure HTTPS Server Port
		 */ 
		constructor( unsecurePort = 80 , securePort = 443 ) {
			this.listeningOn = {
				unsecure: unsecurePort , 
				secure: securePort
			};
			this.defaultConfig = {
				SERVER_TIMEOUT: 8 , //8 seconds
			}
			this.events = {
				'request' : [] , 
				'response-ready' : [] , 
				'unsecure-request' : [] , 
				'secure-request' : []
			}
			this.state = {
				listening: false
			};
		}

		/**
		 * @param {String} eventName - the name of the event to listen to
		 * @param {Function} callback - The function to execute open the event firing.
		 * @return void
		 */
		on( eventName , callback ) {
			if( !this.events[ eventName ] )
			{
				this.events[ eventName ] = [];
			}
			this.events[ eventName ] = callback;
		}

		/**
		 * @param {String} eventName - the name of the event to trigger.
		 * @param {mixed} data - the data to pass to the callback handler.
		 */
		emit( eventName , data ) {
			if( !this.events[ eventName ] )
			{
				this.events[ eventName ] = [];
			}

			this.events[ eventName ].forEach( ( call ) => {

				call.call( this , data );

			} );
		}


		/**
		 * @description - When a user posts over http/https - it hits this post function.
		 * @param {HttpRequest} req - The Request Object from http/https
		 * @param {HttpResponse} res - The Response Object from http/https
		 * @return void
		 */
		post( req , res )
		{
			let chunks = '';
			req.on('data', chunk => {
			  chunks += chunk;
			});
			req.on('end', () => {
			  // end of data
			  this.routeToController(req , res , chunks);
			});
		}

		/**
		 * @description - When a user makes a get request
		 * @param {HttpRequest} req - The Request Object from http/https
		 * @param {HttpResponse} res - The Response Object from http/https
		 * @return void
		 */
		get( req , res )
		{
			let name = dirname(require.main.filename) + '/' + url.parse(req.url.toString()).pathname;

			if(fs.existsSync(name) && !fs.lstatSync(name).isDirectory() )
			{
				console.log("!Directory: " + name)
				this.serveStatic(name , res);
				return;
			}
			try{
				this.routeToController(req , res);
			}catch(e){
			  	res.end(e.toString());
			}
			//time out after 10 seconds.
			setTimeout( () => {
				if(!res.writableEnded)
				{
					res.end("Timed out");
				}
			} , 10000);
		}

		/**
		 * 	@description - Creates the socket connections to listen to web requests.
		 *  @return {Promise} - Upon succession of the server sockets being opened.
		 */
		listen() {

			return new Promise((resolve , reject) => {

				this.getMachineIp().then((ip) => {
					console.log('Server running on: ' + ip);
					try{
						this.state.http = http.createServer( ( req , res ) => {

							if( req.method.toLowerCase() == 'post' ){

								this.post( req , res );

							}else{
							
								this.get( req , res );

							}

						} ).listen( this.listeningOn.unsecure , ip);
						
						this.state.https = https.createServer( ( req , res ) => {

							if( req.method.toLowerCase() == 'post' ){

								this.post( req , res );

							}else{
							
								this.get( req , res );

							}

						} ).listen( this.listeningOn.secure , ip);
						resolve(this);
					}catch(e)
					{
						reject(e);
					}
				});
			});
		}

		/**
		 * @return {Promise}
		 * @description - This function grabs the machine IP
		 * @see - https://stackoverflow.com/a/15075395 
		 */ 
		getMachineIp()
		{
			return new Promise((resolve , reject) => {
			  let interfaces = require('os').networkInterfaces();
			  for (let devName in interfaces) {
			    let iface = interfaces[devName];

			    for (let i = 0; i < iface.length; i++) {
			      let alias = iface[i];
			      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal && alias.address.indexOf('192.168') > -1)
			        resolve(alias.address);
			    }
			  }
			  reject('couldnt find');
			}); 
		}

		/**
		 * @description - Serves existing files, before attempting to use router.
		 * @param {String} $path - Path relative from the project directory.
		 * @param {HttpResponse} response - this needs to be added, so the filestream can pipe to the response.
		 * @return void;
		 */
		serveStatic( $path , response )
		{
			let mime = {
			    html: 'text/html',
			    txt: 'text/plain',
			    css: 'text/css',
			    gif: 'image/gif',
			    jpg: 'image/jpeg',
			    png: 'image/png',
			    svg: 'image/svg+xml',
			    js: 'application/javascript'
			};

			try{
				let type = mime[path.extname($path).slice(1)] || 'text/plain';
			    let s = fs.createReadStream($path);
			    
			    s.on('open', function () {
			        response.setHeader('Content-Type', type);
			        s.pipe(response);
			        console.log('Piped');
			    });
			    s.on('error', function (e) {
			        response.setHeader('Content-Type', 'text/plain');
			        response.statusCode = 404;
			        response.end('Error Occured: ' + e);
			    });
			    
			}catch(e)
			{
				response.end('An error occured: ' + e);
			}
		}

		/**
		 * @param {HttpRequest} req - The http/https request object
		 * @param {HttpResponse} res - The http/https response object
		 * @param @Optional {String} rawPost - sent via POST. This gets parsed in the controllers
		 * @return void;
		 */
		routeToController( req , res , rawPost = '' ){

			let requestPath = url.parse(req.url.toString()).pathname;
			// now we split this into module/controller/action
			let info = {
				module: "App" , 
				controller: "Dashboard" , 
				action: "Index"
			}
			let filtered = [];

			requestPath.split( '/' )
					   .forEach( ( part , idx ) => {
					   		if(part == '')
					   		{
					   			return;
					   		}
					   		filtered.push( this.ucwords(part) );
					   });

			info['module'] = filtered[0] ?? 'App';
			info['controller'] = filtered[1] ?? 'Dashboard';
			info['action'] = filtered[2] ?? 'Index';

			try{
				let controller = AppServer.getController( info['module'].toLowerCase() + '/' + info['controller'].toLowerCase() );

				let inst = new controller( req , res );
				inst.setPostData(rawPost);
				inst[info['action'] + 'Action']();
			}catch(e)
			{
				let inst = AppServer.getController('error/page404');

				let controller = new inst( req , res );
				controller.execute( e + " - Action Called: " + info['action'] + 'Action');
			}

		}

		/**
		 * @param {String} - the string to capitalise words on.
		 * @return {String}
		 */
		ucwords(str)
		{
			str = str.toLowerCase();
			  return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
			  	function(s){
			  	  return s.toUpperCase();
				});
		}

		/**
		 * @description - Closes the http/https sockets on the server.
		 */
		close(){
			this.state.http.close();
			this.state.https.close();
		}
	}
module.exports = Server;