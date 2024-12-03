# CRUD API application

## Description

This project is a CRUD (Create, Read, Update, Delete) API designed to manage user information. The API allows for
the creation, retrieval, updating, and deletion of user records. It is built using Node.js and can run in different modes
such as development, production, and multi-process mode.

## Installation

To set up and run this project locally, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Navigate into the project directory: `cd <repository-directory>`
3. Install the required dependencies: `npm i`

## Usage

To start the server, you can run one of the following commands depending on your environment needs:

- **Development mode**: This mode is suitable for development and debugging purposes.

```
npm run start:dev
```

- **Production mode**: This mode is optimized for running in a production environment.

```
npm run start:prod
```

- **Multi-process mode**: This mode allows running multi-process cluster of servers for load balancing.

```
npm run start:multi
```

Once the server is running, you can access the API endpoints using tools like Postman, cURL, or directly via a web browser.

## API Endpoints

The following endpoints are available for interacting with the user data:

| Method | Endpoint        | Description                           |
| ------ | --------------- | ------------------------------------- |
| GET    | `/api/users`    | Retrieve a list of all users          |
| GET    | `/api/users/id` | Retrieve a specific user record by ID |
| POST   | `/api/users`    | Create a new user record              |
| PUT    | `/api/users/id` | Update an existing user record        |
| DELETE | `/api/users/id` | Delete an existing user record        |

## Scripts

In addition to running the server, there are several other scripts available for maintaining and testing the codebase:

- Check code formatting: `npm run format:check`
- Format code: `npm run format:fix`
- Run linting: `npm run lint`
- Run tests: `npm run test`
