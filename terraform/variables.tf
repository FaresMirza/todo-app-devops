# Variables for Terraform configuration
variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "rg-todo-app"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "East US"
}

variable "acr_name" {
  description = "Name of the Azure Container Registry"
  type        = string
  default     = "acrtodoapp"
}

variable "cluster_name" {
  description = "Name of the AKS cluster"
  type        = string
  default     = "aks-todo-app"
}

variable "dns_prefix" {
  description = "DNS prefix for the AKS cluster"
  type        = string
  default     = "aks-todo-app"
}

variable "node_count" {
  description = "Number of nodes in the AKS cluster"
  type        = number
  default     = 2
}

variable "vm_size" {
  description = "Size of the Virtual Machine"
  type        = string
  default     = "Standard_B2s"
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default = {
    Environment = "dev"
    Project     = "todo-app"
    Owner       = "devops-team"
  }
}
