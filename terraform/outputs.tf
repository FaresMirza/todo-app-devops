# Output values from Terraform deployment
output "resource_group_name" {
  description = "Name of the created resource group"
  value       = azurerm_resource_group.main.name
}

output "aks_cluster_name" {
  description = "Name of the AKS cluster"
  value       = module.aks.cluster_name
}

output "aks_cluster_id" {
  description = "ID of the AKS cluster"
  value       = module.aks.cluster_id
}

output "aks_kube_config" {
  description = "Kubeconfig for the AKS cluster"
  value       = module.aks.kube_config
  sensitive   = true
}

output "acr_name" {
  description = "Name of the Azure Container Registry"
  value       = module.acr.acr_name
}

output "acr_login_server" {
  description = "Login server URL for the Azure Container Registry"
  value       = module.acr.acr_login_server
}

output "acr_id" {
  description = "ID of the Azure Container Registry"
  value       = module.acr.acr_id
}
