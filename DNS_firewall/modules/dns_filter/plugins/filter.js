'use strict'
'use strict'
const filter = require('../models/filter.js');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);


async function routes(fastify, options) {
  fastify.get('/:params', options, async (request, reply) => {

    if (!request.query.ip) {
      reply
        .code(400)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: 'Missing input IP' });
    }

    if (!options.filterApiUrl) {
      reply
        .code(500)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: 'No URL given to filter API.' });
    }
    
    if (isNaN(options.filterApiUrl)) {
      return filter.lookUp(request.query.ip, options.filterApiUrl);
    } else {
      return setTimeoutPromise(options.filterApiUrl, 'foobar').then((value) => {
        return {
          ip: request.query.ip,
          reputation: 100,
        }
      });
    }
  })
}

module.exports = routes
