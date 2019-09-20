# Koa Example Server

A Postgres backed Chat example with Websockets and Koa. All enterprisy things are considered.

### Features

- [x] Koa Endpoints
- [x] Postgres
- [x] IOC
- [x] Testscontainers
- [x] Socket.io
- [x] Log4JS
- [x] Request Validation
- [x] Request Ids
- [x] Containerization
- [ ] Autogenerated API Documentation
- [ ] Dedicated Management Port
- [ ] Prometheus
- [ ] Health and Readiness
- [ ] Some Frontend
- [ ] External Apis

### Commands

`npm run build` build app into `./dist` folder  
`npm run dependencies` start all dependencies and print environment variables needed for `npm start`  
`npm start` start a local server  
`npm run start:watch` start a local server with hot reloading  
`npm run fmt` formatter  
`npm run lint` linter  
`npm run unit` unit tests  
`npm run unit:watch` unit tests with hot reloading  
`npm run integration` integration tests (against dependencies aka system tests)  
`npm run integration:watch` integration tests with hot reloading  
`npm run containerize` builds a docker container and tags it as `koa-example:latest`
