# Quick Start Guide

## Prerequisites Check
✅ Java 17 - Installed
✅ Maven 3.8.7 - Installed  
✅ Node.js v20.19.6 - Installed
✅ npm 10.8.2 - Installed

## Running the Application

### Option 1: Using H2 Database (Easiest - No MySQL setup needed)

The application can use H2 (in-memory database) for quick testing. Just modify the application.properties:

1. **Update Backend Configuration** (Optional - H2 is already in dependencies):
   Edit `backend/src/main/resources/application.properties`:
   ```properties
   # Change from MySQL to H2
   spring.datasource.url=jdbc:h2:mem:university_db
   spring.datasource.driver-class-name=org.h2.Driver
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect
   ```

### Option 2: Using MySQL (Production-like)

1. **Install and Start MySQL** (if not already running):
   ```bash
   sudo systemctl start mysql
   # Or on some systems:
   sudo service mysql start
   ```

2. **Create Database** (optional - will be created automatically):
   ```bash
   mysql -u root -p
   CREATE DATABASE university_db;
   ```

3. **Configure Database** (if needed):
   Edit `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```

---

## Step-by-Step Instructions

### 1. Start the Backend (Spring Boot)

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on **http://localhost:8000**

You should see:
```
Started ScheduleAppApplication in X.XXX seconds
```

### 2. Start the Frontend (React)

Open a **new terminal window** and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on **http://localhost:5173** (or another port if 5173 is busy)

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/

---

## Testing the API

You can test the API endpoints using curl or a tool like Postman:

### Register a new user:
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123",
    "email": "test@example.com"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

This will return a JWT token that you can use for authenticated requests.

---

## Troubleshooting

### Backend Issues:

1. **Port 8000 already in use:**
   ```bash
   # Find and kill the process
   lsof -ti:8000 | xargs kill -9
   ```

2. **Database connection error:**
   - Make sure MySQL is running: `sudo systemctl status mysql`
   - Check your database credentials in `application.properties`
   - Or switch to H2 database (see Option 1 above)

3. **Maven build fails:**
   ```bash
   mvn clean
   mvn install
   ```

### Frontend Issues:

1. **Port 5173 already in use:**
   - Vite will automatically use the next available port (5174, 5175, etc.)
   - Update the CORS settings in `application.properties` if needed

2. **npm install fails:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **API connection errors:**
   - Make sure the backend is running on port 8000
   - Check the API URL in `frontend/src/services/api.js`

---

## Development Tips

- **Backend logs**: Check the console output for Spring Boot logs
- **Frontend hot reload**: Changes in the frontend will automatically reload
- **Database**: Tables are created automatically on first run (Hibernate auto-ddl)
- **JWT Token**: Store the token from login in localStorage (frontend handles this)

---

## Next Steps

1. Register a user through the frontend
2. Login to get a JWT token
3. Create student classes, courses, and schedules
4. Test the different user roles (admin vs regular user)

