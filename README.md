# 🛍️ Tiny Store Challenge

Tiny Store is a Rest API for a simple store. It uses [Nest](https://github.com/nestjs/nest) framework.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
# Install the dependencies
$ yarn install

# Install Docker and Postgres
$ docker pull postgres:14.3
```

## Running the app

```bash
# change .env file with the data about your dataBase
$ .env.template --> .env

# build docker image
$ docker compose up -d

# build the database tables with prisma command
$ npx prisma migrate dev --name "name_of_your_migration"

# if you need to reset the database
$ npx prisma migrate reset

# if you need to seed the database
$ npx prisma db seed

# if you need to generate types
$ npx prisma generate

# if you need to deploy the database
$ npx prisma migrate deploy

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## 🔐 Environment Variables

- `DB_PASSWORD`: Database password
- `POSTGRES_DB`: Database name
- `POSTGRES_USER`: Database user
- `DATABASE_URL`: Database URL
- `JWT_SECRET`: JWT secret key
- `FIREBASE_PRIVATE_KEY`: Firebase private key
- `FIREBASE_PROJECT_ID`: Firebase project ID
- `FIREBASE_CLIENT_EMAIL`: Firebase client email
- `FIREBASE_STORAGE_BUCKET`: Firebase storage bucket

## Test

```bash
# unit tests
$ yarn run test
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - Daniel Echegaray
- GitHub - <https://github.com/danqwas>

## Features

- Authentication using JWT Strategy, Guards & Custom Decorators
- Authorization based on RBAC with two roles: CUSTOMER & MANAGER
- Clean folder structure, commented code & API documentation with Swagger
- Managers can create, read, update & delete Products. Clients can read visible products, buy products, and check their cart
- Prisma Global Module, Singletons for Firebase Upload Service & various utilities
