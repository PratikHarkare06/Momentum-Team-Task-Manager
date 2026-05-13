# Use official Node 20 alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Force npm to use the official registry, not any Railway mirror
RUN npm config set registry https://registry.npmjs.org/

# Copy package files first
COPY package.json ./

# Install dependencies — force fresh from official registry
RUN npm install --prefer-online --no-cache

# Verify the mongodb version installed is correct
RUN node -e "console.log('mongodb:', require('./node_modules/mongodb/package.json').version)"

# Copy the rest of the server code
COPY . .

# Expose the port Railway injects
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
