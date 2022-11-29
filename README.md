# nestjs authenticaiton / ratelimiting sandbox

## Usage
```bash
docker-compose -f docker-compose.redis.yml -f docker-compose.yml up -d && open "http://localhost:3000"
```

### Logging in with CURL
```bash
# get jwt-token
curl -X POST http://localhost:3000/auth/login -d '{"username": "admin", "password": "pass"}' -H "Content-Type: application/json"

# get private
curl http://localhost:3000/private -H "Authorization: Bearer jwt-token-here"
```


## Architecture

### Service diagram

```mermaid
flowchart LR
    nextjs-api -- read/write ratelimiting counters --> redis[(redis)]

    style redis fill:#0672e6,color:white
    style nextjs-api fill:#ffe43e,color:black
```
### Sequence diagrams
#### Authentication

```mermaid
sequenceDiagram
    client ->> nextjs-api: "POST /auth/login"
    nextjs-api ->> auth.service:"login"
    auth.service ->> users.service: "findOne"
    nextjs-api -->> client: "JWT token, 1h TTL"
    client ->> nextjs-api: "POST /private with JWT token"    
```
#### Public endpoint ratelimiting

```mermaid
sequenceDiagram
    client ->> nextjs-api: "GET /"
    nextjs-api -->> ip-rate.guard: "Use config from env vars or config file"
    
    
    par
    ip-rate.guard -->> base-rate.guard: "3 x incrementHitsAtFixedWindow()"
        base-rate.guard -->> redis:"get {tokenType}-{windowName}-{ID}-{windowStart}"  
        base-rate.guard -->> redis:"set {tokenType}-{windowName}-{ID}-{windowStart}"  
    
    end
    
    ip-rate.guard -->> base-rate.guard: "3 x throwIfLimitExceeded"
    nextjs-api -->> public-controller:""
```


#### Private endpoint ratelimiting

```mermaid
sequenceDiagram
    client ->> nextjs-api: "GET /private"
    nextjs-api -->> token-rate.guard: "Use config from env vars or config file"
    
    par
        token-rate.guard -->> base-rate.guard: "3 x incrementHitsAtFixedWindow()"
        base-rate.guard -->> redis: "get & set"
    end
    
    token-rate.guard -->> base-rate.guard: "3 x throwIfLimitExceeded"
    nextjs-api -->> private-controller:""
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
