FROM node:22.14.0-alpine3.21 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22.14.0-alpine3.21 AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev && addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts

USER appuser
EXPOSE 8080
CMD ["npm", "start", "--", "--hostname", "0.0.0.0", "--port", "8080"]
