const ObjectPool = require('./../../ObjectPool');

const Controller = ObjectPool.getModel('core/controller');
const User = ObjectPool.getModel('security/user');
const Session = ObjectPool.getModel('core/session');

class Login extends Controller
{

	IndexAction()
	{

		let POST = this.getPostData('http');

		if(this.getRequest().method == 'POST')
		{
			let username = POST['user[login]'];
			let password = POST['user[password]'];

			let user = User.login(username , password)

			if(user.logged_in)
			{
				let session = this.getSession();

				session.set('logged-in' , true);
				session.set('user-id' , user.user.getId());

				this.redirect('/');
			}
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