# ===========================
# Stage 1: Build the Next.js app
# ===========================
FROM node:18 AS builder
 
# Set working directory
WORKDIR /app
 
# Copy dependency files
COPY package.json package-lock.json ./
 
# Install dependencies
RUN npm install --legacy-peer-deps
 
# Copy environment file (from pipeline)
COPY .env .env
 
# Copy app files and build
COPY . .
 
# Build the Next.js project
RUN npm run build
 
# ===========================
# Stage 2: Production image
# ===========================
FROM node:18-alpine AS runner
 
WORKDIR /app
 
# Copy only necessary files from builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env .env
 
# Expose port
EXPOSE 3000
 
# Environment mode
ENV NODE_ENV=production
 
# Start Next.js app
CMD ["npm", "start"]
