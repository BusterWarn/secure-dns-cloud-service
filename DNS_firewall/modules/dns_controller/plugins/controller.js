'use strict'

const controller = require('../models/controller.js')

async function routes(fastify, options) {

  fastify.get('/:params', options, async (request, reply) => {

    let response = {
      statusCode: 400,
      body: JSON.stringify('Missing parameter domain'),
      source: JSON.stringify('Controller'),
      timestamps: {
        start: Date.now(),
        end: 0,
        cachestart: 0,
        cacheend: 0,
        lookupstart: 0,
        lookupend: 0,
        filterstart: 0,
        filterend: 0,
      }
    };

    if (!request.query.domain) {
      reply
        .code(400)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(response);
      return;
    }

    let domain = request.query.domain;

    response.timestamps.cachestart = Date.now();
    const cacheResponse = await controller.get(options.ports.cache, request.query);
    response.timestamps.cacheend = Date.now();

    if (cacheResponse.length !== 0 && false) {
      response.timestamps.end = Date.now();
      response.statusCode = 200;
      response.source = 'received from cache';
      response.body = cacheResponse;
      reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(response);
      return;
    }
    
    response.timestamps.lookupstart = Date.now();
    const lookupResponse =
      await controller.get(options.ports.query, request.query);
    response.timestamps.lookupend = Date.now();

    if (lookupResponse.error) {
      response.statusCode = 400;
      response.source = 'external lookup';
      response.body = 'could not find address';
      reply
        .code(400)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(response);
      return;
    }

    response.timestamps.filterstart = Date.now();
    const filterResponse = await
      controller.get(options.ports.filter, { ip: lookupResponse.addresses[0] });
    response.timestamps.filterend = Date.now();

    if (filterResponse.reputation <= 20) {
      response.statusCode = 200;
      response.source = 'External filter';
      response.body = 'Unsafe address' + request.query.domain +
        ' with reputation: ' + filterResponse.reputation;
      response.timestamps.end = Date.now();
      reply
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(response);
      return;
    }

    response.statusCode = 200;
    response.body = filterResponse;
    response.timestamps.end = Date.now();

    reply
      .code(200)
      .header('Content-Type', 'application/json; charset=utf-8')
      .send(response);
    
    controller.post(options.ports.cache, {
      domain: request.query.domain,
      ip: filterResponse.ip,
      expire: Date.now() + 1000 * 60 * 60 * 2,
    });
  });




}

module.exports = routes
