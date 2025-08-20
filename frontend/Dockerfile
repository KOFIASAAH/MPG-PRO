# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set work directory
WORKDIR /app

# Install dependencies
COPY package.json .
# COPY package-lock.json* .
RUN npm install

# Copy project
COPY . .

# Expose port
EXPOSE 5173

# Run app
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
