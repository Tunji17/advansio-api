FROM node:11

ENV PATH /app/user/bin:$PATH

RUN wget -O /usr/local/bin/rabbitmqadmin https://raw.githubusercontent.com/rabbitmq/rabbitmq-management/rabbitmq_v3_6_5/bin/rabbitmqadmin \
    && chmod a+x /usr/local/bin/rabbitmqadmin

WORKDIR /app/user

COPY package.json package-lock.json /app/user/

RUN npm install

COPY . /app/user/
