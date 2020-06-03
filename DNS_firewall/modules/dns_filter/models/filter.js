'use strict';
/**
 * returns information if domain is considered safe.
 * @param {String} ip the ip of the url to check safety on
 * @return {JSON} information on the domain. body of JSON will be true
 * if domain is considered secure otherwise false
 */

const Curl = require('node-libcurl').Curl;
const curl = new Curl();

exports.handler = async (event) => {
    let response = {
        statusCode: 400,
        body: JSON.stringify('MISSING IP INPUT'),
    };

    if (!event.ip) {
        return response;
    }

    let repThreshold = 20;

    await lookUp(event.ip).then((data) => {
        response.statusCode = 200;
        let reputation = JSON.parse(data).reputation;
        if (reputation < repThreshold) {
            response.body = false
        } else {
            response.body = true;
        }
    }).catch((err) => {
        response.statusCode = 400;
        response.body = err;
    });
    return response;

};

/**
 * returns information if domain is considered safe.
 * @param {string} ip ip of the url to check safety on
 * @return {JSON} information on the domain from clavister risk scoring engine
 */
exports.lookUp = (ip, filterApiUrl) => {

    ip = ip.replace('"', '')
    ip = ip.replace('"', '');
    let data = "{\"ip\": \"" + ip + "\" }";

    curl.setOpt('FOLLOWLOCATION', true);
    curl.setOpt('DEFAULT_PROTOCOL', 'HTTPS')
    curl.setOpt('SSL_VERIFYPEER', false);
    curl.setOpt('URL', filterApiUrl);
    curl.setOpt('POSTFIELDS', data);

    return new Promise((resolve, reject) => {
        curl.perform()

        curl.on('end', function (statusCode, data, headers) {
            // console.info(statusCode);
            // console.info(data);
            // console.info('---');
            //this.close();
            curl.close.bind(curl);
            resolve(data);
        });

        curl.on('error', function (err) {
            // console.info(err);
            // curl.close.bind(curl);
            reject(err);
        });

    });
}
