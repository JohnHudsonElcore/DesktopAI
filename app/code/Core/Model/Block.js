
class Block
{
	constructor()
	{
		this.id = '';
		this.template = '';
		
		this.parent = null;
		this.children = [];

		this.data = {};
	}
	setParent( parent )	{ this.parent = parent;	return this; }
	getParent(){ return this.parent; }

	setId(id){ this.id = id; return this; }
	getId(){ return this.id; }

	setTemplate(template){ this.template = template; return this; }
	getTemplate(){ return this.template; }

	setData(key , value){ this.data[key] = value; return this; }
	getData(key){ return this.data[key]; }

	addChild(child){ this.children.push(child); child.setParent(this); return this; }
}

module.exports = Block;