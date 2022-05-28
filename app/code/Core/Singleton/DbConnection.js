const ObjectPool = require('./../../ObjectPool');

const Configuration = ObjectPool.getModel('core/configuration');

class DbConnection
{
	/**
	 * @description - this is a "bridge" to different database drivers/connections. This allows users to choose their desired data storage method
	 * @param {String} @host     - The Host 
	 * @param {String} @username - the username
	 * @param {String} @password - the password
	 * @param {String} @schema   - the database to use
	 * @param {Number} @port     - the port of the database socket.
	 */
	constructor( { host , username , password , schema , port } )
	{
		this.auth = {
			host: host ?? "localhost" , 
			username: username ?? "root" , 
			password: password ?? "" , 
			schema: schema ?? null , 
			port: port ?? 3306
		};
		this.driver = 'mysql';
		this.config = new Configuration();

		if(this.config.getConfig('data-storage'))
		{
			this.driver = this.config.getConfig('data-storage');
		}
		this._connection = null;
	}

	/**
	 * @description - Tries to connect to the database.
	 * @return {Promise}
	*/
	connect()
	{
		return new Promise( ( resolve , reject ) => {

			switch(this.driver)
			{
				//only mysql is supported for now
				case "mysql":
				default:
					//load mysql adapter, assign that to _connection
					//there will be calls made from this class that mirror to 
					//the driver.

					this._changeMysqlIni();

					//todo: Implement this framework.
				break;
			}

		});
	}












	//helper functions below


	/**
	 * @info - mysql needs installing to the "bin/mysql"
	 * @description - changes the datadir to the correct folder, so DesktopAI should
	 *              - be able to be "directory independant" which should make the
	 * 				- app a bit more rigid to directory changes.
	 * @important - Make sure mysql is downloaded, may need an installer to create basic credentials
	 *            - this will have to be done "host" side rather than browser side!
	*/
	_changeMysqlIni()
	{
		let iniPath = ObjectPool.Root() + '/bin/mysql/bin/my.ini';

		if(!fs.existsSync(iniPath))
		{
			//this should probably error, but see how the workflow goes yet.
			return;
		}else{
			try{
				fs.writeFileSync(iniPath , `[mysqld]\ndatadir=${iniPath}\n[client]\n`);
			}catch(e)
			{

			}
		}
	}
}