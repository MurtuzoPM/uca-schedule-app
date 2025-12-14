# UCA Schedule App - Spring Boot Backend

This is the Spring Boot backend for the University Schedule Application, converted from Django.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+ (or PostgreSQL for production)

## Setup

1. **Configure Database**

   Update `src/main/resources/application.properties` with your database credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/university_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```

2. **Build the Project**

   ```bash
   mvn clean install
   ```

3. **Run the Application**

   ```bash
   mvn spring-boot:run
   ```

   Or run the JAR:
   ```bash
   java -jar target/schedule-app-1.0.0.jar
   ```

The application will start on `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/token/` - Login
- `POST /api/token/refresh/` - Refresh token
- `POST /api/register/` - Register new user
- `GET /api/me/` - Get current user
- `PUT /api/me/` - Update current user
- `POST /api/change-password/` - Change password

### Student Classes
- `GET /api/student-classes/` - List all student classes
- `GET /api/student-classes/{id}/` - Get student class by ID
- `POST /api/student-classes/` - Create student class (Admin only)
- `PUT /api/student-classes/{id}/` - Update student class (Admin only)
- `DELETE /api/student-classes/{id}/` - Delete student class (Admin only)

### Courses
- `GET /api/courses/` - List all courses
- `GET /api/courses/{id}/` - Get course by ID
- `POST /api/courses/` - Create course (Admin only)
- `PUT /api/courses/{id}/` - Update course (Admin only)
- `DELETE /api/courses/{id}/` - Delete course (Admin only)

### Meals
- `GET /api/meals/` - List meals (filtered by user's class or all for admin)
- `GET /api/meals/{id}/` - Get meal by ID
- `POST /api/meals/` - Create meal (Admin only)
- `PUT /api/meals/{id}/` - Update meal (Admin only)
- `DELETE /api/meals/{id}/` - Delete meal (Admin only)

### Gym Schedules
- `GET /api/gym/` - List gym schedules (filtered by user's gender or all for admin)
- `GET /api/gym/{id}/` - Get gym schedule by ID
- `POST /api/gym/` - Create gym schedule (Admin only)
- `PUT /api/gym/{id}/` - Update gym schedule (Admin only)
- `DELETE /api/gym/{id}/` - Delete gym schedule (Admin only)

### University Schedules
- `GET /api/classes/` - List university schedules (filtered by user's class or all for admin)
- `GET /api/classes/{id}/` - Get schedule by ID
- `POST /api/classes/` - Create schedule (Admin only)
- `PUT /api/classes/{id}/` - Update schedule (Admin only)
- `DELETE /api/classes/{id}/` - Delete schedule (Admin only)

### Users (Admin only)
- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get user by ID
- `POST /api/users/` - Create user
- `PATCH /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

## Authentication

All endpoints except `/api/token/` and `/api/register/` require JWT authentication.

Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Database

The application uses JPA/Hibernate with automatic schema generation (`spring.jpa.hibernate.ddl-auto=update`).

Tables will be created automatically on first run.

## Environment Variables

- `DATABASE_URL` - Database connection URL (for production)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT tokens

