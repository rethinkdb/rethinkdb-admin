FROM node:gallium-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:gallium-alpine as release

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps

COPY --from=build /app/build ./build

CMD ["npm", "start"]
EXPOSE 3000
