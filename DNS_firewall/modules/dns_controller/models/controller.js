'use strict';

const http = require('http');
const querystring = require('querystring');

async function httpRequest(options) {
    return new Promise((resolve, reject) => {

        const req = http.request(options, (resp) => {
            let data = '';
            resp.on('data', (chunk) => {
                data += chunk;
            });
            resp.on('end', () => {
                resolve(JSON.parse(data));
            });

        }).on("error", (err) => {
            reject(err);
        });
        req.on('error', (e) => {
            reject(e.message);
        });
        // send the request
        req.end();
    });
}

exports.get = async (port, payload) => {
    return httpRequest({
        host: '0.0.0.0',
        port: port,
        path: '/?' + querystring.stringify(payload),
        method: 'GET'
    });
}


exports.post = async (port, payload) => {
    console.log('\n Doing a requesty req\n');
    return httpRequest({
        host: '0.0.0.0',
        port: port,
        path: '/?' + querystring.stringify(payload),
        method: 'POST'
    });
}
