##⚡ Log Monitoring & Alerting Platform
A full-stack web app that shows system logs and sends alerts when something goes wrong.

I built this project to understand how a simple app moves from local development → cloud deployment (AWS).
<img width="1267" height="932" alt="dashboard" src="https://github.com/user-attachments/assets/ed9db778-94b1-4c09-b241-10ade5266674" />


## 🚀 Features
- Shows logs in a simple dashboard (React UI)
- Creates alerts when errors cross a limit
- Backend health monitoring endpoint
- Runs on an AWS EC2 server
- Automated CI/CD using GitHub Actions

## 🛠️ Tech Stack
* **Frontend:** React, TypeScript
* **Backend:** Python (Flask)
* **Database:** PostgreSQL
* **DevOps Tools:** Docker, Docker Compose, Nginx, AWS EC2, GitHub Actions

## 🏗️ Architecture
Users
  |
 Nginx
  |
 ----------------
 |              |
Frontend     Backend
React        Flask API
                 |
            PostgreSQL
            
## 💻 Run it locally
You only need Docker installed.
1. Clone the project
   ```bash
   git clone https://github.com/anusree-ux/log-monitoring-system
   cd log-monitoring-system
   cp .env.example .env

3. Start the app
   ```bash
   docker compose up -d --build

5. Open in browser
   ```bash
   Frontend: http://localhost
   Backend:  http://localhost/api/logs
   Health Check: http://localhost/health

## 🧪 Testing
To make sure the alert rules actually work, I wrote automated tests using pytest. The GitHub Actions pipeline runs these tests automatically. If a test fails, it stops the update from going to the live server.
To run the tests yourself:
  
    cd backend
    pip install -r requirements.txt
    pytest test_app.py

## ☁️ Deployment
This app is deployed on AWS EC2 using Docker.
Every update works like this:
  Code Push → GitHub Actions (Pytest Tests) → SSH Deploy to AWS EC2 → Docker Compose Build & Restart → Live Application

## 🧠 What I learned
* Building and connecting full-stack applications
* Containerizing applications using Docker and multi-stage builds
* Running containers securely using non-root users
* Managing multi-service applications with Docker Compose
* Deploying applications on AWS EC2
* Creating CI/CD pipelines with GitHub Actions
