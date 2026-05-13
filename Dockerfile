# Use official Node 20 alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Cache buster - change this value to force full rebuild
ARG CACHEBUST=5

# Force npm to use official registry
RUN npm config set registry https://registry.npmjs.org/

# Copy ALL server files
COPY server/ ./server/

# NUKE any node_modules that got copied
RUN rm -rf server/node_modules server/package-lock.json

# Copy package.json again to be safe
COPY server/package.json ./server/package.json

# Install fresh dependencies
RUN cd server && npm install --prefer-online --no-cache 2>&1

# Verify correct versions — THIS MUST SHOW mongodb=4.17.1
RUN echo "=== VERIFICATION ===" && node -e "const m = require('./server/node_modules/mongodb/package.json'); console.log('mongodb=' + m.version)" && node -e "const g = require('./server/node_modules/mongoose/package.json'); console.log('mongoose=' + g.version)"

# Show line 13 of abstract_cursor to prove no resource_management
RUN echo "=== LINE 13 CHECK ===" && sed -n '13p' server/node_modules/mongodb/lib/cursor/abstract_cursor.js

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "server/server.js"]
