
## Description

Battleship backend

## Installation
Use node version >= 16

```bash
$ npm install
```

## Setup

Ensure postgres is running, then go into app.module and change the username/password/etc.

In order to change encryption settings, go to src/modules/user/util/encryption.util.ts to adjust hardcoded keys.

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Postman collection

Use the postman collection to interact with the service.
