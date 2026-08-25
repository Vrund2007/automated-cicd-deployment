# Automated CI/CD Deployment Pipeline

A complete, production-grade Automated CI/CD Deployment Pipeline project. Whenever code changes are committed and pushed to the main or demo branch in GitHub, an automated workflow triggers to build a Docker container image, push it to Docker Hub, connect to an AWS EC2 Linux server over SSH, and automatically deploy the updated application live on HTTP Port 80.

---

## Live Reference Links

- Live Website: http://13.60.55.166
- GitHub Repository: https://github.com/Vrund2007/automated-cicd-deployment
- Docker Hub Image Repository: vrundzzz/automated-cicd-portfolio:latest

---

## System Architecture

```text
Local Developer Computer (HTML / CSS / JS)
       │
    git push
       │
       ▼
GitHub Repository (main / demo branches)
       │
    Triggers Event
       │
       ▼
GitHub Actions Runner (.github/workflows/deploy.yml)
       ├── 1. Checkout repository code
       ├── 2. Set up Docker Buildx environment
       ├── 3. Authenticate with Docker Hub
       ├── 4. Build & Push Nginx Docker image (vrundzzz/automated-cicd-portfolio:latest)
       └── 5. Connect to AWS EC2 via SSH using GitHub Secrets
                   │
                   ├── Check / Auto-install Docker on EC2 if missing
                   ├── Allow Port 80 in OS firewall
                   ├── Pull latest image from Docker Hub
                   ├── Stop old running container
                   ├── Remove old container
                   └── Launch new container on HTTP Port 80
                           │
                           ▼
                   Live AWS EC2 Web Server (http://13.60.55.166)
```

---

## Beginner's Guide: Core Concepts & Technologies Used

### 1. HTML, CSS, JavaScript (The Web Application)
- **Role**: Forms the user interface of the application.
- **Why**: Static frontend files require minimal server resources and load instantly when served by a lightweight web engine like Nginx.

### 2. Docker & Dockerfile (Containerization)
- **Role**: Packages the website source code together with the Nginx web server into an isolated, reproducible package called a Docker Image.
- **Why**: Solves the "it works on my machine" problem. The container runs identically on local developer machines, GitHub Actions cloud runners, and AWS EC2 cloud servers.

### 3. Nginx (Web Engine)
- **Role**: High-performance web server running inside the Docker container.
- **Why**: Nginx efficiently serves static files (index.html, style.css, script.js) to incoming browser HTTP requests on Port 80 with minimal memory overhead.

### 4. GitHub Actions (CI/CD Automation Runner)
- **Role**: Automatically runs build, containerization, and deployment scripts whenever code is pushed.
- **Why**: Eliminates manual deployment steps, preventing human error and ensuring fast, reproducible releases.

### 5. Docker Hub (Container Registry)
- **Role**: Public cloud registry for storing, tagging, and versioning Docker images.
- **Why**: Serves as the bridge between the CI step (GitHub Actions pushing the built image) and the CD step (AWS EC2 pulling the image).

### 6. AWS EC2 (Cloud Server Infrastructure)
- **Role**: Virtual Linux private server in Amazon Web Services hosting the live Docker container.
- **Why**: Provides reliable, scalable Linux compute infrastructure accessible over the public internet.

---

## What Was Done in This Project (Step-by-Step Implementation)

### Step 1: Built the Frontend Application
Created a responsive, dark-themed CI/CD Pipeline Operations Dashboard featuring real-time uptime counters, interactive 7-stage architecture flowchart inspectors, and diagnostic command reference tools.

Project Files:
- index.html — HTML5 layout and accessibility structure
- style.css — Enterprise dark theme styling (Plus Jakarta Sans & JetBrains Mono typography)
- script.js — Interactive stage inspection handlers, uptime counter, and clipboard copy tools

### Step 2: Containerized the Website using Docker
Created a Dockerfile that configures Nginx Alpine as the base web server:

```dockerfile
FROM nginx:alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy local application files to Nginx web root
COPY . /usr/share/nginx/html

# Expose HTTP Port 80
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
```

Local build and testing commands:
```bash
# Build the local container image
docker build -t portfolio-test .

# Run container locally on port 8080
docker run -d -p 8080:80 --name test-app portfolio-test
```

### Step 3: Created and Configured Git Repository
Initialized version control, established main and demo branches, and configured remote tracking:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Vrund2007/automated-cicd-deployment.git
git push -u origin main
```

### Step 4: Built the GitHub Actions CI/CD Workflow
Configured .github/workflows/deploy.yml to automate build and deployment whenever code is pushed to main or demo:

```yaml
name: Automated CI/CD Deployment Pipeline

on:
  push:
    branches:
      - main
      - demo

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: vrundzzz/automated-cicd-portfolio:latest

      - name: Deploy to AWS EC2 Instance via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            if ! command -v docker &> /dev/null; then
              sudo apt-get update -y
              sudo apt-get install -y docker.io
              sudo systemctl enable --now docker
            fi
            sudo ufw allow 80/tcp || true
            sudo docker pull vrundzzz/automated-cicd-portfolio:latest
            sudo docker stop portfolio || true
            sudo docker rm portfolio || true
            sudo docker run -d -p 80:80 --name portfolio vrundzzz/automated-cicd-portfolio:latest
            sudo docker ps -f name=portfolio
```

### Step 5: Secured Credentials with GitHub Secrets
Prevented hardcoded passwords, private SSH keys, or IP addresses in the codebase by configuring encrypted secrets under GitHub Repository Settings -> Secrets and variables -> Actions:

- DOCKER_USERNAME: Docker Hub account username (vrundzzz)
- DOCKER_PASSWORD: Personal Access Token from Docker Hub
- EC2_HOST: Public IPv4 Address of AWS EC2 instance (13.60.55.166)
- EC2_USERNAME: SSH Linux user (ubuntu)
- EC2_SSH_KEY: Raw content of private key (.pem file)

### Step 6: Configured AWS EC2 Infrastructure & Security Groups
1. Provisioned Ubuntu 22.04 LTS EC2 Instance in AWS Console.
2. Configured Inbound Security Group Rules:
   - HTTP (Port 80) -> Source: 0.0.0.0/0 (Anywhere-IPv4)
   - SSH (Port 22) -> Source: 0.0.0.0/0 (Anywhere-IPv4)
3. The deployment script handles Docker daemon setup and OS firewall permission automatically upon SSH connection.

---

## How to Verify the Pipeline (For Recruiters and Technical Evaluators)

Anyone can verify that this automated deployment pipeline works end-to-end without needing AWS credentials or write permissions:

1. **Check GitHub Actions History**: Open the Actions tab to view real-time build, container push, and SSH deployment logs.
2. **Verify Live Commit Hash**: Open http://13.60.55.166 and inspect the Last Deployed Commit Hash displayed on the banner. Compare it directly with the GitHub repository commit log.
3. **Inspect Infrastructure Source Code**: Review .github/workflows/deploy.yml and Dockerfile to evaluate containerization and security best practices.

---

## Technical Troubleshooting & Diagnostics Guide

### Docker Container Commands
```bash
# List active running containers on EC2
docker ps

# Inspect stdout/stderr logs from Nginx
docker logs portfolio

# Inspect container IP and network configuration
docker inspect portfolio
```

### Linux Host System Diagnostics
```bash
# Check Docker system daemon status
systemctl status docker

# Inspect available disk space and free RAM
df -h
free -h

# Verify active listener on HTTP Port 80
ss -tulpn | grep 80
```
