FROM node:10-alpine
USER node

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node node_modules ./node_modules
COPY --chown=node:node dist ./dist

EXPOSE 8080

CMD [ "node", "dist/app.js" ]
