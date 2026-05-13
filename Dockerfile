# Use official Node 20 alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Force npm to use official registry
RUN npm config set registry https://registry.npmjs.org/

# Copy ALL server files first
COPY server/ ./server/

# NUKE any node_modules that got copied in (the real fix)
RUN rm -rf server/node_modules

# Install fresh dependencies from scratch
RUN cd server && npm install --prefer-online --no-cache

# Verify correct versions installed
RUN node -e "const m = require('./server/node_modules/mongodb/package.json'); const g = require('./server/node_modules/mongoose/package.json'); console.log('VERIFY: mongodb=' + m.version + ' mongoose=' + g.version)"

# Verify resource_management does NOT exist (it shouldn't in mongodb@4.x)
RUN ls server/node_modules/mongodb/lib/ | head -20

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server/server.js"]
