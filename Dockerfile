FROM --platform=linux/amd64 node:18-alpine3.15 

WORKDIR /home/app/support-app

COPY ./build ./

RUN npm install

CMD ["node", "server.js"]