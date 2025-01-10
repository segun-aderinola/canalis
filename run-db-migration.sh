#!/bin/bash
set -e 

touch .env

echo "DB_CLIENT=$DB_CLIENT" >> .env
echo "DB_HOST=$DB_HOST" >> .env
echo "DB_PORT=$DB_PORT" >> .env
echo "DB_USERNAME=$DB_USERNAME" >> .env
echo "DB_DATABASE=$DB_DATABASE" >> .env
echo "DB_PASSWORD=$DB_PASSWORD" >> .env
echo "APP_NAME=$APP_NAME" >> .env
echo "PORT=$PORT" >> .env
echo "APP_HOME=$APP_HOME" >> .env
cat .env
ls
npm install

# Run the migration and check for failure
npm run db:migrate || { echo "Database migration failed!"; exit 1; }
npm run db:seed || { echo "Database seeding failed!"; exit 1; }
