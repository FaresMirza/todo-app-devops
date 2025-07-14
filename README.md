# .NET 9.0 ToDo API – DevOps Deployment on AKS

A complete cloud-native .NET 9.0 ToDo API with production-ready DevOps deployment pipeline using Azure Kubernetes Service (AKS), GitHub Actions, ArgoCD (GitOps), and Azure Monitor.

## 🎯 Project Overview

This project demonstrates enterprise-grade cloud-native application deployment with complete CI/CD automation, featuring:

- **Application**: .NET 9.0 Web API with Entity Framework Core and PostgreSQL
- **Infrastructure**: Azure Kubernetes Service (AKS) provisioned with Terraform
- **CI/CD**: GitHub Actions with automated Docker build/push to Azure Container Registry
- **GitOps**: ArgoCD for automated Kubernetes deployments
- **Monitoring**: Azure Monitor with Container Insights and custom alerting
- **Security**: Kubernetes secrets, RBAC, and DevOps best practices

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │───▶│ GitHub Actions  │───▶│      ACR        │
│   Source Code   │    │   CI/CD Build   │    │ Container Images│
│   Helm Charts   │    │   Auto-Versioning│   │   (v1, v2...)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                               │
         ▼                                               ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     ArgoCD      │◀───│      AKS        │◀───│  Image Registry │
│   GitOps Pull   │    │   Kubernetes    │    │   Integration   │
│   Auto-Sync     │    │   + Ingress     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   PostgreSQL    │    │  Azure Monitor  │
                       │   StatefulSet   │    │ Logs & Metrics  │
                       │   + Persistence │    │   + Alerts      │
                       └─────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
todo-app-devops/
├── .github/
│   └── workflows/
│       └── build.yml              # GitHub Actions CI/CD pipeline
├── app/                           # .NET 9.0 ToDo API source code
│   ├── src/TodoApi/              # Main application code
│   │   ├── Controllers/          # API controllers
│   │   ├── Data/                 # Entity Framework context & migrations
│   │   ├── Models/               # Data models
│   │   ├── Services/             # Business logic services
│   │   └── Program.cs            # Application entry point
│   └── Dockerfile                # Multi-stage container build
├── terraform/                     # Infrastructure as Code
│   ├── modules/                  # Terraform modules (AKS, ACR)
│   │   ├── aks/                  # AKS cluster module
│   │   └── acr/                  # Container registry module
│   ├── main.tf                   # Main infrastructure config
│   ├── variables.tf              # Input variables
│   ├── outputs.tf                # Infrastructure outputs
│   └── terraform.tfvars          # Environment-specific values
├── helm/                          # Kubernetes deployment charts
│   ├── todo-api/                 # Application Helm chart
│   │   ├── templates/            # Kubernetes manifests
│   │   └── values.yaml           # Configuration values
│   └── postgres/                 # PostgreSQL database chart
│       ├── templates/            # Database manifests
│       └── values.yaml           # Database configuration
└── README.md                      # This documentation
```

## 🚀 Setup and Deployment Steps

### Prerequisites

- **Azure CLI**: `az login` with appropriate subscription access
- **kubectl**: Kubernetes command-line tool
- **Terraform**: Infrastructure provisioning (>= 1.0)
- **Helm**: Kubernetes package manager (>= 3.0)
- **GitHub Account**: For repository and Actions access

### Step 1: Infrastructure Provisioning

```bash
# Clone the repository
git clone https://github.com/FaresMirza/todo-app-devops.git
cd todo-app-devops

# Navigate to Terraform directory
cd terraform

# Initialize and deploy infrastructure
terraform init
terraform plan
terraform apply

# Configure kubectl access to AKS
az aks get-credentials --resource-group rg-todo-app-dev --name aks-todo-app-dev
```

### Step 2: Install Kubernetes Components

```bash
# Install NGINX Ingress Controller
helm upgrade --install ingress-nginx ingress-nginx \
  --repo https://kubernetes.github.io/ingress-nginx \
  --namespace ingress-nginx --create-namespace

# Install ArgoCD for GitOps
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Deploy PostgreSQL
helm install postgres ./helm/postgres
```

### Step 3: Configure GitOps and DNS

```bash
# Get ArgoCD admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d

# Port forward to ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Configure local DNS
echo "$(kubectl get ingress todo-api -o jsonpath='{.status.loadBalancer.ingress[0].ip}') todo.local" | sudo tee -a /etc/hosts
```

### Step 4: Test the Application

```bash
# Test API endpoints
curl http://todo.local/health
curl http://todo.local/api/todos

