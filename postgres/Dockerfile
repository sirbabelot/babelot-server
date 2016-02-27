# Dockerfile
FROM postgres

# File Author / Maintainer
MAINTAINER Dylan Harness

# Any *.sql or *.sh files in this dir will be run after
# postgres is running
COPY init_db.sql /docker-entrypoint-initdb.d/init_db.sql
