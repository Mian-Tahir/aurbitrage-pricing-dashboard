FROM node:18-alpine as builder

WORKDIR /app

COPY frontend/package*.json ./

RUN npm ci

COPY frontend ./

RUN npm run build

FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY backend/package*.json ./

RUN npm ci

COPY backend ./

COPY --from=builder /app/dist/ public

ARG PORT=4000

EXPOSE ${PORT}

ENTRYPOINT [ "npm", "run", "serve" ]


