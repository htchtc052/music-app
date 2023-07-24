FROM node:18.4-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/

FROM base as dev
ENV NODE_ENV=dev
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]

FROM dev AS test
ENV NODE_ENV=test
CMD [ "npm", "run", "test"]

FROM test AS test-cov
CMD [ "npm", "run", "test:cov"]

FROM test AS test-watch
ENV GIT_WORK_TREE=/app GIT_DIR=/app/.git
RUN apk add git
CMD [ "npm", "run", "test:watch"]



FROM base as prod
ENV NODE_ENV=prod
RUN npm install --production
COPY . .
RUN npm run build
CMD ["node", "dist/main.js"]


#COPY prisma ./prisma/
#RUN npm cache clean --force
