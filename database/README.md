# Database

This directory contains the custom PostgreSQL Docker image for the Todo application.

## Structure

- `Dockerfile` - Custom PostgreSQL image based on postgres:15-alpine
- `init-scripts/` - (Optional) SQL scripts to initialize the database
- `config/` - (Optional) Custom PostgreSQL configuration files

## Environment Variables

The following environment variables are set in the Docker image:

- `POSTGRES_DB=tododb` - Database name
- `POSTGRES_USER=todouser` - Database user
- `POSTGRES_PASSWORD=todopassword` - Database password

## Building the Image

The image is automatically built and pushed to Docker Hub when changes are made to this directory via the GitHub Actions workflow.

Manual build:
```bash
docker build -t your-username/todo-postgres:latest ./database
```

## Adding Initialization Scripts

If you need to run SQL scripts when the database starts for the first time, create an `init-scripts/` directory and add your `.sql` files there. Uncomment the COPY line in the Dockerfile to include them.