'use strict'

const http = require('http');

/**
 * 
 * @param {String} domain the url to filter
 * @return {Promise} 
 */
async function filterDomain(domain, options) {

  return {answer: options};
};

async function routes (fastify, options) {
  console.log('options:\n%s', options);
  fastify.get('/:params', options, async (request, reply) => {

    const domain = '64.227.73.7:' + options.ports.query;
    console.log('domain: ' + domain);
    const response = await queryHttpGet(domain, 'domain=' + request.query.domain);
    console.log('resp:\n');
    console.log(response);
    return response;
    return filterDomain(request.query.domain, options);
  })
}
//http://64.227.73.7:3000/?domain=google.com
/**
   * comment
   * @param {String[]} domainName wee
   * @param {int} id ID of query
   * @param {int} startTime starting time of tests in ms.
   */
  async function queryHttpGet(domain, query) {
    const url = 'http://' + domain + '/?' + query;
    const resp =  http.get(url, (resp) => {
      let data = '';
  
      // A chunk of data has been recieved.
      resp.on('data', (chunk) => {
        data += chunk;
      });
  
      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        const response = JSON.parse(data);
        console.log('queryHttpGet:\n');
        console.log(response);
        return response;
      });
    }).on('error', (err) => {
      console.log(err);
    });

    console.log('whaaat\n');
    console.log(resp);
  }

module.exports = routes
