FROM node:14.8.0-alpine
RUN npm install -g latest-version
RUN mkdir -p /var/www/gateway
WORKDIR /var/www/gateway
ADD . /var/www/gateway
RUN npm install
CMD npm run build && npm run start:prod