FROM node:20-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --output-path=dist/frontend --base-href=/

FROM node:20-alpine as serve
WORKDIR /app

RUN adduser --disabled-password --home /app --gecos '' appuser && chown -R appuser /app

COPY --from=build /app/dist/frontend/browser ./

RUN npm install -g http-server

EXPOSE 80

USER appuser

CMD [ "http-server", "-p", "80", "." ]