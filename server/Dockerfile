# Use official Node 20 alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package.json ./

# Install dependencies fresh — no cache, no corruption
RUN npm install --no-cache

# Copy the rest of the server code
COPY . .

# Expose the port Railway injects
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
