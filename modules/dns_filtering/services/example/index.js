'use strict'

const cache = require('../plugins/cache.js');

module.exports = function (fastify, opts, next) {
  fastify.get('/example', function (request, reply) {
    reply.send(cache('google.com'))
  })

  next()
}

// If you prefer async/await, use the following
//
// module.exports = async function (fastify, opts) {
//   fastify.get('/example', async function (request, reply) {
//     return 'this is an example'
//   })
// }
