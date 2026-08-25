// Stage definitions containing details, explanations, file references, and code snippets
const pipelineStages = {
  1: {
    title: "Stage 1: Static Website Source Code",
    tag: "Local Workspace",
    filename: "portfolio/index.html",
    desc: "The frontend is built using clean HTML5, Vanilla CSS3, and JavaScript. It serves as a light, responsive DevOps operations dashboard.",
    code: `portfolio/\n├── index.html\n├── style.css\n├── script.js\n├── assets/\n└── README.md`
  },
  2: {
    title: "Stage 2: Git Source Control & GitHub Repository",
    tag: "Version Control",
    filename: "Terminal / Git Commands",
    desc: "Version control tracks modifications. Pushing commits to the default 'main' branch acts as the trigger event for the automated deployment pipeline.",
    code: `git init\ngit add .\ngit commit -m "feat: updated portfolio live site"\ngit branch -M main\ngit remote add origin https://github.com/<username>/automated-cicd-deployment.git\ngit push -u origin main`
  },
  3: {
    title: "Stage 3: GitHub Actions CI/CD Orchestration",
    tag: "CI/CD Automation",
    filename: ".github/workflows/deploy.yml",
    desc: "GitHub Actions detects the push event, provisions a cloud runner, checks out the codebase, and executes the build, containerization, and SSH steps automatically.",
    code: `name: Build & Deploy Portfolio to EC2\n\non:\n  push:\n    branches: [ main ]\n\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4`
  },
  4: {
    title: "Stage 4: Docker Image Containerization",
    tag: "Docker Engine",
    filename: "Dockerfile",
    desc: "The application is packaged into a self-contained container image using Nginx Alpine as the base web server image to serve static content efficiently.",
    code: `FROM nginx:alpine\nCOPY . /usr/share/nginx/html\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]`
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
    code: `# Commands executed over SSH on AWS EC2:\ndocker pull vrundzzz/automated-cicd-portfolio:latest\ndocker stop portfolio || true\ndocker rm portfolio || true\ndocker run -d -p 80:80 --name portfolio vrundzzz/automated-cicd-portfolio:latest`
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
  const nodes = document.querySelectorAll(".flow-node");
  
  nodes.forEach(node => {
    node.addEventListener("click", () => {
      // Remove active state from all nodes
      nodes.forEach(n => n.classList.remove("active"));
      
      // Add active state to clicked node
      node.classList.add("active");
      
      // Update inspector panel content
      const stageId = node.getAttribute("data-stage");
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

// Copy Code & Commands to Clipboard
function initCopyButtons() {
  const copyMiniBtns = document.querySelectorAll(".copy-mini");
  
  copyMiniBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const commandText = btn.getAttribute("data-cmd");
      if (commandText) {
        navigator.clipboard.writeText(commandText).then(() => {
          const originalText = btn.textContent;
          btn.textContent = "Copied!";
          btn.style.background = "#10b981";
          btn.style.color = "#fff";
          
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = "";
            btn.style.color = "";
          }, 1500);
        });
      }
    });
  });
}

// Copy Stage Code Snippet
function copyStageCode() {
  const codeElement = document.getElementById("stageCodeSnippet");
  if (codeElement) {
    navigator.clipboard.writeText(codeElement.textContent).then(() => {
      const copyBtn = document.querySelector(".copy-btn");
      if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied Snippet!";
        copyBtn.style.background = "rgba(16, 185, 129, 0.4)";
        
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = "";
        }, 1500);
      }
    });
  }
}
