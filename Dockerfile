FROM node:12-buster

RUN apt update

RUN apt install -y mariadb-client build-essential yarn

WORKDIR /home/node/app

RUN chown node:node -R /home/node

USER node

COPY --chown=node:node package.json .

RUN yarn add bufferutil
RUN yarn install

COPY --chown=node:node . .

RUN mv .env.docker .env

CMD [ "ready.sh" ]

ENTRYPOINT [ "/bin/bash" ]
