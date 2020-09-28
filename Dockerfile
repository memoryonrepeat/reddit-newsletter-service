FROM node:alpine

WORKDIR /srv/newsletter

COPY package*.json ./

RUN npm install

COPY . /srv/newsletter

EXPOSE 8081

CMD ["npm", "run", "start"]
