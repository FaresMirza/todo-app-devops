# Terraform Infrastructure for ToDo App

This Terraform configuration provisions the required Azure infrastructure for the ToDo application, including:

- Azure Kubernetes Service (AKS) cluster
- Azure Container Registry (ACR)
- Resource Group
- Proper RBAC configuration for AKS to pull from ACR

## Prerequisites

1. **Azure CLI**: Install and configure Azure CLI

   ```bash
   az login
   az account set --subscription "your-subscription-id"
   ```

2. **Terraform**: Install Terraform >= 1.0

   ```bash
   # On macOS with Homebrew
   brew install terraform
   ```

3. **Azure Service Principal** (optional but recommended for CI/CD)
   ```bash
   az ad sp create-for-rbac --name "terraform-sp" --role="Contributor" --scopes="/subscriptions/YOUR_SUBSCRIPTION_ID"
   ```

## Directory Structure

```
terraform/
├── main.tf              # Main Terraform configuration
├── variables.tf         # Variable definitions
├── outputs.tf          # Output definitions
├── terraform.tfvars    # Variable values
├── modules/
│   ├── aks/            # AKS module
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── acr/            # ACR module
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
└── README.md           # This file
```

## Deployment Steps

### Step 1: Initialize Terraform

```bash
cd terraform
terraform init
```

### Step 2: Review the Plan

```bash
terraform plan
```

### Step 3: Apply the Configuration

```bash
terraform apply
```

### Step 4: Get AKS Credentials

```bash
az aks get-credentials --resource-group rg-todo-app-dev --name aks-todo-app-dev
```

## Configuration

### Variables

| Variable              | Description                        | Default           |
| --------------------- | ---------------------------------- | ----------------- |
| `resource_group_name` | Name of the resource group         | `rg-todo-app`     |
| `location`            | Azure region                       | `East US`         |
| `acr_name`            | ACR name (must be globally unique) | `acrtodoapp`      |
| `cluster_name`        | AKS cluster name                   | `aks-todo-app`    |
| `dns_prefix`          | DNS prefix for AKS                 | `aks-todo-app`    |
| `node_count`          | Number of AKS nodes                | `2`               |
| `vm_size`             | VM size for AKS nodes              | `Standard_DS2_v2` |

### Outputs

| Output             | Description             |
| ------------------ | ----------------------- |
| `aks_cluster_name` | Name of the AKS cluster |
| `aks_cluster_id`   | ID of the AKS cluster   |
| `acr_name`         | Name of the ACR         |
| `acr_login_server` | ACR login server URL    |

## Security Best Practices

- AKS uses System Assigned Managed Identity
- ACR pull permissions granted to AKS kubelet identity
- Admin user enabled on ACR for CI/CD scenarios
- Tags applied for resource management and cost tracking

## Cleanup

To destroy the infrastructure:

```bash
terraform destroy
```

## Troubleshooting

1. **ACR name already exists**: ACR names must be globally unique. Update the `acr_name` variable.
2. **Insufficient permissions**: Ensure your Azure account has Contributor role on the subscription.
3. **Resource group exists**: If the resource group already exists, import it into Terraform state.

## Next Steps

After infrastructure deployment:

1. Install NGINX Ingress Controller
2. Install ArgoCD
3. Deploy PostgreSQL using Helm
4. Configure Azure Monitor
