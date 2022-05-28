const ObjectPool = require('./../../ObjectPool');

const Controller = ObjectPool.getModel('core/controller');

class Dashboard extends Controller
{

	IndexAction()
	{
		this.loadLayout();

		this.block('head').setData('title' , 'Dashboard');
		
		this.renderLayout();
	}
	isProtectedPage()
	{
		return true;
	}
}

module.exports = Dashboard;