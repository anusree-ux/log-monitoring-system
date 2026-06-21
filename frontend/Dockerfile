# Start with a Node.js image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Run the Vite server (the --host flag allows outside access to the container)
CMD ["npm", "run", "dev", "--", "--host"]
