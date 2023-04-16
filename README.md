# noteflow-backend

## Description
> NTU-IM SDM project

## development tools
### Database
1. postgresql
2. redis
3. mongodb

### backend
1. koa

### Tools
1. docker
2. postman
3. pgadmin4
4. vscode

## How to build up project
1. redis
    ```bash
    ## docker 版的 redis 常常會有連線不順的問題，所以在 docker compose 完後，需要運行另一個腳本：
    ## 1. 先將一般的資料庫起起來
    docker compose --env-file ./config/.env.development up -d
    ## 2. 運行 local 的 redis-server，如果沒有 redis-server 可以 brew install redis
    chmod 777 ./redis/run_redis_local.sh
    ./redis/run_redis_local.sh
    ```
2. database
    ```bash
    # migrate
    npm run db:migrate

    # seed
    npm run db:seed

    # rollback
    npm run db:rollback
    ```
3. node.js
    ```bash
    npm run start
    ```
4. docker with environment
    ```bash
    docker compose --env-file ./config/.env.development up -d
    # 可以使用 docker compose down 關閉
    docker compose --env-file ./config/.env.development down
    ```
## environment
### local, development
1. host
    > localhost
2. port
    | port  | services       |
    | ----- | -------------- |
    | 3000  | node.js        |
    | 27017 | mongo          |
    | 8081  | mongo express  |
    | 5432  | postgresql     |
    | 6379  | redis          |
    | 6380  | redis(session) |

### production
#TODO

## Documentation
| No  | docs              | location                                             |
| --- | ----------------- | ---------------------------------------------------- |
| 1   | API doc           | localhost:3000/swagger                               |
| 2   | project structure | [project structure](/markdowns/project_structure.md) |
| 3   | backend notes     | [backend notes](/markdowns/backend_notes.md)         |
