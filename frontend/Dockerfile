# Stage 1: Build Angular App
FROM node:20-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --output-path=dist/frontend --base-href=/

# Stage 2: Serve via http-server (no NGINX)
FROM node:20-alpine as serve
WORKDIR /app
COPY --from=build /app/dist/frontend/browser ./
RUN npm install -g http-server
EXPOSE 80
CMD [ "http-server", "-p", "80", "." ]