# Use a specific Node.js version for reproducibility
FROM node:18-alpine

# Work as root initially
WORKDIR /app

# Copy package manifests first to leverage layer caching
COPY package.json ./

# Install production dependencies as root
# npm v9+ recommended flag: --omit=dev
RUN npm install --omit=dev

# Copy the rest of the application source code
COPY . .

# Create a non-root user and group, then set ownership of the app directory
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs \
  && chown -R nodejs:nodejs /app

# Switch to the non-root user for runtime
USER nodejs

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the application port
EXPOSE 8080

# Start the application
CMD [ "node", "server.js" ]
