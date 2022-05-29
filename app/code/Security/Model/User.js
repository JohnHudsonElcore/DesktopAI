const ObjectPool = require('./../../ObjectPool');

const DbModel = ObjectPool.getInterface('core/db_model');	
const bcrypt = require('bcrypt');

class User extends DbModel
{
	static login(username , password)
	{
		let u = new User();

		u.loadBy('username' , username);

		if(u.getId())
		{
			if(User.checkPassword(password , u.getPassword()))
			{
				return {
					logged_in: true , 
					user: u
				};
			}
			return {
				logged_in: false , 
				user: null
			}
		}
		return {
			logged_in: false , 
			user: null
		};
	}
	static checkPassword(password , hashed)
	{
		let data = bcrypt.compareSync(password , hashed);

		return data;
	}
	install()
	{
		this.getConnection()
			.query(`CREATE TABLE IF NOT EXISTS ${this.getTableName()} (
				user_id INT(11) NOT NULL AUTO_INCREMENT , 
				username VARCHAR(120) NOT NULL UNIQUE , 
				password VARCHAR(255) NOT NULL , 
				name VARCHAR(100) NOT NULL DEFAULT 'Unlabelled User' , 
				PRIMARY KEY(user_id)
			)`);
	}
	load(id)
	{
		super.load(id);
		if(this.getId()) this.passwordEncryped = true;
		return this;
	}
	loadBy(col , val)
	{
		super.loadBy(col , val);
		if(this.getId()) this.passwordEncryped = true;
		return this;
	}
	encryptPassword(str)
	{
		this.passwordEncryped = true;
		this.data.password = (bcrypt.hashSync(str , bcrypt.genSaltSync(10)));
		return this;
	}


	save()
	{
		try{
			if(this.passwordEncryped)
			{
				super.save();
			}else{
				this.encryptPassword(this.data.password);
				this.save();
			}
		}catch(a)
		{
			console.log(a);
		}
	}
	/**
	 * @return {String} user table name
	 */
	getTableName()
	{
		return "users";
	}

}
module.exports = User;