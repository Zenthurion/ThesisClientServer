FROM node:current-slim

COPY package.json .

RUN npm install

EXPOSE 3001

CMD [ "npm", "start" ]

COPY . . 
