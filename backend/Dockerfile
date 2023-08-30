FROM node:20.4-alpine AS base

# build for dev

FROM base as dev

WORKDIR /app

ENV NODE_ENV=development

COPY  package*.json ./

RUN npm install --legacy-peer-deps

COPY  . .

RUN npm run prisma:generate


# BUILD FOR PRODUCTION

FROM base As build

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=PRODUCTION

COPY --from=dev /app/node_modules ./node_modules

COPY . .

RUN npm run build

RUN npm ci --only=production && npm cache clean --force

# PRODUCTION
FROM base as production

ENV NODE_ENV PRODUCTION

COPY  --from=build /app/node_modules ./node_modules
COPY  --from=build /app/dist ./dist

CMD [ "node", "dist/main.js" ]
