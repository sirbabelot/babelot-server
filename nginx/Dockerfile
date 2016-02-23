# Dockerfile
FROM nginx

# File Author / Maintainer
MAINTAINER Dylan Harness

# Copy custom configuration file from the current directory
COPY nginx.conf /etc/nginx/nginx.conf
ADD ssl /etc/nginx/ssl
RUN chown -R root:root /etc/nginx/ssl
RUN chmod -R 600 /etc/nginx/ssl

