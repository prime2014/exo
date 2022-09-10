#!/bin/bash

# The following script delays django container until the postgres database is initialised


load="true"



check_database(){

    scan=`pg_isready -d ${POSTGRES_DB} -h ${POSTGRES_HOST} -p ${POSTGRES_PORT} -U ${POSTGRES_USER} 1>/dev/null`

    while [ "$?" -ne 0 ]
    do
        echo "Waiting for database to initialize..."
        sleep 4
    done
    return
}

check_database

exec "$@"
