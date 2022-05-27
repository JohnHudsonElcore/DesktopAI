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

	class Server 
	{
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
		on( eventName , callback ) {
			if( !this.events[ eventName ] )
			{
				this.events[ eventName ] = [];
			}
			this.events[ eventName ] = callback;
		}
		emit( eventName , data ) {
			if( !this.events[ eventName ] )
			{
				this.events[ eventName ] = [];
			}

			this.events[ eventName ].forEach( ( call ) => {

				call.call( this , data );

			} );
		}
		listen() {

			return new Promise((resolve , reject) => {
				try{
					this.state.http = http.createServer( ( req , res ) => {
					
						try{
							this.routeToController(req , res);
						}catch(e){
						  	res.end('<h1>Timed out</h1>');
						}

					} ).listen( this.listeningOn.unsecure );
					
					this.state.https = https.createServer( ( req , res ) => {
						
						try{
							this.routeToController(req , res);
						}catch(e){
						  	res.end('<h1>Timed out</h1>');
						}

					} ).listen( this.listeningOn.secure );
					resolve(this);
				}catch(e)
				{
					reject(e);
				}

			});
		}
		routeToController( req , res ){

			let requestPath = url.parse(req.url).pathname;
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
					   		filtered.push( part );
					   });

			info['module'] = filtered[0] ?? 'App';
			info['controller'] = filtered[1] ?? 'Dashboard';
			info['action'] = filtered[2] ?? 'Index';

			try{
				let controller = AppServer.getController( info['module'].toLowerCase() + '/' + info['controller'].toLowerCase() );

				let inst = new controller( req , res );

				inst[info['action'] + 'Action']();
			}catch(e)
			{
				let inst = AppServer.getController('error/page404');

				let controller = new inst( req , res );
				controller.execute( e );
			}

		}
		close(){
			this.state.http.close();
			this.state.https.close();
		}
	}
module.exports = Server;