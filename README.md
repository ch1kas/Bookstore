# NestJS Bookstore API

This is a simple Bookstore API built with [NestJS](https://nestjs.com/) and [TypeORM](https://typeorm.io/). It supports user authentication with JWT, book management (CRUD operations), and follows best practices for development, including unit and integration testing, Docker support, and environment configuration.

## Features

- User registration and login with JWT authentication
- Book management (CRUD operations)
- Unit and integration tests for core services and controllers
- Docker support for development and production
- Swagger API documentation

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (>= 18.x.x)
- Docker and Docker Compose
- [Postman](https://www.postman.com/) or [cURL](https://curl.se/) (for testing API endpoints)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/nestjs-bookstore.git
cd nestjs-bookstore
```

### 2. Clone the repository

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Update the .env file with your local configuration.
You can refer to .env.example file


### 4. Run the application
You can run the app using either Docker or locally.

Option A: Run with Docker (Recommended)
Ensure that Docker and Docker Compose are installed on your machine. Use the following command to build and run the app inside a Docker container:

```bash
docker-compose up --build
```

Option B: Run locally
If you prefer running the app without Docker, use the following commands:

```bash
npm run start:dev
```

The app will be running at http://localhost:3000.

### 5. API Documentation (Swagger)
Once the application is running, you can access the API documentation via Swagger UI by visiting:

http://localhost:3000/api

Running Tests
This project includes unit tests using Jest.


```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
