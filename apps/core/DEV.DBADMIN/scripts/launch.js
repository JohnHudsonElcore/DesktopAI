class DB_VIEWER_LAUNCHER
{
	constructor({
		resource , 
		app
	})
	{
		this.resource = resource;
		this.app = app;
		this.db = resource.getSingleton('core/dbConnection');
		this.currentDb = 'desktop_ai';

		window.DbViewer = this;
	}
	
	
	onCreate()
	{
		
		this.domElement = document.createElement("div");

		document.querySelector(".content").appendChild(this.domElement);

		this.domElement.setAttribute("style" , "position:absolute;top:0px;left:0px;right:0px;bottom:0px;background:#222;");

		this.rootDbView();
	}

	showDb(dbName)
	{
		this.currentDb = dbName;
		this.rootDbView();
	}
	rootDbView()
	{
		let html = ``;

		html += this.buildTopBar([
			{ "label": "Tables" , "click": "DbViewer.rootDbView()" } , 
			{ "label": "SQL" , "click": "DbViewer.sqlInput()" } , 
			{ "label": "Actions" , "click": "DbViewer.dbActions()" }
		])
		html += this.getSidebar();
		html += this.getCss();

		html += `<div class="db-viewer-content">`;
		html += `<table class="db-viewer-tbl">
			<thead>
				<tr>
					<td>Table</td>
					<td>Engine</td>
					<td>Row Format</td>
					<td>Auto Increment</td>
					<td>Collation</td>
					<td>Created</td>
					<td>Temporary</td>
					<td>Actions</td>
				</tr>
			</thead>
			<tbody>`;

			let tables = this.db.query("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '" + this.currentDb + "'");

			tables.forEach( ( table ) => {
				html += `
					<tr>
						<td onclick="DbViewer.viewTable('${table.TABLE_NAME}');">${table.TABLE_NAME}</td>
						<td>${table.ENGINE}</td>
						<td>${table.ROW_FORMAT}</td>
						<td>${table.AUTO_INCREMENT}</td>
						<td>${table.TABLE_COLLATION}</td>
						<td>${table.CREATE_TIME}</td>
						<td>${table.TEMPORARY == 'N' ? 'No' : 'Yes'}</td>
						<td><button onclick="DbViewer.dropTable('${table.TABLE_NAME}');">Drop</button></td>
					</tr>
				`;
			});

		html += `</tbody></table>`;
		html += '</div>';

		this.domElement.innerHTML = html;
	}

	viewTable(table , database = false)
	{
		if(!database)
		{
			database = this.currentDb;
		}

		let html = ``;

		html += this.buildTopBar([
			{"label": "Browse" , "click": "DbViewer.viewTable('" + table + "')"} , 
			{"label": "Structure" , "click": "DbViewer.tableStructure('" + table + "')"} , 
			{"label": "SQL" , "click": "DbViewer.tableSql('" + table + "')"} , 
			{"label": "Insert" , "click": "DbViewer.insertTable('" + table + "')"} , 
			{"label": "Operations" , "click": "DbViewer.tableOperations('" + table + "')"}
		]);

		html += this.getSidebar() + this.getCss();

		html += '<div class="db-viewer-content">';

		let tbl = this.query(database , "SELECT * FROM " + table + " LIMIT 0 , 20" , {});

		if(tbl.length < 1)
		{
			html += '<p>No records in table</p>';
		}else{
			let cols = Object.keys(tbl[0]);

			html += '<table class="db-viewer-tbl"><thead><tr>';

			cols.forEach((column) => {
				html += '<td>' + column + '</td>';
			});

			html += '</tr></thead><tbody>';

			tbl.forEach((row) => {
				html += '<tr>';
				cols.forEach((col) => {
					html += '<td>' + row[col] + '</td>';
				});
				html += '</tr>';
			});

			html += '</tbody></table>';
		}

		html += '</div>';


		this.domElement.innerHTML = html;
	}





	dropTable(tableName , database = false)
	{
		if(!database)
		{
			database = this.currentDb;
		}
		this.query(database , 'DROP TABLE ' + tableName);
		this.rootDbView();
	}
	query(database , query , binds = {})
	{
		this.db.changeDbOneQuery(database);

		return this.db.query(query , binds);
	}
	getCss()
	{
		return `<style>
			.db-viewer-sidebar{
				position:absolute;top:0px;left:0px;width:250px;bottom:0px;background:#111;
				color:#fff;
				list-style-type:none;
			}
			.db-viewer-sidebar > h1{
				margin:0px;
				color:#fff;
				font-family:'Sengoa',sans-serif;
				height:60px;
				line-height:60px;
				text-align:center;
			}
			.db-viewer-sidebar > li{
				width:100%;
				height:40px;
				line-height:40px;
				text-indent:15px;
				font-size:13px;
				cursor:pointer;
				font-family:monospace;
			}
			.db-viewer-sidebar > li:hover{
				text-decoration:underline;
				background:rgba(255 , 255 , 255 , 0.1);
			}
			.db-viewer-sidebar > li.active{
				background:#6503ab;
			}
			.db-viewer-appbar
			{
				position:absolute;top:0px;left:250px;right:0px;height:50px;background:linear-gradient(155deg, rgba(42,0,57,1) 0%, rgba(97,1,110,1) 100%);list-style-type:none;
			}
			.db-viewer-appbar li{
				display:inline-grid;
				padding-left:15px;
				padding-right:15px;
				height:50px;
				line-height:50px;
				text-align:center;
				color:#fff;
				font-family:sans-serif;
				border-left:1px solid #c9c9c92b;
				border-right:1px solid #c9c9c92b;
				cursor:pointer;
			}
			.db-viewer-appbar > li:nth-child(1)
			{
				border:0px;
			}
			.db-viewer-appbar > li:nth-last-child(1)
			{
				border:0px;
			}
			.db-viewer-content{
				position:absolute;top:50px;left:250px;right:0px;bottom:0px;padding:30px;overflow:scroll;
			}
			.db-viewer-tbl{
				border-collapse:collapse;width:100%;
			}
			.db-viewer-tbl td{
				padding:10px;
				color:#fff;
				font-family:sans-serif;
				font-size:12px;
				text-align:center;
				cursor:pointer;
				
			}
			.db-viewer-tbl thead td{
				background:rgba(0 , 0 , 0 , 0.3);
			}
		</style>`;
	}
	buildTopBar(actions)
	{
		let html = `<div class="db-viewer-appbar">`;

		actions.forEach((action) => {
			html += '<li onclick="' + action.click + '">' + action.label + '</li>';
		})

		return html + '</div>';
	}
	getSidebar()
	{
		let out = `<div class="db-viewer-sidebar"><h1>DB</h1>`;

		this.db.query("SHOW DATABASES").forEach((result) => {
			if(result.Database === this.currentDb){
				out += '<li class="active" onclick="DbViewer.showDb(\'' + result.Database + '\')">' + result.Database + '</li>';
			}else{
				out += '<li onclick="DbViewer.showDb(\'' + result.Database + '\')">' + result.Database + '</li>';
			}
		});

		out += '</div>';
		return out;
	}
}
module.exports = DB_VIEWER_LAUNCHER;