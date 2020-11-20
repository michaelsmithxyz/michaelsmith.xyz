FROM nginx:alpine

COPY dist/ /usr/share/nginx/html/
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80