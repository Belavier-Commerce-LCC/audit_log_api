FROM node

ARG APP_DIR=/audit_log_api/
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

COPY . ${APP_DIR}

COPY package*.json ${APP_DIR}
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]