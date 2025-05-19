FROM artifactorycloud.ual.com/v-docker/node:22 AS build
WORKDIR /app

COPY .npmrc .npmrc
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM artifactorycloud.ual.com/v-docker/node:22-alpine
WORKDIR /app

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 8080
ENV PORT=8080
CMD ["node", "server.js"]