FROM node:stretch-slim

WORKDIR /usr/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 50052

RUN npm run typeorm:run
RUN npm run build
COPY ./src/pb/*.proto ./dist/pb

CMD ["node", "start"]