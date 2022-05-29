const ObjectPool = require('./../../ObjectPool');

let cfg = ObjectPool.getModel('core/configuration');

const fs = require('node:fs');

const Configuration = new cfg();

class Installer
{
	constructor(){

	}
	requiresInstallation()
	{
		if(!fs.existsSync(ObjectPool.Root() + '/bin/mysql'))
		{
			//download, extract and install.
			return true;
		}

		return false;
	}
}
module.exports = Installer;