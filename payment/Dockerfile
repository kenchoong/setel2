FROM node:14.8.0-alpine
RUN npm install -g latest-version
RUN mkdir -p /var/www/payment
WORKDIR /var/www/payment
ADD . /var/www/payment
RUN npm install
CMD npm run build && npm run start:prod