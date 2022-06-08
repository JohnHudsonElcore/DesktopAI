const ObjectPool = require('./../../ObjectPool');

class PHPRuntime
{
	constructor(params = {})
	{
		this.initPHP(params);
	}
	initPHP({script , workingDir}){
		if(!workingDir)
		{
			workingDir = ObjectPool.Root()
		}
		if(!script)
		{
			throw new Error("No PHP Script assigned: use PHPRuntime::initPHP({script: \"\"})");
		}
	}
}

module.exports = PHPRuntime;