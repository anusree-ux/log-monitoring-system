##⚡ Log Monitoring & Alerting Platform
A full-stack log monitoring application built with React, Flask, and PostgreSQL. This project demonstrates a complete DevOps workflow from local development to automated cloud deployment on AWS using Docker, Amazon ECR, GitHub Actions, Terraform, and EC2.

I built this project to understand how a simple app moves from local development → cloud deployment (AWS).
<img width="1267" height="932" alt="dashboard" src="https://github.com/user-attachments/assets/ed9db778-94b1-4c09-b241-10ade5266674" />


## 🚀 Features
- Shows logs in a simple dashboard (React UI)
- Backend health monitoring endpoint
- PostgreSQL database for persistent log storage
- Containerized using Docker and Docker Compose
- Automated testing with Pytest
- CI/CD pipeline using GitHub Actions
- CI/CD pipeline using GitHub Actions
- Automatic deployment to AWS EC2 after every successful push to the main branch

## 🛠️ Tech Stack
* **Frontend:** React, TypeScript, Nginx
* **Backend:** Python (Flask)
* **Database:** PostgreSQL
* **DevOps Tools:** Docker, Docker Compose, GitHub Actions, Amazon ECR, AWS EC2, Terraform

## 🏗️ Architecture
```
                    GitHub
                       │
                GitHub Actions
                       │
          Build & Push Docker Images
                       │
                  Amazon ECR
                       │
              Pull Latest Images
                       │
                   AWS EC2
                       │
                 Docker Compose
        ┌──────────────┴──────────────┐
        │                             │
   React Frontend                Flask Backend
                                        │
                                   PostgreSQL
```

--- 

## 💻 Run it locally

### Prerequisites
- Docker
- Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/anusree-ux/log-monitoring-system.git
cd log-monitoring-system
```

### 2. Create the environment file

```bash
cp .env.example .env
```

Update the values in `.env` if required.

### 3. Make the deployment script executable

```bash
chmod +x deploy.sh
```

### 4. Start the application

```bash
./deploy.sh start
```

The script automatically builds the Docker images and starts all services using Docker Compose.

### 5. Access the application

- **Frontend:** http://localhost
- **API:** http://localhost/api/logs
- **Health Check:** http://localhost/health

### Useful deployment commands

```bash
./deploy.sh status    # Check application status
./deploy.sh logs      # View application logs
./deploy.sh stop      # Stop all services
./deploy.sh restart   # Restart the application
```

## 🧪 Testing
The backend includes automated tests written using **Pytest**. Every push to the `main` branch runs these tests automatically through GitHub Actions. If any test fails, the deployment is stopped.

Run the tests locally:
  
    cd backend
    pip install -r requirements.txt
    pytest test_app.py

## ☁️ Deployment
The application is deployed on an AWS EC2 instance.

Every push to the **main** branch automatically triggers the deployment pipeline:


    Developer
       │
    git push
       │
    GitHub Actions
       │
    Run Pytest Tests
       │
    Build Docker Images
       │
    Push Images to Amazon ECR
       │
    SSH into EC2
       │
    Update IMAGE_TAG
       │
    docker compose pull
       │
    docker compose up -d
       │
    Live Application

The EC2 instance no longer builds Docker images. Instead, it pulls pre-built images from Amazon ECR, making deployments faster and ensuring the same tested images are used in production.

## 🔄 CI/CD Pipeline

Every push to the `main` branch automatically:

- Runs backend tests using Pytest
- Builds Docker images for the frontend and backend
- Pushes the images to Amazon ECR
- Connects to the EC2 instance through SSH
- Updates the deployed image version
- Pulls the latest Docker images
- Restarts the application using Docker Compose

This ensures that only tested code is deployed automatically.

---
## 🏗️ Infrastructure

Infrastructure is provisioned using **Terraform**.

Resources created include:

- AWS EC2 Instance
- Security Group
- Elastic IP
- IAM Role for Amazon ECR access
---

## 🧠 What I learned
- Building full-stack applications using React, Flask, and PostgreSQL
- Containerizing applications using Docker and Docker Compose
- Creating secure Docker images with multi-stage builds
- Provisioning AWS infrastructure using Terraform
- Deploying applications on AWS EC2
- Building a CI/CD pipeline using GitHub Actions
- Storing Docker images in Amazon ECR
- Automating deployments using Docker Compose
- Versioning Docker images using Git commit SHA tags
- Managing application configuration using environment variables
- Understanding the end-to-end software delivery lifecycle from development to production
