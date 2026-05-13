# Use official Node 20 alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Force npm to use official registry
RUN npm config set registry https://registry.npmjs.org/

# Copy server package.json
COPY server/package.json ./server/

# Install dependencies fresh in server directory
RUN cd server && npm install --prefer-online --no-cache

# Copy all server source code into /app/server/
COPY server/ ./server/

# Verify installed versions
RUN node -e "console.log('mongodb:', require('./server/node_modules/mongodb/package.json').version, '| mongoose:', require('./server/node_modules/mongoose/package.json').version)"

# Expose port
EXPOSE 8080

# Start server — matches Railway's expected path /app/server/server.js
CMD ["node", "server/server.js"]
