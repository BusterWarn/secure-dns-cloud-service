'use strict'

/**
 * 
 * @param {String} domain the url to filter
 * @return {Promise} 
 */
async function filterDomain(domain) {

    return {answer: null};
};

async function routes (fastify, options) {
  fastify.get('/:params', options, async (request, reply) => {
    return filterDomain(request.query.domain);
  })
}

module.exports = routes
