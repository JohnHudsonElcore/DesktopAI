const ObjectPool = require('./../../../ObjectPool');
const Configuration = ObjectPool.getModel('core/configuration');

/**
 * @description - anything that extends will be async. 
 *              - this class is responsible for basic 
 */

class DbModelInterface{


	constructor()
	{

		this.data = {};
		this.fields = {};
		this.primaryKey = '';
		try{
			this.install();
		}catch(e)
		{
			console.error('Installation failed: ' + e);
		}
		this._loadTableInfo();

		
	}

	/**
	 * @description - Loads the fields from the table.
	 * @table - being this.getTableName()
	 */
	_loadTableInfo()
	{
		let data = this.getConnection().query("DESCRIBE " + this.getTableName());

		this.fields = data;
		data.forEach( ( field ) => {

			if( field.Key === 'PRI' )
			{
				this.primaryKey = field.Field;
			}
			this.data[field.Field] = '';

			this.createSetGetHasUns(field.Field);

		} );
	}
	/**
	 * @return {Integer} insert_id - this returns the last insert id, use after save to get the current entity id
	 *                             - or call before save, to get the previous!
	 */
	lastInsertId()
	{
		return this.getConnection().query(`
			SELECT ${this.primaryKey} FROM ${this.getTableName()} ORDER BY ${this.primaryKey} DESC LIMIT 0 ,1 
		`)[0][this.primaryKey]; 
	}

	/**
	 * @use - this creates all the setters and getters for core fields!
	 * @param {String} attribute - attribute to uppercase.
	*/
	createSetGetHasUns(attr)
	{
		if(!attr)
		{
			return;
		}
		let methodized = ObjectPool.UppercaseWords(attr.split('_').join(' ')).split(' ').join('');

		this['get' + methodized] = () => { return this.data[attr]; }
		this['set' + methodized] = (value) => { this.data[attr] = value; return this; }
		this['has' + methodized] = () => { return typeof this.data[attr] !== "undefined"; }
		this['destroy' + methodized] = () => { delete this.data[attr]; return this; }

	}
	/**
	 * @param {Integer} id - load an entity by its Primary Key
	 * @return {DbModelInterface}
	*/
	load(id)
	{
		let res = this.getConnection().query(`
			SELECT * FROM ${this.getTableName()} WHERE ${this.primaryKey} = :id LIMIT 0,1
		` , {
			id: id
		});

		if(res.length < 1)
		{
			return this;
		}

		this.data = res[0];
		return this;
	}

	/**
	 * @param {String} column to query
	 * @param {String|Number} value to check against
	 * @return {DbModelInterface}
	*/
	loadBy(column , value)
	{
		let res = this.getConnection().query(`
			SELECT * FROM ${this.getTableName()} WHERE ${column} = :val LIMIT 0,1
		` , {
			val: value
		});

		if(res.length < 1)
		{
			return this;
		}

		this.data = res[0];
		return this;
	}

	/**
	 * @return {Integer} - the current entity id.
	*/
	getId()
	{
		return this.data[this.primaryKey];
	}

	/**
	 * @param {Number} id - the ID of this object. 
	*/
	setId(id)
	{
		this.data[this.primaryKey] = id;
		return this;
	}

	/**
	 * @description - if object has an existing ID, update, otherwise create new record and assign the insert id.
	 * @return {DbModelInterface}
	 */
	save()
	{
		let query = '';
		let type = 'update';
		if(this.data[this.primaryKey])
		{
			//update
			query += ' UPDATE ' + this.getTableName() + ' SET ';

			this.fields.forEach( ( field , idx ) => {

				if( idx > 0 ) query += ' , ';
				
				query += ` ${field.Field} = :${field.Field} `;

			} );

			query += ' WHERE ' + this.primaryKey + ' = ' + this.getId();
		}else{
			type = 'create';
			//create
			query = ` INSERT INTO ${this.getTableName()} ( `;

			this.fields.forEach( (field , idx) => {

				if( idx > 0 ) query += ' , ';

				query += ` ${field.Field} `;

			} );

			query += ' ) VALUES ( ';

			this.fields.forEach( (field , idx) => {

				if( idx > 0 ) query += ' , ';

				if(!this.data[field.Field])
				{
					this.data[field.Field] = field.Default;
				}

				query += ` :${field.Field} `;

			} );

			query += ' ) ';
		}

		let response = this.getConnection().query(query , this.data);

		if(type == 'create')
		{
			this.setId(this.lastInsertId());
		}
		console.log(response);
		return this;
	}

	getTableName(){
		throw new Error("DbModelInterface::getTableName is a member of an interface and needs implementing");
	}
	
	install(){
		throw new Error("DbModelInterface::install is a member of an interface and needs implementing");
	}

	getConnection()
	{
		return ObjectPool.getSingleton('core/dbConnection');
	}

}
module.exports = DbModelInterface;