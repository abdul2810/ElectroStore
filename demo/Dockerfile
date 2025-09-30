# 1. Build stage
FROM maven:3.9.7-amazoncorretto-21 AS build
WORKDIR /app

# Copy Maven wrapper and POM first, then download dependencies
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source code and package
COPY src src
RUN ./mvnw clean package -DskipTests -B

# 2. Run stage
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the packaged JAR from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port (matches server.port in application.properties)
EXPOSE 8087

# Launch the app
ENTRYPOINT ["java", "-jar", "app.jar"]
