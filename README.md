# opentelemetry-signoz-sample

## Project Overview

This repository contains a microservices-based application demonstrating the integration of OpenTelemetry and SigNoz for observability. It's designed to showcase how different services such as orders, payments, products, and users can be monitored in a distributed system.

## Setup Instructions

### Prerequisites

- Docker and Docker Compose installed
- Node.js installed
- Access to MongoDB

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repository/opentelemetry-signoz-sample.git
   cd opentelemetry-signoz-sample
   ```

2. **Build and run the services using Docker Compose**
   ```bash
   docker-compose up --build
   ```

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Observability**: OpenTelemetry, SigNoz
- **Containerization**: Docker, Docker Compose

## Project Structure

- `order-service/`: Contains all files related to the Order service including its Dockerfile and server logic.
- `payment-service/`: Contains all files for the Payment service.
- `product-service/`: Manages the Product service files.
- `user-service/`: Holds the User service files.
- `docker-compose.yml`: Defines how the Docker containers are built, run, and interconnect.

### Important Files

- `server.js`: Each service directory contains a `server.js` which is the entry point for that service, defining APIs and connecting to the database.
- `Dockerfile`: Used to build Docker images for each service.
- `model.js`: Defines Mongoose schemas for the MongoDB collections used by each service.

## Key Endpoints

Each service offers several endpoints for interacting with the application:

- **Orders**
  - `GET /orders`: Retrieves all orders, including user details.
  - `POST /orders`: Creates a new order and updates the product stock.

- **Payments**
  - `GET /payments`: Lists all payments.
  - `POST /payments`: Processes a payment for an order.

- **Products**
  - `GET /products`: Fetches all products.
  - `POST /products`: Adds a new product to the inventory.

- **Users**
  - `GET /users`: Returns all registered users.
  - `POST /users`: Registers a new user.

## Building the Application from Scratch

If you prefer to build the application from scratch rather than cloning, follow these steps:

1. **Set up the project structure** as outlined above, creating directories and necessary files for each service.
2. **Write Dockerfiles** for each service to containerize the applications.
3. **Create the Docker Compose file** to define and run multi-container Docker applications.
4. **Implement the server logic** in `server.js` for each service to handle API requests and interact with the database.
5. **Integrate OpenTelemetry** to capture telemetry data and configure it to communicate with SigNoz for visualizing data.

## Troubleshooting Common Issues

- **Service discovery issues**: Ensure all services are correctly referenced in `docker-compose.yml` and network configurations are correct.
- **Database connectivity issues**: Double-check MongoDB URIs and network access settings in Docker.
- **Endpoint failures**: Verify that all routes are correctly implemented and tested. Check server logs for detailed error messages.
- **Configuration errors in Docker Compose**: Ensure that ports, volumes, and dependency definitions are correct.

## Conclusion

This guide provides a fundamental setup for a microservices architecture using Docker, Node.js, MongoDB, OpenTelemetry, and SigNoz. It is designed to help developers understand the basics of building and observing microservices in a containerized environment.
