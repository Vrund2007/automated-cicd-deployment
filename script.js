// Pipeline stage dictionary for interactive inspector
const pipelineStages = {
  1: {
    title: "Stage 1: Static Website Source Code",
    tag: "Local Workspace",
    filename: "portfolio/index.html",
    desc: "Lightweight static frontend application built with HTML5, CSS3, and JavaScript. Optimized for quick container compilation inside Nginx Alpine without bulky dependencies.",
    code: `portfolio/\n├── index.html\n├── style.css\n├── script.js\n├── assets/\n└── README.md`
  },
  2: {
    title: "Stage 2: Git Version Control & GitHub Repository",
    tag: "Source Control",
    filename: "Terminal / Git Commands",
    desc: "Tracks repository commits. Pushing changes to the main or demo branch triggers the automated CI/CD deployment pipeline.",
    code: `git init\ngit add .\ngit commit -m "feat: updated enterprise pipeline dashboard UI"\ngit branch -M main\ngit remote add origin https://github.com/Vrund2007/automated-cicd-deployment.git\ngit push -u origin main`
  },
  3: {
    title: "Stage 3: GitHub Actions CI/CD Orchestration",
    tag: "CI/CD Automation",
    filename: ".github/workflows/deploy.yml",
    desc: "GitHub Actions detects the push event, provisions a cloud runner, checks out the codebase, and executes the build, containerization, and SSH steps automatically.",
    code: `name: Automated CI/CD Deployment Pipeline\n\non:\n  push:\n    branches: [ main, demo ]\n\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest`
  },
  4: {
    title: "Stage 4: Docker Image Containerization",
    tag: "Docker Engine",
    filename: "Dockerfile",
    desc: "The application is packaged into a self-contained container image using Nginx Alpine as the base web server image to serve static content efficiently.",
    code: `FROM nginx:alpine\nRUN rm -rf /usr/share/nginx/html/*\nCOPY . /usr/share/nginx/html\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]`
  },
  5: {
    title: "Stage 5: Docker Hub Image Registry",
    tag: "Container Registry",
    filename: "Docker Hub CLI",
    desc: "The built Docker image is tagged and pushed to Docker Hub under the registry tag 'latest' so that remote servers can pull the updated image.",
    code: `docker build -t vrundzzz/automated-cicd-portfolio:latest .\ndocker login -u \${{ secrets.DOCKER_USERNAME }} -p \${{ secrets.DOCKER_PASSWORD }}\ndocker push vrundzzz/automated-cicd-portfolio:latest`
  },
  6: {
    title: "Stage 6: AWS EC2 Server Deployment (SSH)",
    tag: "Cloud Infrastructure",
    filename: "EC2 Remote Bash Execution",
    desc: "GitHub Actions securely connects to AWS EC2 over SSH using GitHub Secrets. It pulls the new Docker image, stops the old container, and starts the fresh container.",
    code: `# Commands executed over SSH on AWS EC2:\nsudo docker pull vrundzzz/automated-cicd-portfolio:latest\nsudo docker stop portfolio || true\nsudo docker rm portfolio || true\nsudo docker run -d -p 80:80 --name portfolio vrundzzz/automated-cicd-portfolio:latest`
  },
  7: {
    title: "Stage 7: Live Website via Nginx",
    tag: "Production Runtime",
    filename: "HTTP Port 80 Access",
    desc: "The Docker container runs isolated on the EC2 instance, binding port 80 to serve incoming HTTP web traffic to end users globally.",
    code: `HTTP GET http://<EC2-PUBLIC-IP>:80\nStatus: 200 OK\nServer: nginx/alpine\nContainer Name: portfolio`
  }
};

// Initialize Application Interactivity
document.addEventListener("DOMContentLoaded", () => {
  initUptimeCounter();
  initFlowchartInspector();
  initCopyButtons();
});

// Uptime Counter Logic
function initUptimeCounter() {
  const uptimeElement = document.getElementById("uptimeTimer");
  let seconds = 0;

  setInterval(() => {
    seconds++;
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    if (uptimeElement) {
      uptimeElement.textContent = `${hrs}:${mins}:${secs}`;
    }
  }, 1000);
}

// Interactive Flowchart Inspector
function initFlowchartInspector() {
  const items = document.querySelectorAll(".flow-item");
  
  items.forEach(item => {
    item.addEventListener("click", () => {
      // Remove active state from all items
      items.forEach(i => i.classList.remove("active"));
      
      // Add active state to clicked item
      item.classList.add("active");
      
      // Update inspector panel content
      const stageId = item.getAttribute("data-stage");
      const stageData = pipelineStages[stageId];
      
      if (stageData) {
        document.getElementById("stageTitle").textContent = stageData.title;
        document.getElementById("stageTag").textContent = stageData.tag;
        document.getElementById("stageFilename").textContent = stageData.filename;
        document.getElementById("stageDesc").textContent = stageData.desc;
        document.getElementById("stageCodeSnippet").textContent = stageData.code;
      }
    });
  });
}

// Copy Command to Clipboard
function initCopyButtons() {
  const copyBtns = document.querySelectorAll(".btn-sm");
  
  copyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const commandText = btn.getAttribute("data-cmd");
      if (commandText) {
        navigator.clipboard.writeText(commandText).then(() => {
          const originalText = btn.textContent;
          btn.textContent = "Copied!";
          btn.style.background = "#3b82f6";
          btn.style.borderColor = "#3b82f6";
          btn.style.color = "#fff";
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = "";
            btn.style.borderColor = "";
            btn.style.color = "";
          }, 1500);
        });
      }
    });
  });
}

// Copy Code Snippet
function copyStageCode() {
  const codeElement = document.getElementById("stageCodeSnippet");
  if (codeElement) {
    navigator.clipboard.writeText(codeElement.textContent).then(() => {
      const copyBtn = document.querySelector(".btn-copy span");
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 1500);
      }
    });
  }
}
