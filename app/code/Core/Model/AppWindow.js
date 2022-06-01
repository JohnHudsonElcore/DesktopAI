/**
 * @description - Should the server start correctly and everything working as should be 
 * this window will open. This will use the same models/classes the web client uses
 * so functionality will be build once, reuse many!
 * 
 * @author - John Hudson 
 */
const ObjectPool = require('./../../ObjectPool');
const {app , electron , BrowserWindow, Tray, Menu} = require('electron');
const { screen } = require('electron');

class AppWindow
{
	constructor()
	{

		// Create a window that fills the screen's available work area.
		const primaryDisplay = screen.getPrimaryDisplay();
		const { width, height } = primaryDisplay.workAreaSize;
		this.window = new BrowserWindow({
			webPreferences: {
				nodeIntegration: true , 
				contextIsolation: false
			} , 
			width: width , 
			height: height , 
			frame: false , 
			transparent: true , 
			icon: ObjectPool.Root() + '/app/media/app_drawer.png'
		});
		this.window.toggleDevTools();
		this.window.setMenu(null);
		this.window.loadFile('app/desktopclient/index.html');

		this.window.on('minimize',(event) => {
		    event.preventDefault();
		    this.window.hide();
		});

		this.window.on('close',  (event) => {
	        event.preventDefault();
	        this.window.hide();

		    return false;
		});
		this.tray = new Tray(ObjectPool.Root() + '/app/media/app_drawer.png');

		let contextMenu = Menu.buildFromTemplate([
			{label: "Show Interface" , click: () => {
				this.window.show();
			}} , 
			{
				label: "Exit app" , 
				click: () => {
					this.window.close();
				}
			}
		]);
		this.tray.setContextMenu(contextMenu);
	}
}
module.exports = AppWindow;