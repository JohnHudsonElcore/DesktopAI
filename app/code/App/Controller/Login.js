const ObjectPool = require('./../../ObjectPool');

const Controller = ObjectPool.getModel('core/controller');

class Login extends Controller
{

	IndexAction()
	{

		let POST = this.getPostData('http');

		if(POST['user[login]'] === 'dev.admin' && POST['user[password]'] === '')
		{
			this.getSession().set('logged-in' , true);
			this.getSession().set('user' , {
				userId: 0 ,
				username: 'dev.admin'
			});

			this.redirect('/');
		}

		this.loadLayout();

		this.getLayout().setTemplate('page/login.html');

		this.block('head').setData('title' , 'Login');


		
		this.renderLayout();
	}
	isProtectedPage()
	{
		return false;
	}
}

module.exports = Login;