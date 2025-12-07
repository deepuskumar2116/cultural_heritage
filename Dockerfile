FROM node:18-alpine

WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/

# Copy client package files
COPY client/package*.json ./client/

# Install backend dependencies
RUN cd server && npm install --production

# Copy client source and build
COPY client/src ./client/src
COPY client/index.html ./client/
COPY client/vite.config.js ./client/ 2>/dev/null || true

RUN cd client && npm install && npm run build

# Copy server source code
COPY server/server.js ./server/
COPY server/migrations/ ./server/migrations/ 2>/dev/null || true

# Create uploads directory
RUN mkdir -p server/uploads

# Expose port
EXPOSE 4000

# Set environment variables
ENV NODE_ENV=production
ENV JWT_SECRET=production-secret-key-change-this

# Start backend server
CMD ["node", "server/server.js"]

