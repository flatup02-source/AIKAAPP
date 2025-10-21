# Use a specific Node.js version for reproducibility
FROM node:18-alpine

# Create a non-root user and group for security and switch to it
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs
USER nodejs

# Set up the application directory
WORKDIR /app

# Copy package.json to leverage Docker's layer caching
COPY --chown=nodejs:nodejs package.json ./

# Install dependencies. Using npm install as package-lock.json is not guaranteed.
RUN npm install --only=production

# Copy the rest of the application source code
COPY --chown=nodejs:nodejs . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD [ "node", "server.js" ]