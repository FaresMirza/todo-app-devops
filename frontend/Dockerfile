# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage 2: Production image
FROM nginx:alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
