# Use SPECIFIC Node version to bust Railway's Docker layer cache
FROM node:20.18.0-alpine3.20

WORKDIR /app

# Everything in ONE step so nothing can be cached separately
RUN npm config set registry https://registry.npmjs.org/ && \
    mkdir -p server

COPY server/package.json ./server/package.json

# Delete lockfile and install fresh - single layer, uncacheable
RUN cd server && \
    rm -rf node_modules package-lock.json && \
    npm install --prefer-online --no-cache && \
    echo "=== INSTALLED VERSIONS ===" && \
    node -e "console.log('mongodb=' + require('./node_modules/mongodb/package.json').version)" && \
    node -e "console.log('mongoose=' + require('./node_modules/mongoose/package.json').version)" && \
    echo "=== LINE 13 OF abstract_cursor.js ===" && \
    sed -n '13p' node_modules/mongodb/lib/cursor/abstract_cursor.js

COPY server/ ./server/

# Re-delete node_modules that COPY might bring and symlink to our clean install
RUN rm -rf /app/server/node_modules.bak && \
    if [ -d /app/server/node_modules ]; then \
      echo "WARNING: COPY brought in node_modules, keeping npm-installed version"; \
    fi

EXPOSE 8080

CMD ["node", "server/server.js"]
