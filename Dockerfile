FROM node

ARG APP_DIR=/audit_log_api/
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

COPY . ${APP_DIR}

COPY package*.json ${APP_DIR}
RUN npm install && npm install pm2 -g

EXPOSE 3000

CMD ["pm2-runtime", "process.yml"]