## Usage
```bash
docker-compose -f docker-compose.redis.yml -f docker-compose.yml up
```

### Logging in with CURL
```bash
# get jwt-token
curl -X POST http://localhost:3000/auth/login -d '{"username": "admin", "password": "pass"}' -H "Content-Type: application/json"

# get private
curl http://localhost:3000/private -H "Authorization: Bearer jwt-token-here"
```

## Development

```bash
npm install
docker-compose -f docker-compose.redis.yml up -d
npm run start:dev
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Service code is [AGPL licensed](LICENSE).
