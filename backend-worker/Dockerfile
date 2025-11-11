# Use a specific Node.js version for reproducibility
FROM node:18-alpine

# Work as root initially to install dependencies
WORKDIR /app

# Copy package.json and install production dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy the rest of the application source code
COPY . .

# Create a non-root user and change ownership of the app directory for security
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs && chown -R nodejs:nodejs /app

# Switch to the non-root user for runtime
USER nodejs

# Environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the application port
EXPOSE 8080

# Start the application
CMD [ "node", "server.js" ]