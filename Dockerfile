# Step 1: Build the app
FROM node:18-alpine AS build-stage

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the Vue 3 app for production
# RUN npm run build

# Step 2: Serve the app with a lightweight web server
FROM nginx:stable-alpine AS production-stage

# Copy built files from build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx config if you have one
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
