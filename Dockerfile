FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY client/package.json client/package.json

# Install backend dependencies
RUN cd server && npm install --production

# Install frontend dependencies and build
RUN cd client && npm install && npm run build

# Copy source code
COPY server/ server/
COPY client/ client/

# Create uploads directory
RUN mkdir -p server/uploads

# Expose port
EXPOSE 4000

# Start backend server
CMD ["npm", "--prefix", "server", "start"]

