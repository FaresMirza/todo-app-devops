# PostgreSQL Helm Chart

Simple PostgreSQL deployment for TodoApp.

## Install

```bash
# Copy example values and set your password
cp helm/postgres/values.yaml.example helm/postgres/values.yaml
# Edit values.yaml and set your password

# Install PostgreSQL
helm install postgres ./helm/postgres
```

## Configuration

Edit `values.yaml`:

```yaml
postgres:
  database: "todoapp"
  username: "todouser"
  password: "todopass123"

storage:
  size: 8Gi

resources:
  memory: "512Mi"
  cpu: "500m"
```

## Access

Connection string:

```
postgresql://todouser:todopass123@postgres:5432/todoapp
```

## Check

```bash
kubectl get pods
kubectl logs postgres-0
```
