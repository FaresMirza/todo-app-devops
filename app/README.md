# ToDo API - .NET 9.0

A cloud-native .NET 9.0 Web API for managing todo items with PostgreSQL database integration, designed for deployment on Azure Kubernetes Service (AKS).

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, Delete todo items
- **Priority Management**: Assign priority levels (1-5) to todos
- **Status Tracking**: Mark todos as completed/incomplete with timestamps
- **Health Checks**: Built-in health monitoring endpoints
- **PostgreSQL Integration**: Entity Framework Core with PostgreSQL
- **Docker Support**: Containerized application ready for Kubernetes
- **API Documentation**: Swagger/OpenAPI integration
- **Logging**: Structured logging with different levels

## 📋 API Endpoints

| Method | Endpoint                          | Description              |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/api/todos`                      | Get all todos            |
| GET    | `/api/todos/{id}`                 | Get specific todo by ID  |
| POST   | `/api/todos`                      | Create new todo          |
| PUT    | `/api/todos/{id}`                 | Update existing todo     |
| DELETE | `/api/todos/{id}`                 | Delete todo              |
| PATCH  | `/api/todos/{id}/toggle`          | Toggle completion status |
| GET    | `/api/todos/status/{isCompleted}` | Get todos by status      |
| GET    | `/api/todos/priority/{priority}`  | Get todos by priority    |
| GET    | `/health`                         | Health check endpoint    |

## 🏗️ Project Structure

```
app/
├── src/
│   └── TodoApi/
│       ├── Controllers/         # API controllers
│       ├── Models/             # Data models
│       ├── Data/               # Database context
│       ├── Services/           # Business logic
│       ├── Program.cs          # Application entry point
│       └── TodoApi.csproj      # Project file
├── Dockerfile                  # Container definition
├── .dockerignore              # Docker ignore file
└── TodoApi.sln                # Solution file
```

## 🛠️ Prerequisites

- .NET 9.0 SDK
- PostgreSQL 13+
- Docker (optional)

## 🚀 Getting Started

### Local Development

1. **Clone and navigate to the app directory**:

   ```bash
   cd app
   ```

2. **Restore dependencies**:

   ```bash
   dotnet restore
   ```

3. **Set up PostgreSQL** (using Docker):

   ```bash
   docker run --name postgres-todo \
     -e POSTGRES_DB=todoapi \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password \
     -p 5432:5432 \
     -d postgres:13
   ```

4. **Configure connection string** (optional):

   ```bash
   export DB_HOST=localhost
   export DB_PORT=5432
   export DB_NAME=todoapi
   export DB_USER=postgres
   export DB_PASSWORD=password
   ```

5. **Run the application**:

   ```bash
   cd src/TodoApi
   dotnet run
   ```

6. **Access the API**:
   - API: http://localhost:5000
   - Swagger UI: http://localhost:5000
   - Health Check: http://localhost:5000/health

### Docker Deployment

1. **Build the Docker image**:

   ```bash
   docker build -t todoapi:latest .
   ```

2. **Run with Docker Compose** (create docker-compose.yml):

   ```yaml
   version: "3.8"
   services:
     postgres:
       image: postgres:13
       environment:
         POSTGRES_DB: todoapi
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: password
       ports:
         - "5432:5432"

     todoapi:
       image: todoapi:latest
       environment:
         DB_HOST: postgres
         DB_PORT: 5432
         DB_NAME: todoapi
         DB_USER: postgres
         DB_PASSWORD: password
       ports:
         - "8080:8080"
       depends_on:
         - postgres
   ```

3. **Start services**:
   ```bash
   docker-compose up -d
   ```

## 🧪 Sample API Calls

**Create a todo**:

```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Kubernetes",
    "description": "Complete the K8s tutorial",
    "priority": 3
  }'
```

**Get all todos**:

```bash
curl http://localhost:5000/api/todos
```

**Update a todo**:

```bash
curl -X PUT http://localhost:5000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn Kubernetes - Updated",
    "description": "Complete the advanced K8s tutorial",
    "isCompleted": true,
    "priority": 4
  }'
```

## 🔧 Configuration

### Environment Variables

| Variable                 | Description       | Default       |
| ------------------------ | ----------------- | ------------- |
| `DB_HOST`                | PostgreSQL host   | localhost     |
| `DB_PORT`                | PostgreSQL port   | 5432          |
| `DB_NAME`                | Database name     | todoapi       |
| `DB_USER`                | Database user     | postgres      |
| `DB_PASSWORD`            | Database password | password      |
| `ASPNETCORE_URLS`        | Application URLs  | http://+:8080 |
| `ASPNETCORE_ENVIRONMENT` | Environment       | Production    |

### Connection String Format

```
Host={DB_HOST};Port={DB_PORT};Database={DB_NAME};Username={DB_USER};Password={DB_PASSWORD}
```

## 📊 Data Model

### TodoItem

```csharp
{
  "id": 1,
  "title": "Sample Todo",
  "description": "This is a sample todo item",
  "isCompleted": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T12:00:00Z",
  "completedAt": null,
  "priority": 2
}
```

## 🏥 Health Checks

The application includes comprehensive health checks:

- **Database connectivity**: Verifies PostgreSQL connection
- **General health**: Overall application status

Access health checks at: `GET /health`

## 🔐 Security Features

- **Input validation**: Model validation with data annotations
- **Error handling**: Comprehensive exception handling
- **Non-root container**: Docker container runs as non-root user
- **Health checks**: Built-in container health monitoring

## 📈 Monitoring & Observability

- **Structured logging**: Console and debug logging providers
- **Health endpoints**: Built-in health check endpoints
- **Request tracking**: Correlation IDs for request tracing
- **Performance metrics**: Ready for Azure Monitor integration

## 🚀 Deployment Ready

This application is designed for cloud-native deployment:

- **Containerized**: Docker image with multi-stage build
- **Kubernetes ready**: Health checks and configuration via environment
- **Scalable**: Stateless design for horizontal scaling
- **Observable**: Comprehensive logging and health monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
