const ObjectPool = require('./../../ObjectPool');

const Configuration = ObjectPool.getModel('core/configuration');

const fs = require('fs');

const { spawnSync , spawn } = require('child_process');

class DbConnection
{
	/**
	 * @singleton - This class is only instantiated once, the system can access it at any point.
	 *  - this is completely unresticted, but addons will have to request the permission to the database first.
	 */
	constructor()
	{
		this._changeMysqlIni(); //update my ini
		this._startService(); //service closes when app does.
		this.useDb = 'desktop_ai';
		let out = spawnSync(ObjectPool.Root() + '/bin/mysql/bin/mysql.exe' ,  ['-uroot' , '-eCREATE DATABASE IF NOT EXISTS ' + this.useDb , '--raw']);

		if(out.stderr)
		{
			console.error("CSTR: " + Buffer.from(out.stderr).toString('utf-8'));
		}
		if(out.stdout)
		{
			console.log("CSTR: " + Buffer.from(out.stdout).toString('utf-8'));
		}
	}
	/**
	 * @param {String} tableName - the name of the table to get the last insert id.
	 * @return {Integer|NULL} 
	 */
	lastInsertId(tableName)
	{
		return this.query(`SELECT AUTO_INCREMENT
							FROM  INFORMATION_SCHEMA.TABLES
							WHERE TABLE_SCHEMA = '${this.useDb}'
							AND   TABLE_NAME   = '${tableName}';`)[0].AUTO_INCREMENT;
	}

	/**
	 * @param {String} query to execute
	 * @param {Object} binds - key: value
	 * @return {Object} parsed response object.
	 */
	query(query , binds = {})
	{

		for(let val in binds)
		{
			if(typeof binds[val] === 'string' && binds[val] !== 'NULL')
			{
				query = query.split(':' + val).join(`'${binds[val]}'`);
			}else{
				query = query.split(':' + val).join(binds[val]);
			}
		}
		// console.log("Query: " + query);
		let a = null;

		try{
			a = spawnSync(ObjectPool.Root() + '/bin/mysql/bin/mysql.exe' ,  ['-uroot' , '-eUSE ' + this.useDb + ';' + query + '' , '--raw']);
		}catch(e)
		{
			console.log("An Error Occured: " + e.toString());
			return;
		}
		let res = Buffer.from(a.stdout);
		let err = Buffer.from(a.stderr);

		if(a.stderr && err.toString('utf-8') !== '')
		{
			
			console.error("An Error Occured: stderr" + err.toString('utf-8'));
			throw new Error(err.toString('utf-8') + ", Your Query was: " + query);
			
		}

		let rows = [];
		let headers = [];
		res.toString('utf-8').replace("\r" , "\n").split("\n").forEach((row , idx) => {
			if(idx == 0)
			{
				row.split(/(\s+)/im).forEach((col) => {
					if(col.trim() == '')
					{
						return;
					}
					headers.push(col.trim());
				});
			}else{
				if(row == '')
				{
					return;
				}
				
				let append = {};
				row.split("\t").forEach((col , a) => {

					append[headers[a]] = col.split('\r').join('');

				});

				rows.push(append);
			}
		});
		return rows;
	}

	//helper functions below
	/**
	 * @param {String} value to escape
	 * @return {String} escaped.
	 */
	escape(value){ 
		return value.replace(/\\/g, '\\\\').
			         replace(/\u0008/g, '\\b').
			         replace(/\t/g, '\\t').
			         replace(/\n/g, '\\n').
			         replace(/\f/g, '\\f').
			         replace(/\r/g, '\\r').
			         replace(/'/g, '\\\'').
			         replace(/"/g, '\\"');
	}

	/**
	 * this starts the service, this is called in launcher.js as this is a massive requirement.
	 */
	_startService()
	{

		let ls = spawn(ObjectPool.Root() + '/bin/mysql/bin/mysqld.exe' , ["-u root"]);

		ls.stdout.on('data', (data) => {
		  this.serviceContainer = true;
		});

		ls.stderr.on('data', (data) => {
			let message = Buffer.from(data).toString('utf-8');

			if(message.indexOf('starting as process') > -1)
			{
				this.serviceContainer = true;
				return;
			}
			console.error("An error occured: " + Buffer.from(data).toString('utf-8'));
		});

		ls.on('close', (code) => {
		  console.log("MySQL Exited: " + code);
		});
		
	}

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
			console.log("Cannot change INI");
			//this should probably error, but see how the workflow goes yet.
			return;
		}else{
			try{
				fs.writeFileSync(iniPath , `[mysqld]\ndatadir=${iniPath}\n[client]\n`);
			}catch(e)
			{
				console.log("Couldnt update myIni: " + e.toString());
			}
		}
	}
}
module.exports = DbConnection;