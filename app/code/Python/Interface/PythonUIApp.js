
class PythonUIApp
{
	constructor()
	{
		this.ui = document.createElement('div');

		document.querySelector(".content").appendChild(this.ui);

		this.ui.setAttribute("style" , "position:absolute;top:0px;left:0px;right:0px;bottom:0px;background:#000;z-index:999999;");
	}
	/**
	 * @return {HTMLElement}
	*/
	getDomElement()
	{
		return this.ui;
	}

	/**
	 * @param {String|JSON Format} str - JSON string from Console.
	 */
	listenForUI(str)
	{
		try{
			let msg = JSON.parse(str);

			if(msg['message-type'])
			{
				if(msg['message-type'] === 'ViewComponent')
				{
					if(msg['isRoot']){
						this.rebuildUI(msg);
					}else{
						let node = this.ui.querySelector(msg.tagName + '#' + msg.id);

						this.rebuildUI(msg , node);
					}
				}
			}
		}catch(e)
		{
			console.log(e);
			console.error(str);
		}
	}
	/**
	 * @expected output
	 * {
			"message-type": "ViewComponent" , 
			"tagName": "div" , 
			"css": "position:absolute;top:0px;left:0px;width:0px;height:0px;color:#000000;background-color:transparent;background-image:unset;border-radius:unset;" , 
			"id": "" , 
			"children": [ 

			]
		}
	 */
	rebuildUI(obj , parent = false)
	{
		if ( !parent ) {
			parent = this.getDomElement()
		}

		let node = document.createElement(obj.tagName);
		node.setAttribute("style" , obj.css);
		node.id = obj.id;

		for(let attr in obj.attributes)
		{
			if(attr === 'textContent')
			{
				node.textContent = obj.attributes[attr];
			}else{
				node.setAttribute(attr , obj.attributes[attr]);
			}
		}

		parent.appendChild(node);
		console.log(obj , node);
		obj.children.forEach((child) => {
			this.rebuildUI(child , node);
		});
	}
	/**
	 * on app close
	 */
	onDestroy()
	{
		this.getDomElement().parentNode.removeChild(this.getDomElement());
	}
}
module.exports = PythonUIApp;