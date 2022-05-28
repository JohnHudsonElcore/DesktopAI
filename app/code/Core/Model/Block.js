const fs = require('fs');
const { dirname } = require('path');

class Block
{
	/**
	 * @description - Blocks are Hierarchal Elements
	 */
	constructor()
	{
		this.id = '';
		this.template = '';
		
		this.parent = null;
		this.children = [];

		this.data = {};
	}

	/**
	 * @param {Block} parent - set the parent of the current block, this is usually only called from the Layout Builder.
	 * @return {Block} - this class allows chaining
	 */
	setParent( parent )	{ this.parent = parent;	return this; }

	/**
	 *  @return {Block|null} - returns the parent;
	 */
	getParent(){ return this.parent; }


	/**
	 * @param {String} id - the ID of the block your creating.
	 * @return {Block} this
	 */
	setId(id){ this.id = id; return this; }

	/**
	 * 	@return {String} id
	 */ 
	getId(){ return this.id; }


	/**
	 * @param {String} template - Relative to app/template/{{ASSIGNED_TEMPLATE}}
	 * @return {Block} this
	 */
	setTemplate(template){ this.template = template; return this; }

	/**
	 * @return {String} template;
	 */
	getTemplate(){ return this.template; }


	/** 
	 * @param {String} key - the key to assign the data.
	 * @param {Mixed} value - the actual object your assigning.
	 * @return {Block} this
	 */
	setData(key , value){ this.data[key] = value; return this; }

	/**
	 * @param {String} key - the key of the object your requesting
	 * @return {Mixed}
	 */
	getData(key){ return this.data[key]; }

	/**
	 * @param {Block} child - the child to add to this block.
	 * @return {Block} this
	 */
	addChild(child){ this.children.push(child); child.setParent(this); return this; }

	/**
	 * @param {String} id - the id of the block you're searching.
	 * @return {Block|false}
	 */
	getChild( id ){

		let out = false;

		this.children.some( ( child ) => {

			if( child.getId() === id )
			{
				out = child;
				return true;
			}

			if( child.getChild(id) )
			{
				out = child.getChild( id );
				return true;
			}

		} );

		return out;

	}

	/**
	 * @return {String} the HTML content to return.
	 */
	render() {

		let tpl = dirname(require.main.filename) + '/app/template/' + this.getTemplate();

		try{
			let template = fs.readFileSync(tpl , 'utf-8');

			return this._addInjections(template);

		}catch(e)
		{
			return '<p>Couldn\'t load template: ' + tpl + '</p>';
		}

	}
	/**
	 * @description - This is a very basic variable assignment function, 
	 * 				- Do not override this, this is going to be here forever!
	 * 
	 * @param {String} template - the raw HTML in which the modifications are being made.
	 * @return {String} template - the modified template.
	 */
	_addInjections(template)
	{
		for(let prop in this.data)
		{
			template = template.split('{{' + prop + '}}').join(this.data[prop]);
		}

		this.children.forEach( ( child ) => { 

			template = template.replace('{{' + child.getId() + '}}' , child.render());

		} );

		return template;
	}
}

module.exports = Block;