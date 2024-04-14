FROM node:16.14.2 as build

ENV DOCKER_BUILDKIT 1

WORKDIR /app

COPY ./app/package.json /app/


RUN npm install -g npm@8.19.2 \
    && npm install

COPY --chown=1000:1000 ./app/ /app/

RUN npm run build

FROM nginx:1.23.3

RUN mkdir /etc/nginx/sites-available \
    && mkdir /etc/nginx/sites-enabled \
    && mkdir /usr/share/nginx/html/build \
    && rm /usr/share/nginx/html/index.html

COPY --from=build /app/build/ /usr/share/nginx/html/build/

COPY ./utils/nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./utils/nginx/my_nginx.conf /etc/nginx/sites-available/

COPY ./ssl_certificates/laytext.pem /etc/nginx/ssl/laytext.pem
COPY ./ssl_certificates/laytext.key /etc/nginx/ssl/laytext.key

RUN ln -s /etc/nginx/sites-available/my_nginx.conf /etc/nginx/sites-enabled/

CMD ["nginx", "-g", "daemon off;"]
