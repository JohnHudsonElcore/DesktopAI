const ObjectPool = require('./../../ObjectPool');
const fs = require('fs');

class Collection
{
	constructor()
	{

	}
	getHiddenApplications()
	{
		return new Promise((resolve , reject) => {
			let out = [];

			this.getAllApplications().then(( apps ) => {
				apps.forEach(
					( app ) => {

						if(!app.drawer || app.drawer.visible === false)
						{
							out.push(app);
						}

					}
				);

				resolve( out )
			}).catch((err) => reject(err));
		});
	}
	getVisibleApplications()
	{
		return new Promise((resolve , reject) => {
			let out = [];

			this.getAllApplications().then(( apps ) => {
				apps.forEach(
					( app ) => {

						if(app.drawer && app.drawer.visible === true)
						{
							out.push(app);
						}

					}
				);

				resolve( out )
			}).catch((err) => reject(err));
		});
	}
	getAllApplications()
	{
		return new Promise( ( resolve , reject ) => {
			let out = [];

			fs.readdir( ObjectPool.Root() + '/apps/core' , ( err , coreApps ) => {
				if( err ) {
					reject(err);
					return;
				}

				coreApps.forEach( ( app ) => {
					let manifest = JSON.parse(
						fs.readFileSync(
							ObjectPool.Root() + '/apps/core/' + app + '/manifest.json' 
						, 'utf-8')
					);
					manifest.appType = 'core';
					manifest.basePath = ObjectPool.Root() + '/apps/core/' + app + '/';
					manifest.app = app;

					out.push(manifest);
				});

				fs.readdir(ObjectPool.Root() + '/apps/ext' , (err , extApps) => {
					if( err ) {
						reject(err);
						return;
					}
					extApps.forEach( ( app ) => {
						let manifest = JSON.parse(
							fs.readFileSync(
								ObjectPool.Root() + '/apps/ext/' + app + '/manifest.json' 
							, 'utf-8')
						);
						manifest.appType = 'userapp';
						manifest.basePath = ObjectPool.Root() + '/apps/ext/' + app + '/';
						manifest.app = app;

						out.push(manifest);
					});

					resolve(out);
				});
			})

		});
	}
}

module.exports = Collection;