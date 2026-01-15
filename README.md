# Punct Banking Management System

A full-stack banking application designed to simulate core banking operations, including account management, secure fund 
transfers, and administrative oversight. Built with a **Spring Boot** microservice architecture and a modern **React**
frontend.

## Use Case Diagram

![use case diagram](use_case.svg)

## Features

### User Features

* **Secure Authentication:** User registration and login using JWT (JSON Web Tokens).
* **Account Management:** Users can open multiple bank accounts with different currencies (RON, EUR, USD).
* **Real-Time Balance:** View account details and balances instantly.
* **Fund Transfers:** Transfer money between accounts securely.
* **Transaction History:** View a log of all past transactions (Sent/Received).

### Admin Features

* **User Oversight:** View all registered users in the system.
* **Role Management:** Promote users to Admin status.

### Technical Highlights

* **Containerized Database:** Uses PostgreSQL running via Docker Compose for consistent data persistence.
* **Reactive UI:** Built with React, Vite, and Tailwind CSS for a responsive experience.
* **API Documentation:** Integrated Swagger/OpenAPI for live endpoint testing.

-----

## Tech Stack

* **Backend:** Java 25, Spring Boot 3.5.7, Spring Security, Spring Data JPA.
* **Frontend:** React 19, Vite, Tailwind CSS.
* **Database:** PostgreSQL (Dockerized).
* **Tools:** Docker Compose, Maven, Lombok.

-----

##️ Setup & Installation

### 1. Prerequisites

* **Docker Desktop** (must be running).
* **Node.js** (v18+).
* **Java JDK 25**.

### 2. Start the Database (Docker)

The project includes a `docker-compose.yml` file that automatically sets up the PostgreSQL database.

```bash
# In the project root
docker-compose up -d
````

### 3. Start the Backend

You can run the Spring Boot application using your IDE (IntelliJ/Eclipse) or the command line.

```bash
# Using Maven Wrapper
./mvnw spring-boot:run
```

* **Server Port:** `8081` (Configured in `application.properties`)
* **Database Connection:** `jdbc:postgresql://localhost:5433/bank_db`

### 4. Start the Frontend

Open a new terminal and navigate to the frontend directory.

```bash
cd front_banking
npm install
npm run dev
```

* **Frontend URL:** `http://localhost:5173`

-----

## API Documentation (Swagger UI)

We have integrated **Springdoc OpenAPI** to provide interactive documentation for the backend endpoints.

Once the backend is running, you can access the interface to view and test all API endpoints:

👉 **[View API Documentation (Swagger UI)](http://localhost:8081/swagger-ui/index.html)**

-----

## Default Credentials

When running in **Development Mode** (`spring.profiles.active=dev`), the application automatically seeds a default admin
user:

* **Username:** `admin`
* **Password:** `adminpass`

-----

## Project Structure

```text
banking-management-system/
├── src/                  # Spring Boot Backend Source Code
├── front_banking/        # React Frontend Source Code
├── docker-compose.yml    # Database Container Config
├── pom.xml               # Backend Dependencies
└── README.md             # Project Documentation
```

## Testing

To run the backend unit tests:

```bash
./mvnw test
```