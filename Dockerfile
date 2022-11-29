FROM node:16-alpine
ARG env=production
ENV NODE_ENV=production

RUN mkdir -p /.npm && chown -R nobody:nobody /.npm
RUN mkdir -p /app && chown nobody:nobody /app
WORKDIR /app

USER nobody
EXPOSE 3000
