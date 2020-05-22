# https://blog.logrocket.com/containerized-development-nestjs-docker

# Stage 1
FROM node:14.3 AS development

WORKDIR /src/app

COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN npm run build

# Stage 2
FROM node:12.13-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /src/app/dist ./dist

CMD ["node", "dist/main"]