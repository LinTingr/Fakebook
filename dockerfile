FROM node:18.11.0

ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm install --production

CMD [ "node", "server.js" ]