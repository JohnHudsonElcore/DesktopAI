const { dirname } = require('path');
const fs = require('fs');

class Configuration
{
	/**
	 * @param {Integer} userId - This loads user specific configurations as well as global config.
	*/
	constructor( userId = 0 )
	{
		this.userId = userId;

		try{
			if(!fs.existsSync(this.getVarDir()))
			{
				fs.mkdirSync(this.getVarDir());
			}
		}catch(e)
		{
			//didn't create for some reason, debug later
		}
		this.global = {};
		this.user = {};


		this.loadConfiguration(this.getVarDir() + '/global.conf');
		//load user config when that functionality is setup.
	}

	/**
	 * @param {String} key - the key to retrieve data.
	 * @param {String} scope - is this a user or global config.
	 * @return {NativeType}  
	*/
	getConfig(key , scope = 'global')
	{
		return this[scope][key];
	}

	/**
	 * @param {String} key - the key to set the value
	 * @param {NativeType} value - the value to set
	 * @param {String} scope - user/global
	 * @return {Configuration} this
	*/
	setConfig(key , value , scope = 'global')
	{
		this[scope][key] = value;
		this.save(scope);
		return this;
	}

	/**
	 * @param {String} scope - user/global. 
	*/
	save(scope = 'global')
	{
		try{
			let path = '';
			if( scope == 'global' )
			{
				path = this.getVarDir() + '/global.conf';
			}else{
				//when user setup, load user dir.
			}

			fs.writeFileSync(path , JSON.stringify(this[scope]));
		}catch(e)
		{

		}
	}

	/**
	 * @param {String} filepath - the config file location
	 * @param {integer} attempt - this gives it multiple times to try, if it fails, it cancels out
	 * @param {String} config - is this a user or global config?
	*/
	loadConfiguration(filepath , attempt = 0 , config = 'global')
	{
		try{
			this[config] = JSON.parse(fs.readFileSync(filepath , 'utf-8'));
		}catch(e)
		{
			//doesn't exist, create.

			if(attempt > 2){
				return;
			}else{
				fs.writeFileSync(filepath , '{}');
				this.loadConfiguration(filepath);
			}
		}
	}


	/**
	 * @return {String} path to var directory.
	 */
	getVarDir(){
		return dirname(require.main.filename) + '/var/config/';
	}
}

module.exports = Configuration;