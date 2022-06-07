const ObjectPool = require('./../../ObjectPool');

class ModTool
{
	constructor(pyCode)
	{
		if ( typeof pyCode !== 'string' ) throw new Error('Supplied code is not a string');
		
		this.pyCode = pyCode;
	}
	/**
	 * @param {String} type - "import" etc..
	 * @param {String} pkg - "os,json,View" etc..
	 */
	addDependency({	type , pkg })
	{
		if(this.pyCode.indexOf(type + " " + pkg) > -1)
		{
			//do nothing
		}else{
			this.pyCode = type + " " + pkg + "\n" + this.pyCode;
		}
	}

	/**
	 * @param {String|Python} python code string to execute before the script.
	 */
	injectAtTop(pyCode)
	{
		if(this.pyCode.indexOf(pyCode) > -1)
		{
			//this will produce duplicates
			return;
		}
		let imports = this.pyCode.substring(0 , this.pyCode.indexOf("\n" , this.pyCode.lastIndexOf("import") ));

		let body = this.pyCode.substring(imports.length , this.pyCode.length);

		this.pyCode = imports + "\n" + pyCode + "\n" + body;
	}
	rewrite()
	{
		return this.pyCode;
	}
}
module.exports = ModTool;