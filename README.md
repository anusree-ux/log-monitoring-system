#⚡ Log Monitoring & Alerting Platform
A full-stack web app that shows system logs and sends alerts when something goes wrong.

I built this project to understand how a simple app moves from local development → cloud deployment (AWS).
<img width="1267" height="932" alt="dashboard" src="https://github.com/user-attachments/assets/ed9db778-94b1-4c09-b241-10ade5266674" />


## 🚀 What it does
- Shows logs in a simple dashboard (React UI)
- Creates alerts when errors cross a limit
- Runs on an AWS EC2 server
- Automatically updates when I push code to GitHub (CI/CD)

## 🛠️ Tech Stack
* **Frontend:** React, TypeScript
* **Backend:** Python (Flask)
* **Database:** PostgreSQL
* **DevOps Tools:** Docker, Nginx, AWS EC2, GitHub Actions

## 💻 Run it locally
You only need Docker installed.
1. Clone the project
   ```bash
   git clone https://github.com/anusree-ux/log-monitoring-system
   cd log-monitoring-system

3. Start the app
   ```bash
   docker compose up -d --build

5. Open in browser
   ```bash
   Frontend: http://localhost:5173
   Backend:  http://localhost:5000/api/logs

## 🧪 Testing
To make sure the alert rules actually work, I wrote automated tests using pytest. The GitHub Actions pipeline runs these tests automatically. If a test fails, it stops the update from going to the live server.
To run the tests yourself:
  
    cd backend
    pip install -r requirements.txt
    pytest test_app.py

## ☁️ Deployment
This app is deployed on AWS EC2 using Docker.
Every update works like this:
  git push → GitHub Actions → AWS EC2 → App updates automatically

## 🧠 What I learned
* How full-stack apps work together
* How Docker containers run multiple services
* How to deploy apps on AWS EC2
* Basics of CI/CD automation

Deployment tested successfully on AWS EC2.
# test deployment
# test deployment
