# Use Node.js LTS as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app/backend

# Install backend dependencies
COPY backend/package.json ./
RUN npm install --production

# Copy backend and frontend code
COPY backend ./
COPY frontend ../frontend

# Expose port
EXPOSE 8080

# Start the server
CMD ["npm", "start"] 