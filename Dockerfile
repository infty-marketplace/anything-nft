FROM node:12-alpine

WORKDIR /app
COPY backend ./backend
COPY infty ./infty

RUN cd /app/infty && npm i && npm run build
RUN cp -r /app/infty/dist/* /app/backend/src/views

RUN cd /app/backend && npm i

WORKDIR /app/backend
CMD ["node", "src/index.js"]
