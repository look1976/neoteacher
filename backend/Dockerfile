FROM node:20-alpine AS builder
WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json* ./
COPY tsconfig.json /app/tsconfig.json
COPY backend/tsconfig.json ./tsconfig.json
COPY backend/prisma ./prisma
COPY backend/src ./src

RUN npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json* ./
RUN npm install --production

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/index.js"]
