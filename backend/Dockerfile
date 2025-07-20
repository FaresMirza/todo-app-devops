# Use the official .NET 9.0 runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080

# Use the official .NET 9.0 SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY ["src/TodoApi/TodoApi.csproj", "TodoApi/"]
RUN dotnet restore "TodoApi/TodoApi.csproj"

# Copy the rest of the application code
COPY src/ .
WORKDIR "/src/TodoApi"

# Build the application
RUN dotnet build "TodoApi.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "TodoApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage - runtime image
FROM base AS final
WORKDIR /app

# Create a non-root user
RUN adduser --disabled-password --home /app --gecos '' appuser && chown -R appuser /app
USER appuser

# Copy the published application
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "TodoApi.dll"]
