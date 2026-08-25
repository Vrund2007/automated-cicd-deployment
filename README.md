# 🚀 Automated CI/CD Deployment Pipeline

[![Automated CI/CD Deployment Pipeline](https://github.com/Vrund2007/automated-cicd-deployment/actions/workflows/deploy.yml/badge.svg)](https://github.com/Vrund2007/automated-cicd-deployment/actions)
[![Docker Image](https://img.shields.io/badge/Docker%20Hub-vrundzzz%2Fautomated--cicd--portfolio-blue?logo=docker)](https://hub.docker.com/r/vrundzzz/automated-cicd-portfolio)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-http%3A%2F%2F13.60.55.166-brightgreen)](http://13.60.55.166)

- **Live Demo**: [http://13.60.55.166](http://13.60.55.166)
- **GitHub Actions Runs**: [Workflow Execution History](https://github.com/Vrund2007/automated-cicd-deployment/actions)
- **Docker Hub Repository**: [vrundzzz/automated-cicd-portfolio](https://hub.docker.com/r/vrundzzz/automated-cicd-portfolio)

### Architecture
```text
GitHub (Push Event) ──► GitHub Actions ──► Docker Hub ──► AWS EC2 (SSH) ──► Docker ──► Nginx
```

---

## 🔍 How to Verify This CI/CD Pipeline

Technical evaluators and recruiters can verify that this deployment pipeline works end-to-end without needing AWS credentials or repository write access:

### Step 1: Inspect GitHub Actions Logs
1. Open the [GitHub Actions Tab](https://github.com/Vrund2007/automated-cicd-deployment/actions).
2. Click on the latest workflow run (e.g. `Automated CI/CD Deployment Pipeline`).
3. Review the execution step logs:
   - **Docker Build & Push**: Compiling Nginx image and pushing to Docker Hub.
   - **EC2 SSH Deployment**: Executing remote deployment commands on AWS EC2.

### Step 2: Verify the Live Website & Commit Match
1. Open the [Live Web Application](http://13.60.55.166).
2. Inspect the **Deployment Version** (`v1.4.2`) and **Last Deployed Commit Hash** displayed on the status banner.
3. Cross-reference the commit hash directly with the [Git Commit History](https://github.com/Vrund2007/automated-cicd-deployment/commits/main) of this repository.

### Step 3: Inspect Pipeline Source Code
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) — Automated build, Docker Hub push, and EC2 SSH deployment workflow.
- [Dockerfile](Dockerfile) — Nginx Alpine container packaging definition.
- [index.html](index.html), [style.css](style.css), [script.js](script.js) — Live Dashboard source code.

---

## 🛠️ Stack & Infrastructure

- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism), Vanilla JavaScript
- **Containerization**: Docker & Nginx (Alpine Base Image)
- **CI/CD Orchestration**: GitHub Actions
- **Container Registry**: Docker Hub (`vrundzzz/automated-cicd-portfolio:latest`)
- **Cloud Infrastructure**: AWS EC2 (Ubuntu 22.04 LTS)
- **Security & Authentication**: GitHub Secrets (SSH Key Pair & Docker Access Tokens)

---

## ⚙️ How the Pipeline Works

1. **Trigger**: A developer pushes code changes to the `main` or `demo` branch.
2. **CI Phase (GitHub Actions)**:
   - Checks out repository source code.
   - Sets up Docker Buildx runner.
   - Authenticates with Docker Hub using encrypted secrets (`DOCKER_USERNAME`, `DOCKER_PASSWORD`).
   - Builds and tags the Docker image (`vrundzzz/automated-cicd-portfolio:latest`).
   - Pushes the built image to Docker Hub.
3. **CD Phase (AWS EC2 SSH)**:
   - Connects to AWS EC2 over SSH using `EC2_HOST`, `EC2_USERNAME`, and `EC2_SSH_KEY`.
   - Checks if Docker is installed on EC2 (auto-installs if missing).
   - Pulls the fresh image from Docker Hub.
   - Stops and removes any outdated container.
   - Runs the new container binding to HTTP **Port 80**.

---

## 📌 Honest Technical Breakdown

- **Zero-Credential Hardcoding**: No SSH keys, passwords, or IP addresses are hardcoded in the codebase; all sensitive data is managed via GitHub Secrets.
- **Automated Infrastructure Verification**: The deployment workflow handles missing dependency detection on the target EC2 host automatically.
- **Clean Container Lifecycle**: Old container instances are safely gracefully stopped and cleaned up before new containers bind to port 80.
