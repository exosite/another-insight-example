FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

FROM base AS builder

COPY package*.json /app

RUN npm ci --include=dev

COPY . .

RUN npm run build
RUN npm prune --production

FROM base AS release
COPY --from=builder /app/dist /app
COPY --from=builder /app/api/swagger.yaml /app/api/swagger.yaml
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["node", "index.js"]
