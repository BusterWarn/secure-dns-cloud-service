/* eslint-disable camelcase */
/* eslint-disable curly */
/* eslint-disable linebreak-style */

const TIME = {
  second: 1000,
  minute: 60 * 1000,
  hour: 60 * 60 * 1000,
};

const servers = {
  google: '8.8.8.8',
  cloudfare: '1.1.1.1',
};

const options = {
  server: servers.cloudfare,
  // apiurl: 'https://tho7eirtv5.execute-api.eu-north-1.amazonaws.com/default/dns_udp_query',
  apiurl: 'http://64.227.73.7:4000',
  // apiurl: 'http://64.227.73.7:3000',
  // apiurl: 'https://0c1b7bowi9.execute-api.eu-north-1.amazonaws.com/default/secure_dns_service',
  dnsfile: 'alexa_no_time_outs.txt',
  debug: false,
  time: TIME.minute * 10,
  freq: 100,
  log: null,
};

const progress = {
  nrQueries: options.nrQueries,
  finQueries: 0,
  resQueries: 0,
  failQueries: 0,
  totTime: 0,
  avgTime: 0,
  startTime: undefined,
};

const {Resolver} = require('dns').promises;
const fs = require('fs');
const schedule = require('node-schedule');
const http = require('http');
const resolver = new Resolver();
resolver.setServers([servers.google]);

// Remove comment to log to file.
const logname = '2020-05-18_' + formatTime();
if (process.argv[2] && !isNaN(process.argv[2])) {
  options.log = process.argv[2] + 'ms';
  options.freq = parseInt(process.argv[2]);
  const access = fs.createWriteStream('/home/buster/Documents/git/dns-query-' +
    'tester/dns_query_test/res/DO_UDP' + options.log + '.log');
  process.stdout.write = access.write.bind(access);
}

const testData = parseData(options.dnsfile);

// check file reading
if (testData.length == 0) {
  console.error('no data found in fileName');
  process.exit(0);
} else {
  // console.log('found ' + testData.length + ' items in file');
}

/**
  * send 1000 https request to cloud service
  * @param {string[]} domainNames Domain names to DNS query.
  * @param {Object} options object containing runtime options.
  */
function cloudPerformanceOverTime(domainNames, options) {
  let domain = domainNames[Math.floor(Math.random() * Math.floor(domainNames.length))];

  options.date = Date.now();

  const freqBetweenQueries = 1000 / options.freq;
  const startTime = Date.now() + TIME.minute;
  const endTime = startTime + options.time;
  let time_since_last_query = freqBetweenQueries;
  let scheduledJobs = 0;
  let runJobs = 0;

  for (let i = startTime; i < endTime; i++) {
    if (time_since_last_query > freqBetweenQueries) {
      time_since_last_query -= freqBetweenQueries;
      scheduledJobs++;
      schedule.scheduleJob(i, function(domainNames, options, date, i) {
        if ((i - startTime) % 10000 === 1) {
          console.error('Starting job\t%s/%d ~%s%.\tSchedule vs Actual time ' +
            '\t%s - %s',
          runJobs.toString().padStart(scheduledJobs.toString().length, 0),
          scheduledJobs,
          Math.ceil(runJobs/scheduledJobs*100).toString().padStart(3, 0),
          formatTime(i),
          formatTime());
        }
        domain = domainNames[Math.floor(Math.random() *
          Math.floor(domainNames.length))];
        queryHttpsGet(domain, i - startTime, i);
        runJobs++;
      }.bind(null, domainNames, options, dt, i));
    }
    time_since_last_query++;
  }
  console.error('%d jobs schedueled between %s - %s', scheduledJobs,
      formatTime(startTime), formatTime(endTime));
}

/**
   * comment
   * @param {String[]} domainName wee
   * @param {int} id ID of query
   * @param {int} startTime starting time of tests in ms.
   */
function queryHttpsGet(domainName, id, startTime) {
  const url = options.apiurl + '/?domain=' + domainName + '&id=' + id;
  http.get(url, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
      data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
      const response = JSON.parse(data);
      progress.finQueries++;
      progress.totTime += parseInt(response.responseTime);
      if (data.err) {
        progress.failQueries++;
      } else {
        progress.resQueries++;
      }
      console.log(data);
      if (progress.finQueries === options.nrQueries) {
        console.error('Finnished %d/%d tests.\nSucceded tests: %d\nFailed tests: %d\nAverage time: %d ms\nTotal time: %d ms / %s\n',
            progress.finQueries, options.nrQueries, progress.resQueries, progress.failQueries, progress.totTime / progress.finQueries, Date.now() - startTime, formatTime(Date.now() - startTime));
      }
    });
  }).on('error', (err) => {
    console.log('\t"Error": ' + err + ',');
  });
}

/**
   * Parse every line of a file and makes it an element of an array.
   * @param {string} filename The filename.
   * @return {string[]} array with hostnames.
   */
function parseData(filename) {
  const fs = require('fs');
  const queryArray = [];

  try {
    // read contents of the file
    const data = fs.readFileSync(filename, 'UTF-8');
    // split the contents by new line
    const lines = data.split(/\r?\n/);
    // add line to array
    lines.forEach((line) => {
      queryArray.push(line);
    });
  } catch (err) {
    console.error(err);
  }
  return queryArray;
}

/**
   * Formats a time as a string in format hh:mm:ss.
   * @param {int} time The time to format in ms.
   * @return {String} The time in string format.
   */
function formatTime(time = Date.now()) {
  dt = new Date(time);
  return (`${
    (dt.getHours() - 1).toString().padStart(2, '0')}:${
    dt.getMinutes().toString().padStart(2, '0')}:${
    dt.getSeconds().toString().padStart(2, '0')}`
  );
}

cloudPerformanceOverTime(testData, options);
