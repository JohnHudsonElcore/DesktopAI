const fs = require('fs');
const { dirname } = require('path');
const path = require('path');
const https = require('https');

class DependencyManager
{
	static isDev = false;

	constructor(installDir)
	{
		this.installDir = installDir;
	}
	downloadDependency({folder , url})
	{
		try{
			fs.mkdirSync(this.installDir + '/' + folder)
		}catch(e)
		{
			throw new Error("Couldnt create dependency directory: " + this.installDir + '/' + folder);
		}

		let task = new DownloadTask(folder , url , this.installDir);

		return task;
	}
}

class DownloadTask
{
	//when dev is active, 
	//this gets the dependencies from
	//a folder. tmp.


	static devMap = [
		['https://elcore.co.uk/desktopai/dependencies/mysql.zip' , '/tmp/mysql.zip']
	];
	constructor(folder , url , installDir)
	{
		this.folder = folder;
		this.installDir = installDir;
		this.url = url;

		this._update = [];
		this._complete = [];
		this._installed = [];
	}
	onUpdate(call)
	{
		this._update.push(call);
		return this;
	}
	onComplete(call)
	{
		this._complete.push(call);
	}
	onInstall(call)
	{
		this._installed.push(call);
	}
	start()
	{
		
		this.download().then((filePath) => {
			this.install(filePath).catch((err) => {
				throw new Error(err);
			}).then(() => {
				this._installed.forEach((call) => call());
			});
		});
		
	}
	install(filePath)
	{
		let fullPath = this.installDir + '/' + this.folder;

		return new Promise( async(resolve , reject) => {
			let extract = require('extract-zip');

			try{
				await extract(filePath , {
					dir: dirname(fullPath)
				});
				resolve();
			}catch(e)
			{
				reject(e);
			}
		});
	}
	download()
	{
		return new Promise((resolve , reject) => {
			if(DependencyManager.isDev)
			{
				this._update.forEach( ( call ) => call(0 , 100) );

				setTimeout( () => {
					this._update.forEach( ( call ) => call(25 , 100) );
				} , 500);

				setTimeout( () => {
					this._update.forEach( ( call ) => call(50 , 100) );
				} , 1000);
				setTimeout( () => {
					this._update.forEach( ( call ) => call(75 , 100) );
				} , 1500);
				setTimeout( () => {
					this._update.forEach( ( call ) => call(100 , 100) );
				} , 2000);

				setTimeout( () => {
					try{
						this._complete.forEach( ( call ) => call() );
					}catch(r)
					{

					}
					resolve(this.installDir + '/tmp/mysql.zip');
				} , 2500);
				
			}else{
				let file = fs.createWriteStream(this.installDir + '/tmp/' + path.basename(this.url));

				const request = https.get(this.url, (response) => {
				   response.pipe(file);

				   // after download completed close filestream
				   file.on("finish", () => {
				       file.close();
				       resolve(this.installDir + '/tmp/' + path.basename(this.url));

				       this._complete.forEach((call) => call());

				   });
				   let totalBytes = 0;
				   response.on('data' , (chunk) => {
				   		totalBytes += chunk.length;
				   		this._update.forEach((call) => call(totalBytes , '?'));
				   });
				   file.on('error' , (e) => {
				   		reject(e);
				   })
				});
				
			}
		});
	}
}
module.exports = DependencyManager;