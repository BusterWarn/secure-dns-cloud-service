'use strict'

/**
 * 
 * @param {String} domain the url to filter
 * @return {Promise} 
 */
async function cacheLookup(domain) {

    if (domain == google.com)
      return "216.58.211.142";
    else
      return -1;
};

async function routes (fastify, options) {
  fastify.get('/:params', options, async (request, reply) => {
    return filterDomain(request.query.domain);
  })
}

module.exports = routes
