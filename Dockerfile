FROM nginx:alpine

COPY src/ /usr/share/nginx/html/
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80