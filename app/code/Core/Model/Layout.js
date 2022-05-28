const ObjectPool = require('./../../ObjectPool');

const Block = ObjectPool.getModel('core/block');

class Layout extends Block
{
	/**
	 * @param {Array} blocks - the blocks to add to the layout.
	 * @see 'default.json' or whichever layout file used.
	 */
	load(blocks)
	{
		this.buildTree(blocks , this);
	}

	/**
	 * @param {Array} blockList - the collection of blocks to use.
	 * @param {Block} parent - this function creates a tree recursively, the parent can change as the function 
	 * 				  recursively iterates the JSON tree.
	 * @return void;
	 */
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