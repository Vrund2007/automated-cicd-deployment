# Automated CI/CD Deployment Pipeline

An end-to-end DevOps project demonstrating automated continuous integration and continuous deployment (CI/CD) of a containerized web application to an **AWS EC2 Linux instance** using **Docker**, **Nginx**, **GitHub Actions**, and **Docker Hub**.

---

## 🏗️ Architecture & Deployment Flow

```text
               ┌──────────────────────────────┐
               │       Developer Push         │
               │   (HTML / CSS / JS Code)     │
               └──────────────┬───────────────┘
                              │
                           git push
                              │
                              ▼
               ┌──────────────────────────────┐
               │      GitHub Repository       │
               │        (main branch)         │
               └──────────────┬───────────────┘
                              │
                        Triggers Event
                              │
                              ▼
               ┌──────────────────────────────┐
               │    GitHub Actions Runner     │
               │ (.github/workflows/deploy.yml)│
               │                              │
               │  1. Checkout repository code │
               │  2. Build Nginx Docker image │
               │  3. Authenticate & Push      │
               │  4. SSH remote into EC2      │
               └──────────────┬───────────────┘
                              │
                        Pushes Image
                              │
                              ▼
               ┌──────────────────────────────┐
               │         Docker Hub           │
               │                              │
               │ portfolio:latest repository  │
               └──────────────┬───────────────┘
                              │
                        Pull Image via SSH
                              │
                              ▼
               ┌──────────────────────────────┐
               │       AWS EC2 Instance       │
               │        (Linux Server)        │
               │                              │
               │   ┌──────────────────────┐   │
               │   │   Docker Container   │   │
               │   │   (Port 80 Served)   │   │
               │   │        Nginx         │   │
               │   └──────────────────────┘   │
               └──────────────┬───────────────┘
                              │
                              ▼
                      🌐 Live Website
```

---

## 📁 Repository Structure

```text
automated-cicd-deployment/
│
├── index.html                # CI/CD Operations & Live Demo Dashboard
├── style.css                 # Glassmorphism & dark-mode styling
├── script.js                 # Uptime counter, flowchart inspector, copy helpers
├── Dockerfile                # Nginx Alpine container packaging
├── .gitignore                # Git ignore rules
│
└── .github/
    └── workflows/
        └── deploy.yml        # GitHub Actions CI/CD pipeline configuration
```

---

## 🚀 Step-by-Step Guide

### Phase 1 & 2: Local Setup & Git Repository
1. Clone or navigate to your local workspace directory.
2. Initialize Git and commit the code:
   ```bash
   git init
   git add .
   git commit -m "Initial automated CI/CD deployment pipeline setup"
   git branch -M main
   git remote add origin https://github.com/<your-username>/automated-cicd-deployment.git
   git push -u origin main
   ```

---

### Phase 3: Dockerization & Local Testing

1. **Build the Docker Image locally**:
   ```bash
   docker build -t portfolio .
   ```

2. **Run and verify the container on port 8080**:
   ```bash
   docker run -d -p 8080:80 --name portfolio-test portfolio
   ```

3. Open `http://localhost:8080` in your web browser. If the CI/CD Dashboard appears, Dockerization is successful!

4. Stop and remove the test container:
   ```bash
   docker stop portfolio-test && docker rm portfolio-test
   ```

---

### Phase 4: Docker Hub Repository
Create a public repository on [Docker Hub](https://hub.docker.com/):
- Repository Name: `automated-cicd-portfolio`
- Image Tag Format: `<your-dockerhub-username>/automated-cicd-portfolio:latest`

---

### Phase 5 & 6: AWS EC2 Provisioning & Manual Deployment Proof

#### 1. Launch AWS EC2 Instance
- **AMI**: Ubuntu Server 22.04 LTS or Amazon Linux 2023
- **Instance Type**: `t2.micro` (Free Tier eligible)
- **Security Group Inbound Rules**:
  - `SSH` (Port 22) &rarr; My IP / Any
  - `HTTP` (Port 80) &rarr; Anywhere (`0.0.0.0/0`)

#### 2. Connect via SSH & Install Docker
```bash
ssh -i "your-key.pem" ubuntu@<EC2-PUBLIC-IP>
```

Run inside EC2:
```bash
# Update packages and install Docker
sudo apt-get update -y
sudo apt-get install -y docker.io

# Enable and start Docker service
sudo systemctl enable --now docker

# Add user to docker group (avoids needing sudo for docker commands)
sudo usermod -aG docker $USER
newgrp docker
```

#### 3. Perform Manual Deployment Proof
Before automating with CI/CD, verify manual deployment works on EC2:
```bash
docker pull <your-dockerhub-username>/automated-cicd-portfolio:latest

docker run -d -p 80:80 \
  --name portfolio \
  <your-dockerhub-username>/automated-cicd-portfolio:latest
```

Visit `http://<EC2-PUBLIC-IP>` in your browser. Once confirmed working, proceed to automation.

---

### Phase 7 & 8: GitHub Actions & Repository Secrets

Configure secrets securely in GitHub under **Settings &rarr; Secrets and variables &rarr; Actions &rarr; New repository secret**:

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `DOCKER_USERNAME` | Your Docker Hub account username | `vrund` |
| `DOCKER_PASSWORD` | Docker Hub Access Token or Account Password | `dckr_pat_xxxxx` |
| `EC2_HOST` | Public IPv4 Address of your AWS EC2 instance | `54.210.xx.xx` |
| `EC2_USERNAME` | SSH username for EC2 instance | `ubuntu` or `ec2-user` |
| `EC2_SSH_KEY` | Raw content of your private `.pem` key file | `-----BEGIN RSA PRIVATE KEY----- ...` |

---

### Phase 9: Automated Pipeline Test

1. Edit any text inside `index.html` or update the version in `script.js` (e.g. `v1.0.1`).
2. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Update build version to v1.0.1"
   git push origin main
   ```
3. Open **GitHub Repository &rarr; Actions tab**.
4. Observe the automated workflow:
   - Builds Docker image
   - Pushes image to Docker Hub
   - Connects to AWS EC2 over SSH
   - Stops old container and runs the updated container
5. Refresh `http://<EC2-PUBLIC-IP>`. The live changes appear automatically without manual SSH commands!

---

### Phase 10: DevOps Troubleshooting Guide

#### Container & Docker Debugging
```bash
# View active running containers
docker ps

# Inspect application / Nginx stdout logs
docker logs portfolio

# Inspect container IP and network configuration
docker inspect portfolio

# View stored Docker images
docker images
```

#### Linux System & Resource Health
```bash
# Check Docker daemon status
systemctl status docker

# Check available disk space & RAM usage
df -h
free -h

# Monitor real-time process utilization
top

# Check open network ports (Port 80)
ss -tulpn | grep 80
```
