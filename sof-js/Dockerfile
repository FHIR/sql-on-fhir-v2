FROM oven/bun:alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install production dependencies
RUN bun install --frozen-lockfile --production

# Copy application files
COPY src/ ./src/
COPY metadata/ ./metadata/
COPY public/ ./public/
COPY tailwind.config.js ./

# Create a non-root user
RUN addgroup -g 1001 -S bunuser && \
    adduser -S bunuser -u 1001 && \
    chown -R bunuser:bunuser /app

# Switch to non-root user
USER bunuser

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start the server
CMD ["bun", "run", "server"]
