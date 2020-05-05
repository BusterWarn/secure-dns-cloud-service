'use strict'

const {Resolver} = require('dns').promises;
const resolver = new Resolver();

/**
 * Creates an async DNS query using standard DNS protocol over UDP.
 * @param {String} domain the url to do DNS UDP lookup for
 * @param {int} id Id external request ID.
 * @return {Promise} Proimse containging IP address.
 */
async function queryUDP(domain, id = -1) {
    const startTime = Date.now();
    return resolver.resolve4(domain).then((address) => {
      const time = Date.now();
      const response = {
        domain: domain,
        externalId: id,
        responseTime: time - startTime,
        addresses: address,
      };
      return response;
    }).catch((err) => {
      const time = Date.now();
      const response = {
        domain: domain,
        externalId: id,
        responseTime: time - startTime,
        error: err,
    };
    return response;
  });
};

async function routes (fastify, options) {
  fastify.get('/:params', options, async (request, reply) => {
    return queryUDP(request.query.domain, request.query.id);
  })
}

module.exports = routes
