const ObjectPool = require('./../../ObjectPool');

const Controller = ObjectPool.getModel('core/controller');

class Dashboard extends Controller
{

	IndexAction()
	{
		this.getResponse().end('<p>Welcome to the dashboard</p>');
	}
}

module.exports = Dashboard;