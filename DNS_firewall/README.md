# DNS firewall

This DNS firewall is a prototype as part of a [bachelor thesis paper](https://www.umu.se/) by Buster Hultgren Wärn. It is built together with Tony Berglund.

# Installation

This service is only tested for Node.js verison `12.16.2` available [here](https://nodejs.org/en/download/) and npm version `6.14.5` available [here](https://www.npmjs.com/get-npm). It also uses pm2 `4.3.1` which is installed easily with
```bash
$ npm install pm2 -g
```

Clone or download the git repository. From this directory `secure-dns-cloud-service/DNS_firewall` run the following command to install npm packgages.

```bash
$ npm install
```

This will install all dependencies for all node modules.

# Running single API

Each API is start through its own subdirectory with 

```bash
$ node app.js [-portcontroller=<port>|-portquery=<port>|-portfilter=<port>|-portcontroller=<port>]
```

Each API needs its port to run. If starting the controller it needs the ports of every other API in order to communicate with these applications.

# Running all API's at once

Running every API at once is handled by pm2. `secure_dns_firewall/DNS_firwall/app.js` will start a pm2 instance of each API with deafult ports 3000-3003. If ports is already taken it will find another. To start all applications with this script simply run:

```bash
$ npm run start
```

To restart all applications run

```bash
$ npm run restart
```

To stop all applications run

```bash
$ npm run stop
```

This can be buggy at times and it might be simpler to delete all runnning instances of pm2 with

```bash
$ pm2 delete all
```

# Dependencies

The DNS Firewall uses multiple npm packages to run. It uses [fastify](https://www.fastify.io/) to create fast responding API's. To run the multiple services in the background it uses [pm2](https://pm2.keymetrics.io/).

