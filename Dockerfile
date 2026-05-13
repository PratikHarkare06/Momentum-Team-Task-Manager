# Use official Node 20 alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Force npm to use official registry
RUN npm config set registry https://registry.npmjs.org/

# Copy server package.json from the server subdirectory
COPY server/package.json ./

# Fresh install from official registry
RUN npm install --prefer-online --no-cache

# Copy all server source code
COPY server/ ./

# Verify installed versions
RUN node -e "console.log('mongodb:', require('./node_modules/mongodb/package.json').version, '| mongoose:', require('./node_modules/mongoose/package.json').version)"

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
