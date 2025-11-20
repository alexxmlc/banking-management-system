## 🚀 Development Setup Guide

This project uses **Spring Boot Docker Compose Support**. The database (PostgreSQL) will automatically start in a container when you run the application.

### 1. Prerequisites
You must have Docker installed and running on your machine.

* **Windows / Mac:**
    * Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
    * Start Docker Desktop and ensure the "whale" icon is visible in your taskbar.

* **Linux:**
    * Install Docker Engine and the Docker Compose plugin.
    * **Important:** Ensure your user has permission to run Docker without `sudo`:
        ```bash
        sudo usermod -aG docker $USER
        newgrp docker
        ```
    * Verify it works by running `docker ps` in your terminal.

### 2. How to Run
1.  Clone the repository.
2.  Open the project in your IDE (IntelliJ, Eclipse, VS Code).
3.  Run the `PunctBankingApplication.java` main class.
    * *Spring Boot will detect `docker-compose.yml`, download the PostgreSQL image, and start the database automatically.*

### 3. Troubleshooting
* **"Connection Refused" or "Docker Connection Error":**
    * Make sure Docker is actually running!
    * (Linux) Make sure you added your user to the `docker` group and restarted your session.
* **"Port 5432 already in use":**
    * You might have a local PostgreSQL instance running on your machine. Stop it so the Docker container can use port 5432.