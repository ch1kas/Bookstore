# Dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run test  # Run tests
RUN npm run build

CMD ["npm", "run", "start:prod"]

EXPOSE 3000