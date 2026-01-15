# leads-microservice

## Table of Contents

- [leads-microservice](#leads-microservice)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Endpoints](#endpoints)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Run the application](#run-the-application)
  - [Authentication](#authentication)
  - [Schemas](#schemas)
  - [Caching](#caching)
  - [Background Jobs \& Synchronization](#background-jobs--synchronization)
  - [AI Integration](#ai-integration)
  - [Contributions](#contributions)
  - [License](#license)

## Overview

This project is a backend microservice built with [Express](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/), [Supabase](https://supabase.com/), [Prisma](https://www.prisma.io/), [Redis](https://redis.io/) and [Groq](https://groq.com/) that manages leads.

Leads can be created manually via API and automatically synchronized from an external public API. The service includes persistence in [PostgreSQL](https://www.postgresql.org/), caching with Redis, background jobs and synchronization, JSON Web Token ([JWT](https://www.jwt.io/introduction#what-is-json-web-token)) authentication, and a small AI integration to generate summaries and suggested next actions for each lead.

The external data source used for synchronization is the [Random User Generator API](https://randomuser.me).

## Endpoints

| Method | Path                     | Description                                | Protected |
|:------:|--------------------------|--------------------------------------------|:---------:|
| POST   | `/authentication/signup` | Register a user                            |           |
| POST   | `/authentication/login`  | Authenticate user and return access token |           |
| POST   | `/lead`                  | Create a lead manually                     |    ✔️     |
| GET    | `/leads`                 | List all existing leads                    |    ✔️     |
| GET    | `/leads/:id`             | Get lead details (cached with Redis)      |    ✔️     |
| POST   | `/leads/:id/summary`     | Generate AI summary and next action        |    ✔️     |


## Installation

### Prerequisites

- Install [Node.js](https://nodejs.org/es/download) 22.20.0 or higher:
    ```bash
    sudo apt update
    sudo apt install -y curl
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt install -y nodejs
    ```

- Have [Docker](https://docs.docker.com/engine/install) installed on your machine

- Have a [Docker Hub](https://hub.docker.com/) account

- Have a [Supabase](https://supabase.com/) project set up for your database and authentication

### Run the application

- Clone the repository:
    ```shell
    git clone https://github.com/antonioalanxs/leads-microservice
    cd leads-microservice
    ```

- Copy `.env.example` to `.env` and configure your environment:
    ```js
    PORT=1234
    API_KEY=api-key
    CORS_ACCEPTED_ORIGINS=http://localhost:1234,http://localhost:5173,http://example.com
    SUPABASE_CONNECTION_STRING=supabase-connection-string
    SUPABASE_URI=supabase-uri
    SUPABASE_KEY=supabase-key
    REDIS_HOST=localhost
    REDIS_PORT=6379
    GROQ_API_KEY=groq-api-key
    GROQ_MODEL=groq-model
    ```

- Go to the Docker development directory:
    ```shell
    cd leads-microservice/docker/development
    ```

- Start Redis service using the `up.sh` script:
    ```shell
    ./up.sh
    ```

- Go to the backend directory:
    ```shell
    cd ../../../backend
    ```

- Install backend dependencies:
    ```shell
    npm install
    ```

- Initialize Prisma and run the Express server using `package.json` scripts:
    ```shell
    npm run prisma:migrate
    npm run prisma:generate-client
    npm run dev
    ```

## Authentication

The microservice uses **Supabase for authentication**. Protected endpoints require a valid JWT, which Supabase handles, including password hashing, token generation and rotation, and session management.

```js
Authorization: Bearer <jwt-token>
```

## Schemas

This microservice uses [Zod](https://zod.dev/) to define **Data Transfer Objects** (**DTOs**) that validate request payloads, route parameters and responses at runtime. 

It ensures strong I / O validation, clear API contracts and end-to-end type safety.

## Caching

The microservice uses Redis to improve performance and reduce database load by caching lead details.

Key points:

* When a lead is requested via `GET /leads/:id`, the system first checks Redis. If the data is cached, it is returned immediately
* Cache entries have a **Time-To-Live** (**TTL**) to ensure that data remains fresh and consistent with the database
* When a lead is updated (e.g., after generating an AI summary), the corresponding cache entry is updated or invalidated to prevent stale data

## Background Jobs & Synchronization

The microservice automatically synchronizes leads from an external API (Random User Generator API) in the background.

Key points:

* A **scheduled CRON job** runs periodically to fetch new leads
* Each synchronization fetches 10 new leads per run and inserts them into the database
* A **deduplication strategy** ensures no duplicate leads are stored, based on fields like `externalId` and `email`
* The synchronization runs asynchronously using a **job queue**, so it does not block the main API requests

## AI Integration

The endpoint `POST /leads/:id/summary` uses a language model to enrich lead information.

Key points:

* For each lead, the AI generates:
  * `summary`: a concise overview of the lead's profile or situation
  * `next_action`: a suggested action the user could take to move the lead forward
* Both fields are **persisted in the database**, linked to the corresponding lead

## Contributions

This project was created as a technical assessment, but contributions are welcome.

1. Fork the repository
2. Create a new branch for your feature or bug fix (`git checkout -b feature/new-feature`)
3. Make your changes and commit them following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format (`git commit -m 'feat: add new feature'` or `fix: correct a bug`)
4. Push your branch to the remote repository (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the [Apache License 2.0](./LICENSE).
