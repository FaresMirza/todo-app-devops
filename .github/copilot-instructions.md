Product Requirements Document (PRD)

Project: .NET 9.0 ToDo API – DevOps Deployment on AKS

⸻

Objective

Build and deploy a cloud-native .NET 9.0 ToDo API that connects to a PostgreSQL database deployed inside the same AKS cluster. The infrastructure is provisioned using Terraform, CI/CD is handled via Azure DevOps, deployment is done using Helm charts (separately for each component) and managed by ArgoCD (GitOps) linked to Azure Repos, monitoring is done with Azure Monitor, and the API is exposed internally using NGINX Ingress with local DNS.

⚠️ The solution must follow industry best practices in terms of:
• Security (secrets management, RBAC)
• Maintainability (modular IaC and Helm structure)
• Observability (monitoring and logging)
• Scalability (resource limits, readiness/liveness probes)

⸻

Goals and Success Criteria

Goal Success Indicator
Provision AKS & ACR Terraform provisions AKS and ACR successfully
Deploy PostgreSQL inside AKS PostgreSQL chart is deployed and running with persistence
Build and push app image Azure DevOps builds and pushes Docker image to ACR
Deploy ToDo API via Helm Helm chart is deployed via ArgoCD to AKS
Ingress routing API is exposed via internal DNS (e.g. todo.local)
App connects to DB ToDo API performs CRUD using PostgreSQL with secrets
GitOps flow ArgoCD syncs Helm charts from Azure Repos to AKS
Monitoring visibility Azure Monitor displays logs and metrics

⸻

Tech Stack

Component Tool/Technology
Infrastructure Terraform
CI/CD Azure DevOps (Repos + Pipelines)
Containerization Docker
App Framework .NET 9.0 Web API
Deployment Helm + ArgoCD (GitOps)
Kubernetes Platform Azure Kubernetes Service (AKS)
Container Registry Azure Container Registry (ACR)
Database PostgreSQL (StatefulSet via Helm chart)
Internal Access NGINX Ingress Controller + local DNS
Observability Azure Monitor + Container Insights

⸻

Helm Chart Structure

helm/
├── todo-api/ # Custom Helm chart for ToDo API
├── postgres/ # PostgreSQL Helm chart (bitnami or custom)
└── argocd/ # ArgoCD installed separately (not managed by ArgoCD itself)

⸻

Deliverables
• terraform/: Infra provisioning (AKS, ACR)
• app/: .NET 9.0 source code + Dockerfile
• .azure-pipelines/: CI/CD pipeline definition
• helm/todo-api/: Helm chart for the ToDo API
• helm/postgres/: Helm chart for PostgreSQL (or use bitnami)
• argocd/: ArgoCD Application manifests
• README.md: Full documentation and setup guide

⸻

Assumptions
• AKS uses default networking (no VNet/Subnet setup)
• PostgreSQL is self-hosted in AKS (not managed service)
• Ingress is internal only, using DNS like todo.local
• ArgoCD is installed manually and not managed via GitOps
• ArgoCD connects to Azure Repos using a secure PAT
• Azure Monitor is enabled on AKS via diagnostics settings

⸻

Success Criteria Checklist
• AKS and ACR provisioned with Terraform
• Helm chart for PostgreSQL deployed and running
• Azure DevOps builds and pushes Docker image
• ArgoCD syncs todo-api chart and deploys to AKS
• Application connects to PostgreSQL using secrets
• API is reachable internally at todo.local
• Azure Monitor shows logs and metrics for all components

⸻

Development Plan (Phases)

Phase 1: Infrastructure Provisioning
• Create Terraform modules to provision AKS and ACR
• Authenticate with Azure using service principal
• Apply Terraform configuration to deploy infrastructure

⸻

Phase 2: Application Development & Containerization
• Build a .NET 9.0 ToDo Web API with full CRUD operations
• Use EF Core to connect to PostgreSQL
• Create a Dockerfile and test the image locally

⸻

Phase 3: PostgreSQL Deployment
• Use a separate Helm chart (bitnami or custom) to deploy PostgreSQL
• Configure StatefulSet with PVC
• Expose it using ClusterIP service
• Store credentials in Kubernetes Secrets

⸻

Phase 4: CI/CD Pipeline (Azure DevOps)
• Create a pipeline that:
• Builds and tests the .NET app
• Builds a Docker image
• Pushes it to ACR
• Inject environment variables securely

⸻

Phase 5: Helm Chart Packaging for ToDo API
• Create custom Helm chart for todo-api
• Includes Deployment, Service, Ingress, Secret templates
• Parameters configurable via values.yaml
• Test the chart locally using helm template or helm install

⸻

Phase 6: GitOps Deployment via ArgoCD
• Install ArgoCD in AKS (via Helm or manifests)
• Connect it to Azure Repos using PAT
• Define ArgoCD Application manifests for:
• todo-api
• postgres (optional if GitOps-managed)

⸻

Phase 7: Ingress & DNS Setup
• Deploy NGINX Ingress Controller via Helm
• Configure internal DNS (e.g. todo.local using nip.io or /etc/hosts)
• Add Ingress resource in the todo-api Helm chart

⸻

Phase 8: Monitoring Integration
• Enable Azure Monitor and Container Insights for AKS
• Validate that metrics, logs, and container events are collected
• Configure alerts if needed

⸻

Phase 9: Validation & Testing
• End-to-end test: code → pipeline → deployment → working API
• Verify DB connectivity and data persistence
• Validate Ingress routing and ArgoCD sync behavior
• Test rollback with ArgoCD

⸻

Phase 10: Documentation
• Prepare README.md with:
• Project overview
• Setup and deployment steps
• Helm chart usage
• ArgoCD and DNS configuration
• Azure DevOps and Terraform notes
• Where best practices were applied

⸻
