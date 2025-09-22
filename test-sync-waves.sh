#!/bin/bash

# Local ArgoCD Sync Wave Testing Script
echo "🌊 Testing ArgoCD Sync Waves Locally"
echo "======================================"

# Function to check application status
check_app_status() {
    echo "📊 Current Application Status:"
    kubectl get applications -n argocd
    echo ""
}

# Function to update an application and trigger sync
update_app() {
    local app_name=$1
    local new_tag=$2
    local helm_path=$3
    
    echo "🔄 Updating $app_name to tag $new_tag..."
    
    # Update the values file
    sed -i.bak "s|image: .*/.*:.*|image: faresmirza/$app_name:$new_tag|" "$helm_path/values.yaml"
    
    # Commit the change
    git add "$helm_path/values.yaml"
    git commit -m "Update $app_name image to $new_tag for sync wave test"
    git push origin main
    
    echo "✅ Updated $app_name, ArgoCD will sync based on wave priority"
    echo ""
}

# Show initial status
echo "📋 Initial Status:"
check_app_status

# Test Wave 1: Update Database
echo "🌊 WAVE 1: Updating Database (PostgreSQL)"
update_app "todo-postgres" "v$(date +%s)" "helm/postgres"
sleep 5
check_app_status

# Test Wave 2: Update Backend 
echo "🌊 WAVE 2: Updating Backend (API)"
update_app "todo-api" "v$(date +%s)" "helm/todo-backend"
sleep 5
check_app_status

# Test Wave 3: Update Frontend
echo "🌊 WAVE 3: Updating Frontend"
update_app "todo-frontend" "v$(date +%s)" "helm/todo-frontend" 
sleep 5
check_app_status

echo "🎉 Sync wave test complete!"
echo ""
echo "💡 Tips:"
echo "   - Watch ArgoCD UI to see wave-based deployment"
echo "   - Each wave waits for previous wave to complete"
echo "   - Applications sync in order: postgres → backend → frontend"
echo ""
echo "🔗 Access ArgoCD UI:"
echo "   kubectl port-forward svc/argocd-server -n argocd 8080:443"
echo "   Then visit: https://localhost:8080"