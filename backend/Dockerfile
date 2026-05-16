FROM node:20-bullseye-slim AS builder
WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json* ./
COPY tsconfig.json /app/tsconfig.json
COPY backend/tsconfig.json ./tsconfig.json
COPY backend/prisma ./prisma
COPY backend/src ./src

RUN npm install
RUN npx prisma generate || true
RUN npm run build

FROM node:20-bullseye-slim AS runner
WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json* ./
# Copy node_modules from builder so generated Prisma client is available at runtime
COPY --from=builder /app/backend/node_modules ./node_modules

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/tsconfig.json /app/tsconfig.json
COPY --from=builder /app/backend/tsconfig.json ./tsconfig.json

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
