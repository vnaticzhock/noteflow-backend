#!/bin/bash
if [ "$(basename "$(pwd)")" = "redis" ]; then
    echo "Current folder is redis!"
else
    cd redis
fi

REDIS_PORT_=$(grep -E '^REDIS_PORT=[0-9]+$' ../config/.env.development | cut -d '=' -f 2)
REDIS_PID=$(lsof -t -i :${REDIS_PORT_})
if [ ${REDIS_PID} != "" ]; then
    echo "Something is currently working at ${REDIS_PORT_}, kill."
    kill ${REDIS_PID}
fi
redis-server --port ${REDIS_PORT_} --daemonize yes

REDIS_SESS_PORT_=$(grep -E '^REDIS_SESSION_PORT=[0-9]+$' ../config/.env.development | cut -d '=' -f 2)
REDIS_PID2=$(lsof -t -i :${REDIS_SESS_PORT_})
if [ ${REDIS_PID2} != "" ]; then
    echo "Something is currently working at ${REDIS_SESS_PORT_}, kill."
    kill ${REDIS_PID2}
fi
redis-server --port ${REDIS_SESS_PORT_} --daemonize yes

echo "Two servers are currently working at PID ${REDIS_PID} and ${REDIS_PID2}!"