# https://github.com/vercel/next.js/discussions/16995#discussioncomment-132339
FROM node:lts-alpine AS deps

WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
FROM node:lts-alpine AS builder

ENV NODE_ENV=production
WORKDIR /opt/app
COPY . .
COPY --from=deps /opt/app/node_modules ./node_modules
RUN yarn build

FROM node:lts-alpine AS runner
LABEL org.opencontainers.image.source https://github.com/parente/honey.fitness
WORKDIR /opt/app
ENV NODE_ENV=production
COPY --from=builder /opt/app/public ./public
COPY --from=builder /opt/app/.next ./.next
COPY --from=builder /opt/app/node_modules ./node_modules
CMD ["node_modules/.bin/next", "start"]
