'use strict'

const cache = require('../models/domain_cache.js');

async function routes (fastify, options) {
  fastify.get('/:params', options, async (request, reply) => {
    if (!request.query.domain) {
      return cache.getDomains();
    }
    return cache.getIpByDomain(request.query.domain);
  });

  fastify.post('/:params', options, async (request, reply) => {
    if (!request.query.domain || !request.query.ip) {
      reply
        .code(400)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: 'Key domain or ip is missing.' });
    }
    const query = {
      _id: request.query.domain,
      ip: request.query.ip,
      expire: Date.now() + 1000 * 60 * 5,
    }
    return cache.addIp(query);
    
  });

  fastify.delete('/:params', options, async (request, reply) => {
    console.log(request.query.password);
    console.log(request.query.password);
    console.log(request.query.password);
    console.log(request.query.password);
    console.log(request.query.password);
    console.log(request.query.password);
    console.log(request.query.password);
    console.log(request.query.password);
    if (request.query.password !== 'truncate') {
      reply
        .code(400)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({ message: 'Wrong permission. Incorrect passwrod ' +
          request.query.password });
        return;
    }
    return cache.truncate();
    
  });
}

module.exports = routes
