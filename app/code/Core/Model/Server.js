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

			this.state.http = http.createServer( ( req , res ) => {
				this.emit( 'request' , {
					request: req , 
					response: res
				} );
				this.emit( 'secure-request' , {
					request: req
				} );

				setTimeout( () => {
					 
					  response.end('<h1>Timed out</h1>');

				} , this.defaultConfig.SERVER_TIMEOUT * 1000 );

			} ).listen( this.listeningOn.unsecurePort );
			
			this.state.https = https.createServer( ( req , res ) => {
				this.emit( 'request' , {
					request: req , 
					response: res
				} );
				this.emit( 'unsecure-request' , {
					request: req
				} );

				setTimeout( () => {
					 
					  response.end('<h1>Timed out</h1>');

				} , this.defaultConfig.SERVER_TIMEOUT * 1000 );

			} ).listen( this.listeningOn.securePort );
		}
		close(){
			this.state.http.close();
			this.state.https.close();
		}
	}
module.exports = Server;