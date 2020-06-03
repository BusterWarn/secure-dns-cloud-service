'use strict'

const fastify = require('fastify')({
  logger: true,
  https: false,
});

const options = {
  main_plugin_route: './plugins/udp_query',
  address: '0.0.0.0',
  ports: {
    query: -1,
    cache: -1,
    filter: -1,
    controller: -1,
  }
};

handleInputArguments(process.argv, options);
if (options.ports.query === -1) {
  throw new Error("Invalid port: " +  options.ports.query);
  process.exit(-1);
}

fastify.register(require(options.main_plugin_route));

fastify.listen(options.ports.query, options.address, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`Secure query API listening on ${address}`)
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
