#!/bin/bash

# The following script delays django container until the postgres database is initialised


load="true"



check_database(){

    while [ "$load" == "true" ]
    do
        pg_isready -d ${POSTGRES_DB} -h ${POSTGRES_HOST} -p ${POSTGRES_PORT} -U ${POSTGRES_USER} 1>/dev/null

        if [ "$?" -ne 0 ]; then
            echo "Waiting for database to initialize..."
            sleep 4
        else
            break
        fi
    done
    return
}

check_database

exec "$@"
