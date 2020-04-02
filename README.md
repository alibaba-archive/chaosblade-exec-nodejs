# chaosblade-exec-nodejs

![GitHub](https://img.shields.io/github/license/chaosblade-io/chaosblade-exec-nodejs)
[![Build Status](https://travis-ci.org/chaosblade-io/chaosblade-exec-nodejs.svg?branch=master)](https://travis-ci.org/chaosblade-io/chaosblade-exec-nodejs)
[![codecov](https://codecov.io/gh/chaosblade-io/chaosblade-exec-nodejs/branch/master/graph/badge.svg)](https://codecov.io/gh/chaosblade-io/chaosblade-exec-nodejs)

Chaos engineering experiment injection tool for nodejs applications.

## chaosblade-exec-service
A http service that handles web console or cli communication compatible with the chaosblade specification.

### Installation

```
$ npm install chaosblade-exec-service --save
```

Node.js >= 10.16.0 required.

### Getting Started

Typescript Code:

```
import { ChaosbladeServer } from 'chaosblade-exec-service';

const server = new ChaosbladeServer();

// start server
await server.start();

// stop server
await server.stop();
```

#### Server Options
```
interface ServiceOptions {
  host?: string; // host to bind
  port?: number; // port to bind
  prefix?: string; // request path prefix
}
```
## Contributors

Please let us know how can we help. Do check out issues for bug reports or suggestions first.

To become a contributor, please follow our contributing guide.