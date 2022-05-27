const ObjectPool = require('./../../ObjectPool');

const Block = ObjectPool.getModel('core/block');

class Layout extends Block
{
	load(blocks)
	{
		this.buildTree(blocks , this);
	}
	buildTree(blockList , parent)
	{
		blockList.forEach( (_block) => {

			let block = null;

			if(_block.type)
			{
				let blockInst = ObjectPool.getBlock(_block.type);
				block = new blockInst();
			}else{
				let blockInst = ObjectPool.getModel('core/block');
				block = new blockInst();
			}

			block.setTemplate(_block.template);
			block.setId( _block.id );

			parent.addChild(block);

			if(_block.children && Array.isArray(_block.children))
			{
				this.buildTree(_block.children , block);
			}

		} );
	}
}

module.exports = Layout;