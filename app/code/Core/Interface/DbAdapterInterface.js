/**
 * @interface - DB Drivers should all extend this class. 
 * all methods will throw an Error - (By design) enforcing that
 * the drivers should implement this interface. 
*/

class DbAdapterInterface
{
	constructor()
	{
		//allow it to be instantiated, this is against common design for interfaces
		//but will aid development
	}


	/**
	 * @return {Promise} - when the connection works
	*/
	connect(){ this._interfaceEnforcer('connect'); }

	/**
	 * @return void;
	*/
	onError(){ this._interfaceEnforcer('onError'); }
	/**
	 * @param {String} schemaName - The name of the database to change to
	 * @return {Promise}
	*/
	selectDb(schemaName){ this._interfaceEnforcer('selectDb'); }

	/**
	 * @return {Promise} - upon succession of the connection closing/
	*/
	disconnect(){ this._interfaceEnforcer('disconnect'); }

	/**
	 * @param {String} query - allow a query to execute. 
	 * @return {Promise}
	*/
	query(query){ this._interfaceEnforcer('query'); }

	/**
	 * @param {String} value - the value to escape.
	 * @return {String}
	 */
	escape(value){ this._interfaceEnforcer('escape'); }


	_interfaceEnforcer(functionName)
	{
		throw new Error("DbAdapterInterface::" + functionName + " is a member of an interface and needs implementing");
	}
}