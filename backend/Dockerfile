# Multi-stage Dockerfile for Spring Boot deployment on Render / Docker environments
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy Maven POM and source code
COPY pom.xml .
COPY src ./src

# Package application jar (skip tests for container build efficiency)
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
