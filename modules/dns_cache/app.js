'use strict'

const options = {
  main_plugin_route: './plugins/cache',
  address: '0.0.0.0',
  port: 3051,
};

const externalPorts = {
  query: 3050,
  cache: 3051,
  filter: 3052,
}

const fastify = require('fastify')({
  logger: true
});

fastify.register(require(options.main_plugin_route));

fastify.listen(options.port, options.address, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
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

    if (argv[i].startsWith('-port=')) {
      option = argv[i].substring('-port='.length);
      if (!option || isNaN(option))
        fastify.log.info('argument port must be a valid port');
      else
        options.server = option;
    } else if (argv[i].startsWith('-host=local')) {
      options.address = '192.168.1.80';
    } else if (argv[i].startsWith('-host=ipv4')) {
      options.address = '0.0.0.0';
    }
  }
  return true;
}