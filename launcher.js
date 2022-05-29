//Get the Object Pool, this works similar to Magento's MVC Approach of
// Mage::getModel('catalog/product');

let ObjectPool = require('./app/code/ObjectPool');

let installer = ObjectPool.getSingleton('core/installer');

const {app,BrowserWindow,electron} = require('electron');
const fs = require('fs');

if(installer.requiresInstallation())
{
	app.on('ready' , () => {
		let win = new BrowserWindow({
			webPreferences: {
				nodeIntegration: true , 
				contextIsolation: false
			} , 
			width: 1200 , 
			height: 650 , 
			frame: false , 
			transparent: true
		});
		win.setMenu(null);
		win.loadFile('app/installer/index.html');

	});
}else{
	//used this event so I can use electron.
	app.on('ready' , () => {
		console.log("Starting DesktopAI");
		let DbConnection = ObjectPool.getSingleton('core/dbConnection');

		let connectionActiveChecker = setInterval(() => {

			if(DbConnection.serviceContainer)
			{

				clearInterval(connectionActiveChecker);
				if(fs.existsSync('tmp/.fresh'))
				{

				}
				//create the db connection.
				if( fs.existsSync('tmp/crd.tmp') )
				{

					let _u = ObjectPool.getModel('security/user');
					let admin = JSON.parse(fs.readFileSync('tmp/crd.tmp' , 'utf-8'));

					let user = new _u();
					user.setName(admin.name);
					user.setUsername(admin.username);
					user.setPassword(admin.password);


					if(DbConnection.query('SELECT COUNT(*) AS total FROM users')[0].total > 0){
						//do nothing
					}else{
						user.save();
						fs.unlinkSync('tmp/crd.tmp');
						console.log('Created new admin account');
					}

				}
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

					  	let appWindow = ObjectPool.getModel('core/appWindow');

					  	let win = new appWindow();


					  } )
					  .catch( (err) => {
					  	console.log("An Error Occured: " + err);
					  } );



			}

		} , 100);
	});
}