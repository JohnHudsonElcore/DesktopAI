//Get the Object Pool, this works similar to Magento's MVC Approach of
// Mage::getModel('catalog/product');

let ObjectPool = require('./app/code/ObjectPool');

//AppServer is the applications inbuilt server
let AppServer = ObjectPool.getModel('core/server');

//create the AppServer instance
let server = new AppServer();

//listen for HTTP(S) requests, when an error occurs, push to log. 
//this is only available in development, when the app is compiled,
//i need a better error handler.
server.listen()
	  .then( () => {

	  	//open app window
	  	console.log("Server Listening");
	  } )
	  .catch( (err) => {
	  	console.log("An Error Occured: " + err);
	  } );