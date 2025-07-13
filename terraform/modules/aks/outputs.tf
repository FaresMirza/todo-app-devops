# Outputs for AKS module
output "cluster_id" {
  description = "ID of the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.id
}

output "cluster_name" {
  description = "Name of the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.name
}

output "kube_config" {
  description = "Kubeconfig for the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.kube_config_raw
  sensitive   = true
}

output "cluster_endpoint" {
  description = "Endpoint for the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.kube_config.0.host
}

output "cluster_ca_certificate" {
  description = "CA certificate for the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.kube_config.0.cluster_ca_certificate
}

output "node_resource_group" {
  description = "Resource group containing the AKS cluster nodes"
  value       = azurerm_kubernetes_cluster.aks.node_resource_group
}
