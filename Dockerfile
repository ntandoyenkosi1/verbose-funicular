FROM node:22-alpine AS build-stage
WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm run install-all

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=build-stage /app/server ./server
COPY --from=build-stage /app/package.json ./package.json

RUN npm install --prefix server --production

EXPOSE 5000
CMD ["npm", "run", "start"]
