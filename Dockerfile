FROM node:22-bookworm-slim

WORKDIR /app

# Install Python and pip
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies first for better Docker caching
COPY backend/package*.json ./backend/

WORKDIR /app/backend

RUN npm ci

# Install Python dependencies
WORKDIR /app

COPY analysis-engine/requirements.txt ./analysis-engine/requirements.txt

RUN pip3 install \
    --no-cache-dir \
    --break-system-packages \
    -r analysis-engine/requirements.txt

# Copy application source
COPY backend ./backend
COPY analysis-engine ./analysis-engine

# Build the TypeScript backend
WORKDIR /app/backend

RUN npm run build

ENV NODE_ENV=production

CMD ["npm", "start"]