FROM node:current-slim

COPY package.json .

RUN npm install

RUN npm build

EXPOSE 3001

CMD [ "npm", "start" ]

COPY . . 