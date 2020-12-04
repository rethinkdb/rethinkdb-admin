FROM node:alpine as build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm i

COPY . .
RUN npm run build

FROM node:alpine as release

COPY package.json package-lock.json ./
RUN npm i --only=prod
COPY --from=build /app/build ./build

CMD ["npm", "start"]
EXPOSE 3000
