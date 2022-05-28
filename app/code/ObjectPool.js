const { dirname } = require('path');
class ObjectPool
{

	//example: core/server -> Core/Model/Server
	/**
	 * @param {String} shortcode - the class shortcode
	 * @return {Mixed}
	 */
	static getModel(shortcode)
	{
		return ObjectPool._getObj(shortcode , 'Model');
	}
	/**
	 * @param {String} shortcode - the class shortcode
	 * @return {Mixed}
	 */
	static getController(shortcode)
	{
		return ObjectPool._getObj(shortcode , 'Controller');
	}
	/**
	 * @param {String} shortcode - the class shortcode
	 * @return {Mixed}
	 */
	static getBlock(shortcode)
	{
		return ObjectPool._getObj(shortcode , 'Block')
	}
	/**
	 * creates single instances of singletons, registers them globally, then allows scripts to pull them
	 * in a bid to keep data connection counts low.
	 * @param {String} shortcode
	 * @return {Singleton|Mixed} object
	*/
	static getSingleton(shortcode)
	{
		if(global[ObjectPool.getSingletonKey(shortcode)])
		{
			return global[ObjectPool.getSingletonKey(shortcode)];
		}

		let obj = ObjectPool._getObj(shortcode , 'Singleton');

		let inst = new obj();

		global[ObjectPool.getSingletonKey(shortcode)] = inst;

		return global[ObjectPool.getSingletonKey(shortcode)];
	}

	/**
	 * returns the root directory
	*/
	static Root()
	{
		return dirname(require.main.filename) + '/';
	}
	/**
	 * @description - This should not be used by anyone, this is primarily a "private" method. 
	 * @param {String} shortcode - Example: core/controller -> app/code/Core/${type}/Controller
	 * @param {String} type - Defaults to Model, basically what folder to search for the class.
	 * @return {Mixed|Object}
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
	static getSingletonKey(shortcode)
	{
		let part = shortcode.split( '/' );

		let mod = ObjectPool.UppercaseFirst(part[0]);
		let objpath = ObjectPool.UppercaseWords(part[1].split('_').join(' ')).split(' ').join('/');

		let full = mod + '_singleton_' + objpath;

		return full;
	}

	/**
	* @param {String} str - The string to capitalize.
	* @return {String}
	*/ 
	static UppercaseFirst(str)
	{
		return str[0].toUpperCase() + str.substring( 1 , str.length );
	}
	/**
	 * @param {String} str - the string to capitalize words on
	 * @return {String}
	 */
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