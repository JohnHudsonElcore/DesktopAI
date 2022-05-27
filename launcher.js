let ObjectPool = require('./app/code/ObjectPool');

let AppServer = ObjectPool.getModel('core/server');

let server = new AppServer();

server.listen()
	  .then( () => {

	  	//open app window
	  	console.log("Server Listening");
	  } )
	  .catch( (err) => {
	  	console.log("An Error Occured: " + err);
	  } );