# build environment
FROM node:latest as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts -g --silent
COPY . ./
RUN npm run build

# production environment
FROM caddy:latest
COPY --from=build /app/build .
COPY ./Caddyfile .
CMD ["caddy", "run"]