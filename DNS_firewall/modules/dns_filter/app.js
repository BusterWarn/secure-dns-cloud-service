'use strict'

const fs = require('fs');
const fastify = require('fastify')({
  logger: true,
  https: false,
});

const options = {
  main_plugin_route: './plugins/filter',
  filterApiUrl: null,
  address: '0.0.0.0',
  ports: {
    query: -1,
    cache: -1,
    filter: -1,
    controller: -1,
  }
};

try {
  options.filterApiUrl = fs.readFileSync(__dirname +  '/filter_api_url.hidden', "utf8");
  
  if (options.filterApiUrl.match(/^static<[0-9]{2}/)) {
    options.filterApiUrl = parseInt(options.filterApiUrl.substring(
      options.filterApiUrl.lastIndexOf('<') + 1,
      options.filterApiUrl.lastIndexOf('>')
    ));
  }
} catch (err) {
  throw err;
}

handleInputArguments(process.argv, options);

if (options.ports.filter === -1) {
  throw new Error("Invalid port: " + options.ports.filter);
  process.exit(-1);
}

fastify.register(require(options.main_plugin_route), options);

fastify.listen(options.ports.filter, options.address, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`Secure filter API listening on ${address}`)
});

/**
 * Handles user input.
 * @param {String[]} argv Array with user arguments.
 * @param {object} options The options that the program will run with.
 * @return {bool} false if invalid input, true if valid.
 */
function handleInputArguments(argv, options) {
  let option = '';

  for (let i = 2; i < argv.length; i++) {

    if (argv[i].match(/^-portquery=[0-9]{4}/)) {
      options.ports.query = parseInt(argv[i].substring('-portquery='.length));
    } else if (argv[i].match(/^-portfilter=[0-9]{4}/)) {
      options.ports.filter = parseInt(argv[i].substring('-portfilter='.length));
    } else if (argv[i].match(/^-portcache=[0-9]{4}/)) {
      options.ports.cache = parseInt(argv[i].substring('-portcache='.length));
    } else if (argv[i].match(/^-portcontroller=[0-9]{4}/)) {
      options.ports.controller = parseInt(argv[i].substring('-portcontroller='.length));
    }
  }
  return true;
}
