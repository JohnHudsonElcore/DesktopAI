const ObjectPool = require('./../../ObjectPool');

const Controller = ObjectPool.getModel('core/controller');

class NavigationAPI extends Controller
{
	IndexAction()
	{
		this.getMenuAdapter().then((results) => {

			this.getResponse().end(JSON.stringify(results));

		});
	}

	/**
	 * @return {Promise} - returns a list of results.
	 * - Also a Promise, to allow changes on production and live environments.
	 * @description - Use User permissions to check what a user can access.
	*/

	getMenuAdapter()
	{
		return new Promise((resolve , reject) => {

			let items = [
				{"icon": "fas fa-tachometer-alt" , "label": "Home" , "href": "/"} , 
				{"icon": "fas fa-bugs" , "label": "Errors" , "href": "/app/bugs/list"}
			];


			resolve(items);

		});
	}
}

module.exports = NavigationAPI;