# Create a test todo
curl -X POST http://todo.local/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Todo","description":"Testing deployment","priority":1}'
```

## 🔄 CI/CD Pipeline and GitOps Flow

### GitHub Actions Workflow

The automated pipeline performs:

1. **Checkout**: Retrieve source code from repository
2. **Azure Login**: Authenticate with Azure Container Registry using secrets
3. **Build**: Docker image build with auto-versioning (v{run_number})
4. **Push**: Upload image to acrtodoappdev001.azurecr.io
5. **Update**: Automatically update helm/todo-api/values.yaml with new image tag
6. **Commit**: Push updated chart back to repository with GitHub Actions bot
7. **Deploy**: ArgoCD detects Git changes and deploys to AKS

**Pipeline Triggers:**

- Push to main branch with changes in `app/**` directory
- Manual workflow dispatch

### GitOps with ArgoCD

- **Auto-Sync**: 3-minute polling interval
- **Self-Healing**: Corrects configuration drift
- **Rollback**: Manual rollback through ArgoCD UI
- **Health Checks**: Kubernetes-native monitoring

## ⚙️ Helm Chart Usage

### Application Chart (todo-api)

**Current Configuration:**

```yaml
# helm/todo-api/values.yaml
app:
  name: todo-api
  image: acrtodoappdev001.azurecr.io/todo-api:v16
  port: 8080
  replicas: 3

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  host: todo.local

database:
  host: postgres
  port: 5432
  name: tododb
  username: todouser
```

**Templates Available:**

- `deployment.yaml`: Application deployment with 3 replicas
- `service.yaml`: ClusterIP service on port 80
- `ingress.yaml`: NGINX ingress for external access

### Database Chart (postgres)

**Configuration:**

```yaml
# helm/postgres/values.yaml
postgres:
  image: postgres:15-alpine
  database: tododb
  username: todouser
  password: todopassword

service:
  port: 5432

storage:
  size: 2Gi
```

**Deployment:**

```bash
# Deploy database
helm install postgres ./helm/postgres

# Verify deployment
kubectl get pods -l app=postgres
kubectl exec -it postgres-0 -- psql -U todouser -d tododb
```

## 🌐 ArgoCD and DNS Configuration

### ArgoCD Application Setup

Access ArgoCD UI at `https://localhost:8080` and create application:

- **Repository**: https://github.com/FaresMirza/todo-app-devops
- **Path**: helm/todo-api
- **Destination**: default namespace
- **Sync Policy**: Automatic

### DNS Configuration

For development, using local DNS resolution:

```bash
# Add to /etc/hosts
echo "INGRESS_IP todo.local" | sudo tee -a /etc/hosts
```

For production, consider:

- Azure DNS zones
- SSL/TLS certificates with cert-manager
- Custom domain configuration

## 🏭 Terraform Architecture and Rationale

### Infrastructure Design

**Modular Architecture:**

```
terraform/
├── main.tf                    # Main configuration with provider setup
├── variables.tf               # Input variables with defaults
├── outputs.tf                 # Infrastructure outputs
├── terraform.tfvars          # Environment-specific values
└── modules/
    ├── aks/                   # AKS cluster module
    │   ├── main.tf           # Kubernetes cluster definition
    │   ├── variables.tf      # AKS-specific variables
    │   └── outputs.tf        # Cluster outputs
    └── acr/                   # Container registry module
        ├── main.tf           # ACR configuration
        ├── variables.tf      # ACR-specific variables
        └── outputs.tf        # Registry outputs
```

**Key Components:**

- **Resource Group**: `azurerm_resource_group` with comprehensive tagging
- **AKS Cluster**: `azurerm_kubernetes_cluster` with System Assigned Identity
- **Container Registry**: `azurerm_container_registry` with admin access enabled
- **RBAC Integration**: `azurerm_role_assignment` for AKS-ACR pull access

### Design Decisions and Rationale

**AKS Configuration:**

- **Node Pool**: Single default node pool for simplicity
- **VM Size**: `Standard_B2s` - cost-effective for development workloads
- **Node Count**: 2 nodes for basic high availability
- **Identity**: System Assigned Managed Identity for secure Azure integration
- **DNS Prefix**: Matches cluster name for consistency

**ACR Configuration:**

- **SKU**: Standard tier for development needs
- **Admin User**: Enabled for CI/CD pipeline integration
- **Georeplication**: Not enabled (single region deployment)

**Security Implementation:**

- **RBAC**: Automatic role assignment for AKS kubelet identity
- **Role**: `AcrPull` permission for image retrieval
- **Service Principal**: Not required due to Managed Identity usage

**Resource Organization:**

- **Tagging Strategy**: Environment, project, owner, and cost center tags
- **Naming Convention**: Consistent prefixes (rg-, aks-, acr-)
- **Modularity**: Reusable modules for different environments

### Terraform Best Practices Applied

1. **Version Constraints**: Terraform >= 1.0, AzureRM ~> 3.80
2. **Provider Configuration**: Explicit Azure provider with features block
3. **Data Sources**: `azurerm_client_config` for current user context
4. **Module Dependencies**: ACR ID passed to AKS module for RBAC setup
5. **Variable Defaults**: Sensible defaults for rapid deployment

### Security Considerations

- RBAC for AKS-ACR integration
- Kubernetes secrets for sensitive data
- Network policies for pod communication
- Non-root container execution

## 📊 Monitoring and Observability Setup

### Azure Monitor Integration

**Features Enabled:**

- Container Insights for cluster monitoring
- Log Analytics workspace for centralized logging
- Custom metrics and alerts
- Application performance monitoring

### Custom Alerts Configured

1. **High CPU Usage**: Node CPU > 80%
2. **High Memory Usage**: Node Memory > 85%
3. **Application Health**: API endpoint monitoring

**Alert Notifications:**

- Email: farsemirza93@gmail.com
- Action Group: TodoApp-AlertGroup

### Health Monitoring

```bash
# Application health check
curl http://todo.local/health

# Kubernetes health status
kubectl get pods -l app=todo-api
kubectl top nodes
kubectl top pods
```

## 🤖 How AI Tools Supported Development

### GitHub Copilot Contributions

**Infrastructure Automation:**

- Generated Terraform modules with Azure best practices
- Created Kubernetes manifests with proper resource limits
- Automated GitHub Actions workflow configuration

**Application Development:**

- .NET API controllers with Entity Framework integration
- Dockerfile optimization for multi-stage builds
- Unit test generation and test automation

**DevOps Pipeline:**

- GitOps workflow design and implementation
- Helm chart templating and parameterization
- Monitoring and alerting configuration

**Documentation:**

- Comprehensive README with architecture diagrams
- Troubleshooting guides and best practices
- API documentation with example usage

### Problem-Solving Assistance

- Resolved Docker buildx compatibility issues
- Fixed GitHub Actions permissions for GitOps
- Optimized resource allocation and scaling
- Implemented security best practices

## ⚠️ Assumptions and Simplifications

### Development Environment Focus

1. **Single Region**: East US deployment only
2. **Basic SKUs**: Cost-optimized for development
3. **Local DNS**: Using /etc/hosts instead of Azure DNS
4. **Simplified Authentication**: ACR admin user enabled
5. **Basic Networking**: Default AKS networking configuration

### Production Considerations

For production deployment, consider:

- Multi-region high availability
- Azure Key Vault integration
- Advanced networking with private endpoints
- SSL/TLS certificate management
- Backup and disaster recovery strategies
- Advanced security scanning and policies

## 🧪 End-to-End Validation

### Pipeline Testing

```bash
# 1. Code change triggers pipeline
echo "// Test $(date)" >> app/src/TodoApi/Program.cs
git add . && git commit -m "Test deployment" && git push

# 2. Monitor GitHub Actions
# Visit: https://github.com/FaresMirza/todo-app-devops/actions

# 3. Verify ArgoCD sync
kubectl get applications -n argocd

# 4. Test new deployment
kubectl rollout status deployment/todo-api
curl http://todo.local/api/todos
```

### Database Connectivity

```bash
# Test from application pod
kubectl exec -it $(kubectl get pods -l app=todo-api -o name | head -1) -- nc -zv postgres 5432

# Verify data persistence
kubectl exec -it postgres-0 -- psql -U todouser -d tododb -c "SELECT * FROM \"TodoItems\";"
```

### Ingress Routing

```bash
# Check ingress status
kubectl get ingress todo-api
kubectl describe ingress todo-api

# Test external access
curl -v http://todo.local/api/todos
```

## 🔧 Troubleshooting

### Common Issues

1. **Image Pull Errors**

   ```bash
   kubectl describe pod <pod-name>
   # Check ACR credentials and RBAC
   ```

2. **Database Connection**

   ```bash
   kubectl logs -l app=todo-api
   kubectl get secret postgres-secret -o yaml
   ```

3. **ArgoCD Sync Issues**

   ```bash
   kubectl describe application todo-api -n argocd
   # Force refresh in ArgoCD UI
   ```

4. **DNS Resolution**
   ```bash
   kubectl get ingress
   # Update /etc/hosts with correct IP
   ```

## 📞 Support and Contact

- **Repository**: https://github.com/FaresMirza/todo-app-devops
- **Email**: farsemirza93@gmail.com
- **Issues**: Create GitHub issues for bugs or feature requests

---

**🎉 Status**: Production-ready cloud-native application with complete DevOps automation

This project demonstrates modern cloud-native development practices with enterprise-grade deployment pipeline, monitoring, and GitOps workflows.
