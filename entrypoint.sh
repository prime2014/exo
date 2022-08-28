#!/bin/bash

# The following script delays django container until the postgres database is initialised



check_database(){

    while [[ ! nc -zv ${POSTGRES_HOST} ${POSTGRES_PORT} ]]
    do
        echo "Waiting for database to initialize..."
        sleep 4
    done
    return
}

check_database

exec "$@"
