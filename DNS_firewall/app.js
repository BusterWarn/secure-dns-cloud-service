'use strict';

const pm2 = require('pm2');
const getPort = require('get-port');
 
(async () => {
    const portController = await getPort({port: 3000});
    const portCache = await getPort({port: 3001});
    const portFilter = await getPort({port: 3002});
    const portQuery = await getPort({port: 3003});

    const nodeArgs = '-portquery=' + portQuery + ' -portcache=' + portCache +
        ' -portfilter=' + portFilter + ' -portcontroller=' + portController;

    pm2.start({
      apps: [{
        script: 'modules/dns_query/app.js',
        name: "secure_dns_query",
        autorestart: false,
        args: nodeArgs
      }, {
        script: 'modules/dns_filter/app.js',
        name: "secure_dns_filter",
        autorestart: false,
        args: nodeArgs
      }, {
        script: 'modules/dns_cache/app.js',
        name: "secure_dns_cache",
        autorestart: false,
        args: nodeArgs
      }, {
        script: 'modules/dns_controller/app.js',
        name: "secure_dns_controller",
        autorestart: false,
        args: nodeArgs
      }]
    }, (err, apps) => {
      pm2.disconnect();
      if (err) throw err;
      console.log('Applications started with following ports\n' +
      'secure_dns_controller: ' + portController + '\n' +
      'secure_dns_cache: ' + portCache + '\n' +
      'secure_dns_filter: ' + portFilter + '\n' +
      'secure_dns_query: ' + portQuery);
    });

})();
