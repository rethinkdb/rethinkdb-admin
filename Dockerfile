FROM node:gallium-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i

COPY . .
RUN npm run build

FROM node:gallium-alpine as release

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i --only=prod

COPY --from=build /app/build ./build

CMD ["npm", "start"]
EXPOSE 3000
