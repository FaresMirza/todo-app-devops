# Custom PostgreSQL Docker image for Todo App
FROM postgres:15-alpine

# Set environment variables
ENV POSTGRES_DB=tododb
ENV POSTGRES_USER=todouser
ENV POSTGRES_PASSWORD=todopassword

# Copy initialization scripts (if you have any)
# COPY ./init-scripts/ /docker-entrypoint-initdb.d/

# Copy custom configuration (if you have any)
# COPY ./postgresql.conf /etc/postgresql/postgresql.conf

# Expose the PostgreSQL port
EXPOSE 5432

# Use the default entrypoint from the base image
# which will run PostgreSQL