class ObjectPool
{

	//example: core/server -> Core/Model/Server
	static getModel(shortcode)
	{
		return ObjectPool._getObj(shortcode , 'Model');
	}
	static getController(shortcode)
	{
		return ObjectPool._getObj(shortcode , 'Controller');
	}
	static getBlock(shortcode)
	{
		return ObjectPool._getObj(shortcode , 'Block')
	}


	/**
	 * @description - This should not be used by anyone, this is primarily a "private" method. 
	*/
	static _getObj(shortcode , type = 'Model')
	{
		let part = shortcode.split( '/' );

		let mod = ObjectPool.UppercaseFirst(part[0]);
		let objpath = ObjectPool.UppercaseWords(part[1].split('_').join(' ')).split(' ').join('/');

		let full = './' + mod + '/' + type + '/' + objpath;

		let obj = require(full);

		return obj;
	}


	/**
	* @param {String} str - The string to capitalize.
	* @return {String}
	*/ 
	static UppercaseFirst(str)
	{
		return str[0].toUpperCase() + str.substring( 1 , str.length );
	}
	static UppercaseWords(str)
	{
		let out = [];

		str.split( ' ' ).forEach( (part) => {
			out.push( ObjectPool.UppercaseFirst(part) );
		});

		return out.join(' ');
	}

}
module.exports = ObjectPool;