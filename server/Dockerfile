# Step 1: Build frontend
FROM node:18 AS builder
WORKDIR /app
COPY ./client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Step 2: Build frontend
FROM node:22
WORKDIR /app

# Copy only package.json first (for better Docker cache + clean node_modules)
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy all frontend code (excluding node_modules, thanks to .dockerignore)
COPY . .

# Copy built React frontend into frontend
COPY --from=builder /app/client/build ./client/build

EXPOSE 8080

CMD ["node", "server.js"]
