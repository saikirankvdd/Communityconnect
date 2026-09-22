# Multi-stage Dockerfile for Spring Boot deployment on Render / Docker environments
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

ENV MAVEN_OPTS="-Xmx384m"

# Copy Maven POM and source code
COPY pom.xml .
COPY src ./src

# Package application jar (skip tests for container build efficiency)
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["java", "-Xmx384m", "-jar", "app.jar"]
