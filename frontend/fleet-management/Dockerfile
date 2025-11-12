FROM node:18-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Install react-scripts globally
RUN npm install -g react-scripts

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Set NODE_ENV to production for build
ENV NODE_ENV=production
ENV PATH /app/node_modules/.bin:$PATH

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Install serve to run the application
RUN npm install -g serve

# Copy built assets from builder
COPY --from=builder /app/build ./build

EXPOSE 3000

# Start the application using serve
CMD ["serve", "-s", "build", "-l", "3000"] 