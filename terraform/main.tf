# Main Terraform configuration for ToDo App Infrastructure
terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.80"
    }
  }
}

# Configure the Microsoft Azure Provider
provider "azurerm" {
  features {}
}

# Data source to get current Azure client configuration
data "azurerm_client_config" "current" {}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = var.tags
}

# ACR Module
module "acr" {
  source = "./modules/acr"

  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  acr_name          = var.acr_name
  tags              = var.tags
}

# AKS Module
module "aks" {
  source = "./modules/aks"

  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  cluster_name       = var.cluster_name
  dns_prefix         = var.dns_prefix
  node_count         = var.node_count
  vm_size           = var.vm_size
  acr_id            = module.acr.acr_id
  tags              = var.tags
}
