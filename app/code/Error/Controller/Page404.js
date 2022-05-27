const ObjectPool = require('./../../ObjectPool');

const Controller = ObjectPool.getModel('core/controller');

class Page404 extends Controller
{

	execute(error)
	{
		this.getResponse().end('<h1>404 not found: ' + error + '</h1>');
	}
}

module.exports = Page404;