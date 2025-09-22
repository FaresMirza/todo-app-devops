# Azure Kubernetes Service module
resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.cluster_name
  location            = var.location
  resource_group_name = var.resource_group_name
  # https://todoapp-12345678.hcp.westeurope.azmk8s.io:443
  dns_prefix          = var.dns_prefix

  default_node_pool {
    name       = "default"
    node_count = var.node_count
    vm_size    = var.vm_size
  }
  #Azure ينشئ هوية خاصة للكلاستر تلقائياً، وتُستخدم للوصول الآمن إلى
  identity {
    type = "SystemAssigned"
  }
  tags = var.tags
}

# Role assignment to allow AKS to pull images from ACR
resource "azurerm_role_assignment" "aks_acr" {
  principal_id                     = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                           = var.acr_id
  skip_service_principal_aad_check = true
}
