#!/bin/bash
# =============================================================================
# Helm Template Spacing Fix Script
# =============================================================================
# 
# This script fixes common Helm template spacing issues that occur when
# VS Code Copilot "Keep" functionality adds unwanted spaces in template syntax.
#
# Common issues fixed:
# - "{ {" becomes "{{"
# - "} }" becomes "}}"
# - "{{ " becomes "{{"
# - " }}" becomes "}}"
# - "{{  " becomes "{{"
# - "  }}" becomes "}}"
#
# Usage: 
#   ./fix-helm.sh           # Fix with backup
#   ./fix-helm.sh --no-backup  # Fix without backup
# 
# The script will:
# 1. Fix spacing issues in all .yaml files in helm/ directory
# 2. Fix spacing issues in all .tpl files in helm/ directory  
# 3. Validate both postgres and todo-api charts
# 4. Report the results
#
# =============================================================================

# Check if help is requested
if [[ "$1" == "--help" ]] || [[ "$1" == "-h" ]]; then
    echo "Helm Template Spacing Fix Script"
    echo "================================"
    echo ""
    echo "Fixes common Helm template spacing issues that occur when"
    echo "VS Code Copilot 'Keep' functionality adds unwanted spaces."
    echo ""
    echo "Usage:"
    echo "  ./fix-helm.sh           # Fix with backup"
    echo "  ./fix-helm.sh --no-backup  # Fix without backup"
    echo "  ./fix-helm.sh --help    # Show this help"
    echo ""
    echo "Fixed patterns:"
    echo "  '{ {' → '{{'"
    echo "  '} }' → '}}'"
    echo "  '{{ ' → '{{'"
    echo "  ' }}' → '}}'"
    echo "  '{{  ' → '{{'"
    echo "  '  }}' → '}}'"
    echo ""
    exit 0
fi

echo "🔧 Fixing Helm template spacing issues..."

# Check if --no-backup flag is provided
CREATE_BACKUP=true
if [[ "$1" == "--no-backup" ]]; then
    CREATE_BACKUP=false
fi

if [[ "$CREATE_BACKUP" == "true" ]]; then
    # Create backup timestamp
    BACKUP_DIR="helm-backup-$(date +%Y%m%d-%H%M%S)"
    
    # Create backup before fixing
    echo "📦 Creating backup at: $BACKUP_DIR"
    cp -r helm/ "$BACKUP_DIR"
else
    echo "⚠️  Skipping backup (--no-backup flag used)"
fi

# Fix all common Helm template spacing problems
find helm/ -name "*.yaml" -type f -exec sed -i '' \
  -e 's/{ {/{{/g' \
  -e 's/} }/}}/g' \
  -e 's/{{ /{{/g' \
  -e 's/ }}/}}/g' \
  -e 's/{{  /{{/g' \
  -e 's/  }}/}}/g' \
  {} \;

# Also fix .tpl files
find helm/ -name "*.tpl" -type f -exec sed -i '' \
  -e 's/{ {/{{/g' \
  -e 's/} }/}}/g' \
  -e 's/{{ /{{/g' \
  -e 's/ }}/}}/g' \
  -e 's/{{  /{{/g' \
  -e 's/  }}/}}/g' \
  {} \;

echo "✅ Fixed all Helm template spacing issues in:"
echo "   - All .yaml files in helm/ directory"
echo "   - All .tpl files in helm/ directory"
echo ""
echo "📝 Fixed patterns:"
echo "   - '{ {' → '{{'"
echo "   - '} }' → '}}'"
echo "   - '{{ ' → '{{'"
echo "   - ' }}' → '}}'"
echo "   - '{{  ' → '{{'"
echo "   - '  }}' → '}}'"

# Validate Helm charts after fixing
echo ""
echo "🔍 Validating Helm charts..."
cd helm/

# Check postgres chart
if helm template postgres ./postgres >/dev/null 2>&1; then
    echo "✅ postgres chart is valid"
else
    echo "❌ postgres chart has issues"
fi

# Check todo-api chart
if helm template todo-api ./todo-api >/dev/null 2>&1; then
    echo "✅ todo-api chart is valid"
else
    echo "❌ todo-api chart has issues"
fi

cd ..
echo ""
echo "🎉 Helm template fix completed!"
