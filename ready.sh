# /bin/sh
echo REDIS_PASSWORD=$REDIS_PASSWORD >> .env
echo REDIS_HOST=$REDIS_HOST >> .env

npm start

