

const AWS = require('aws-sdk');
const fs = require('fs');
const readline = require('readline');
const spawnSync = require('child_process').spawnSync;

const filename = process.argv[2];
if (!filename) {
  console.error('No filname argument, quitting.');
  process.exit(-1);
}

const getAmazonLogs = process.argv[3];
if (getAmazonLogs === '-getlogs=ture') {
  getAmazonLogs = true;
}

/**
 * Fuck you
 * @param{String} filename The name of the file
 */
async function main(filename) {

  console.log(filename);
  const fileStream = fs.createReadStream(filename);
  const cloudWatchLogs = new AWS.CloudWatchLogs({
    region: 'eu-north-1',
    accessKeyId: 'AKIAJUS4FM6BFJPWRRSQ',
    secretAccessKey: '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',
  });
  if (false) {
    getCloudWatchLog(cloudWatchLogs, null);
    return;
  }

  let nrQuery = 0;
  let querySucc = 0;
  let queryFail = 0;
  let responseTime = 0;
  let longestTime = 0;
  let firstTime = 0;
  let latestTime = 0;

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    // console.log(nrQuery);
    const query = JSON.parse(line);
    nrQuery++;
    if (parseInt(query.statusCode) === 200) {
      querySucc++;

      /* Why tho?
      if (query.timestamps.start && query.timestamps.end) {
        if (query.timestamps.start < firstTime || firstTime === 0) {
          firstTime = query.timestamps.start;
        }

        if (query.timestamps.end > latestTime) {
          latestTime = query.timestamps.end;
        }
      }
      */

      if (query.body.responseTime) {
        responseTime += query.body.responseTime;
      } else if (query.timestamps) {
        if (query.timestamps.end - query.timestamps.start > longestTime) {
          longestTime = query.timestamps.end - query.timestamps.start;
        }
        responseTime += query.timestamps.end - query.timestamps.start;
      }
    } else if (query.statusCode === undefined && query.responseTime >= 0) {
      responseTime += query.responseTime;
      querySucc++;
    } else {
      // console.log(nrQuery);
      queryFail++;
    }
    if (query.contexts) {
      for (let i = 0; i < query.contexts.length; i++) {
        getCloudWatchLog(cloudWatchLogs, query.contexts[3]);
        break;
      }
    }
  }
  console.log('Nr queries:\t\t%d.\nSucceded queries:\t%d\nFailed queries:\t\t' +
    '%d\nAvg. Time:\t\t%d', nrQuery, querySucc, queryFail,
  responseTime / querySucc);
}

/**
 * TODO
 * @param {*} cloudWatchLogs TODO
 * @param {*} param TODO
 */
async function getCloudWatchLog(cloudWatchLogs, context) {
  
  console.log(context.awsRequestId);
  const params = {
    startTime: 1577833200000, // 2020-01-01
    endTime: Date.now(),
    logGroupName: context.logGroupName,
    logStreamNames: [context.logStreamName],
    filterPattern: ' report=*REPORT*,..., max_memory_used_value, mem_unit',
  };
  cloudWatchLogs.filterLogEvents(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log(data);
      if (data.events && false) {
        for (let i = 0; i < data.events.length; i++) {
          if (data.events[i].message.startsWith('REPORT')) {
            console.log(data.events[i].message);
          }
        }
      }
    }
  });
}

main(filename);


  /*
  if (getAmazonLogs) {

    const min = 1000 * 60 * 60;
    const hour = min * 60;

    let nrQuery = 0;
    let duration = 0;
    let billed_duration = 0;
    let mem_size = 0;
    let max_memory_used = 0;

    console.log('FirstTime: %d, lastTime: %d', firstTime, latestTime);
    services = [
      'dns_udp_query',
      'dns_caching',
      'dns_tls_query',
      'secure_dns_service',
      'dns_security_filter',
    ];
    const logStartTime = firstTime - 0 * hour - min;
    const logEndTime = latestTime - 0 * hour + min;
    for (let i = 0; i < services.length; i++) {
      const logname = Date.now() + services[i] + '.log';
      const pyhtargs = [
        'print_log_events.py',
        '/aws/lambda/' + services[i],
        '--start=' + logStartTime,
        '--end=' + logEndTime,
      ];
      const pythonProcess = spawnSync('python3', pyhtargs);
      const lines = pythonProcess.stdout.toString().split('\n');

      for (let j = 0; j < lines.length; j++) {
        if (lines[j].startsWith('REPORT')) {
          let line = lines[j];
          line = line.replace(/^.{65}/, '{"duration":');
          line = line.replace(/ ms.{18}/, ',"billed_duration":');
          line = line.replace(/ ms	Memory Size: /, ',"mem_size":');
          line = line.replace(/ MB	Max Memory Used: /, ',"max_memory_used":');
          line = line.replace(/ MB/, '}');
          line = line.replace(/}., '}');

          if (line.duration < 3000) {
            console.log(line);
            nrQuery++;
            duration += line.duration;
            billed_duration += line.billed_duration;
            mem_size += line.mem_size;
            max_memory_used += line.max_memory_used;
          }
        }
      }
    }
    console.log('\nQueries: %d\nDuration %d\nBilled duration: %d' +
      '\nMemory used: %d\nMax memory used: %d\n', nrQuery, duration,
      billed_duration, mem_size, max_memory_used );
  }
  */