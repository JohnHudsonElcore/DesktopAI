
class CommandListenService
{
	constructor({app,resource})
	{
		this.objpool = resource;
		this.app = app;
		this.db = this.objpool.getSingleton('core/dbConnection');

		this.db.query(`CREATE TABLE IF NOT EXISTS keyword_simplifier (
			keyword_id INT(11) NOT NULL AUTO_INCREMENT , 
			parent_id INT(11) NULL , 
			keyword VARCHAR(80) NOT NULL UNIQUE , 
			PRIMARY KEY(keyword_id)
		)`);
		this.db.query(`CREATE TABLE IF NOT EXISTS ai_datatype (
			datatype_id INT(11) NOT NULL AUTO_INCREMENT , 
			datatype VARCHAR(100) NOT NULL UNIQUE , 
			parent_datatype INT(11) NULL , 
			PRIMARY KEY(datatype_id)
		)`);

		let container = document.querySelector(".titlebar");

		let d = document.createElement("div");
		this.domElement = d;
		window.CommandProcessor = this;
		d.innerHTML = `<input type="text" style="width:100%;height:100%;background:rgba(0 , 0 , 0 , 0.3);border:0px;outline:0px;text-indent:20px;color:#fff;"/>`
		d.setAttribute("style" , "position:absolute;top:0px;left:206px;width:400px;height:50px;z-index:99999;-webkit-app-region: no-drag;");
		d.onclick = () => {
			d.querySelector("input").focus();
		}
		container.appendChild(d);

		let inp = d.querySelector("input");

		inp.oninput = () => {
			if(inp.value.length > 0)
			{
				this.showCodePreview(inp.value);
			}else{
				this.hideCodePreview();
			}
		}
	}
	showCodePreview(command)
	{
		if(!this.result)
		{
			this.result = document.createElement("div");
			this.result.setAttribute("style" , "position:absolute;top:50px;left:0px;right:0px;bottom:0px;background:#222;color:#fff;padding:20px;");
			document.body.appendChild(this.result);
		}
		this.result.style.display = 'inherit';

		this.result.textContent = this.processCommand(command);
	}
	processCommand(command)
	{
		return command;
	}
	hideCodePreview()
	{
		this.result.style.display = 'none';
	}

}
module.exports = CommandListenService;