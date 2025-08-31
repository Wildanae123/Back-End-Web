# Back-End-Web

## Table of Contents

- [Ghibli Food Bookshelf API: Seamless Food Book Collection Integration](#ghibli-food-bookshelf-api-seamless-food-book-collection-integration)
- [Project Integration](#project-integration)
- [Quick Setup Guide](#quick-setup-guide)
- [API Endpoints Summary](#api-endpoints-summary)
- [Integration Examples](#integration-examples)
- [Environment Configuration](#environment-configuration)

---

# Ghibli Food Bookshelf API: Seamless Food Book Collection Integration

## Description

The **Ghibli Food Bookshelf API** is a comprehensive API built with Express.js, designed to help developers and culinary platforms integrate rich collections of food-related books into their applications. From iconic cookbooks to modern recipe guides, this API lets users explore and organize a wide array of culinary literature in a streamlined way.

---

## 🔑 Key Features

- **Browse Food Books**  
  Access an organized database of cookbooks and culinary literature with rich metadata.

- **Advanced Search & Filters**  
  Search by title, author, cuisine type, dietary category, difficulty level, ingredients, and more.

- **Book Details & Previews**  
  View summaries, sample recipes, author bios, publication info, and user reviews.

- **User Libraries**  
  Enable users to save, categorize, and organize their own food book collections.

- **Bookmarks & Progress Tracking**  
  Save favorite recipes and track reading progress.

- **Smart Recommendations**  
  Suggest new books based on user behavior, past readings, or popular titles.

- **Rich Media Support**  
  Includes support for images, tutorial videos, and interactive content.

---

## 🛠️ Tech Specs

### Backend Framework: Node.js with Express.js

- Lightweight, fast, and highly scalable for building APIs.
- Minimal yet powerful routing and middleware handling with Express.js.
- Huge ecosystem and community support.

### Database: PostgreSQL

- Robust, reliable, and feature-rich relational database.
- Supports advanced data types, strong integrity, and native JSON.
- Balances structured and semi-structured data handling.

### API Type: REST API

- Standard HTTP methods: GET, POST, PUT, DELETE.
- Easy integration with frontend frameworks like React.
- Clean, intuitive interface for developers.

### Authentication: Auth0

- Handles social logins, MFA, and scalable identity management.
- Trusted third-party service with security best practices.
- Seamless integration with React frontend and custom backend.

### Data Format: JSON

- Native format for JavaScript-based stacks (Node.js + React).
- Lightweight, readable, and easy to debug.
- Universally supported across APIs, databases, and web clients.

---

## 🔐 Middleware

- **express-validator** – Ensures data validation and sanitization.
- **cors** – Handles secure cross-origin requests.
- **helmet** – Adds security headers to prevent common threats.
- **morgan** – Provides structured logging for monitoring/debugging.

---

## 📉 Rate Limiting

- **express-rate-limit**
  - Prevents abuse and denial-of-service (DoS) attacks.
  - Controls request flow to maintain API stability and performance.

---

## 🚀 Deployment: Docker

- Containers package the app and dependencies for consistent environments.
- Works across local, staging, and production platforms.
- Eases scaling, updates, and rollbacks.
- Isolates from system-level dependencies.

---

## 🔔 Webhooks: Event-Driven Updates

- Push real-time updates for book additions and user activity.
- Improves responsiveness and reduces client-side polling.
- Keeps the user interface in sync with backend changes.

---

## 🔗 Project Integration

This backend API serves as the central hub of the Ghibli Food Recipe platform, connecting all other services:

### 🎨 Frontend Integration (Front-End-Web)
- **Purpose**: Serves REST API endpoints for the React application
- **Authentication**: JWT tokens via HttpOnly cookies for secure session management
- **Data Flow**: Handles all CRUD operations for books, users, and libraries
- **Real-time Updates**: WebSocket connections for live notifications

### 🗄️ Database Integration (Database-Web)
- **Connection**: PostgreSQL with Sequelize ORM for data persistence
- **Shared Schema**: Uses identical database models and migrations
- **Admin Interface**: Integrates with database admin tools for content management
- **Monitoring**: Connects to database monitoring for performance tracking

### 🤖 Machine Learning Integration (Machine-Learning-Web)
- **Recommendation Engine**: Sends user behavior data to ML service
- **Smart Search**: Forwards search queries to ML service for enhanced results
- **Data Sync**: Provides book metadata and user interactions for model training
- **API Proxy**: Acts as a bridge between frontend and ML service

### 🚀 DevOps Integration (DevOps-Web)
- **Containerization**: Docker support with multi-stage builds
- **Health Checks**: Kubernetes-ready health endpoints for orchestration
- **Monitoring**: Prometheus metrics and structured logging
- **CI/CD**: Automated testing and deployment pipeline integration

---

## 🚀 Quick Setup Guide

### Prerequisites
Make sure you have the following tools installed:

- 🐳 **Docker & Docker Compose** – Ensure you have both installed on your system. Docker Desktop usually includes Docker Compose.
- 🟩 **Node.js & npm/yarn** – Required for sequelize-cli and potentially running the app locally if you choose, though we'll focus on Docker.
- 🔁 **Postman** – For API testing.
- 📁 **Project Files** – Ensure your Express.js project is ready.

### ⚙️ Step 1: Project Configuration (`.env` file)

1. In the root of your **`ghibli-food-receipt-api`** project, create a `.env` file (if it doesn’t already exist
2. Copy the contents from your existing `.env.example` file into the newly created `.env` file.
3. Update the database-related variables inside `.env` specifically for **Docker Compose** usage.

> 📝 **Note**: Docker Compose allows services to refer to each other by their **service names**. We'll name our PostgreSQL database service `db`.

#### 📁 Example `.env` Configuration:

```ini
# .env

PORT=5000
NODE_ENV=development

# Database (PostgreSQL with Sequelize)
DB_HOST=db              # <-- IMPORTANT: Use the Docker service name, not 'localhost'
DB_PORT=5432            # Standard PostgreSQL port (internal to Docker network)
DB_USER=ghibli_api_user # You'll define this in docker-compose.yml for Postgres
DB_PASSWORD=your_strong_password_for_api_user # (e.g MySecureAppPass123!)
DB_NAME=ghibli_food_db  # You'll define this in docker-compose.yml

# JWT
JWT_SECRET=your_RaNDOM_jwt_secret # (command to create node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_EXPIRES_IN=1d

# Auth0 (Fill these if directly integrating Auth0 for token validation)
# AUTH0_DOMAIN=your-auth0-domain.auth0.com
# AUTH0_AUDIENCE=your-api-identifier
```

### 🚀 Step 2: Run the Application with Docker Compose

1. Open your terminal in the root of your `ghibli-food-receipt-api` project (where your `docker-compose.yml` file lives), then run:

2. Build and start the services:

   ```bash
   docker-compose up --build -d
   ```

3. Check container status:

   ```bash
   docker-compose ps
   ```

4. View logs (especially if something goes wrong):

   ```bash
   docker-compose logs db
   docker-compose logs api
   ```

### 🗄️ Step 3: Run Database Migrations

Once the db container is up and running, and PostgreSQL has initialized your database and user, you need to run your Sequelize migrations to create the tables (Users, Books, UserBooks).

Execute the migration command inside the running api container:

```bash
docker-compose exec api npx sequelize-cli db:migrate
```

### 🌱 Step 4: Seed Initial Data (e.g., Admin User)

If you need an admin user to start testing admin-protected routes, you'll need to create one.

1. Follow the manual method (hashing script + `docker-compose exec db psql -U ${DB_USER} -d ${DB_NAME}` to run SQL INSERT) as described in previous answers.

   - Connect to psql in your DB container:

     ```bash
     docker-compose exec db psql -U ghibli_api_user -d ghibli_food_db
     ```

   - Then run the INSERT statement with the hashed password.

   OR

2. Create and run a Sequelize Seeder (more advanced, but good for repeatable setups):

   - `npx sequelize-cli seed:generate --name initial-admin-user`
   - Edit the seeder file to hash a password and create the admin user.
   - Run the seeder: `docker-compose exec api npx sequelize-cli db:seed:all`

> 📝 **Note**: List PostgreSQL useful command `\dt`, `SELECT * FROM "Users";`, `DELETE FROM "Users";` or `TRUNCATE TABLE "Users", "Books" RESTART IDENTITY CASCADE;`

### 🧪 Step 5: Testing with Postman

1. Import Collection: Ensure your `ghibli-api-postman.json` is imported into Postman.
2. Base URL: Your API should be accessible at `http://localhost:5000`. The requests in the collection use `{{baseUrl}}` which is set to `/api/v1` path relative to the server URL `http://localhost:5000`. So, requests will go to `http://localhost:5000/api/v1/...`.
3. Authentication Flow:
   All endpoints are grouped by category and summarized in a structured table format.

---

#### 🔐 Authentication Routes (`/api/v1/auth`)

| Method | Endpoint            | Purpose                         | Auth Required | Notes                          |
| ------ | ------------------- | ------------------------------- | ------------- | ------------------------------ |
| POST   | `/auth/register`    | Register a new user             | ❌ Public     | Sets an HttpOnly cookie        |
| POST   | `/auth/login`       | Log in existing user            | ❌ Public     | Sets/refreshes HttpOnly cookie |
| POST   | `/auth/guest/login` | Guest login with limited access | ❌ Public     | Guest session via cookie       |
| POST   | `/auth/logout`      | Log out the current user        | ✅ Session    | Clears session cookie          |

---

#### 📖 Book Routes (`/api/v1/books`)

| Method | Endpoint     | Purpose                    | Auth Required | Notes                         |
| ------ | ------------ | -------------------------- | ------------- | ----------------------------- |
| GET    | `/books`     | Retrieve all visible books | ❌ Public     | Supports search & pagination  |
| POST   | `/books`     | Create a new book          | ✅ Yes        | Requires login                |
| GET    | `/books/:id` | Get book details by ID     | ❌ Public     | —                             |
| PUT    | `/books/:id` | Update a book by ID        | ✅ Yes        | Only creator/admin can update |
| DELETE | `/books/:id` | Delete a book by ID        | ✅ Yes        | Only creator/admin can delete |

---

#### 📚 User Library Routes (`/api/v1/library`)

| Method | Endpoint           | Purpose                                  | Auth Required | Notes                                  |
| ------ | ------------------ | ---------------------------------------- | ------------- | -------------------------------------- |
| GET    | `/library`         | Get current user's library               | ✅ Yes        | Supports status filters & pagination   |
| POST   | `/library/:bookId` | Add book to user's library               | ✅ Yes        | Optional fields: status, rating, notes |
| PUT    | `/library/:bookId` | Update a specific book in user's library | ✅ Yes        | Update status, rating, notes           |
| DELETE | `/library/:bookId` | Remove a book from user's library        | ✅ Yes        | —                                      |

---

#### 👤 User Profile Routes (`/api/v1/users`)

| Method | Endpoint    | Purpose                       | Auth Required | Notes             |
| ------ | ----------- | ----------------------------- | ------------- | ----------------- |
| GET    | `/users/me` | Get current user's profile    | ✅ Yes        | —                 |
| PUT    | `/users/me` | Update current user's profile | ✅ Yes        | Name, email, etc. |
| DELETE | `/users/me` | Delete current user's account | ✅ Yes        | —                 |

---

#### 🛠️ Admin Routes (`/api/v1/admin`)

| Method | Endpoint                      | Purpose                     | Auth Required | Notes                         |
| ------ | ----------------------------- | --------------------------- | ------------- | ----------------------------- |
| GET    | `/admin/users`                | List all users              | ✅ Admin      | Supports pagination           |
| POST   | `/admin/books/bulk`           | Add multiple books at once  | ✅ Admin      | Send an array of books        |
| GET    | `/admin/stats`                | Get app statistics          | ✅ Admin      | Total users, books, genres    |
| DELETE | `/admin/users/:userId`        | Delete a user by ID         | ✅ Admin      | Cannot delete self/last admin |
| PATCH  | `/admin/books/:id/visibility` | Change visibility of a book | ✅ Admin      | `{ "isVisible": true/false }` |

---

> 📝 **Note**: All authentication is handled via **HttpOnly cookies**. Make sure your API clients (like Postman) support cookie management.

4. Check Responses: Verify that the API responds as expected based on your controller logic.
5. Check Database (Optional): You can use a tool like DBeaver or pgAdmin to connect to your PostgreSQL database (Host: `localhost`, Port: `5432`, User: `ghibli_api_user`, Password: `from your .env`, Database: `ghibli_food_db`) to see the data being created/updated/deleted.

---

## 🔌 Integration Examples

### Frontend API Integration

```javascript
// Frontend service integration
class APIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    }
  }

  // Authentication
  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: this.defaultHeaders,
      body: JSON.stringify(credentials)
    })
    return this.handleResponse(response)
  }

  // Book management
  async getBooks(params = {}) {
    const query = new URLSearchParams(params)
    const response = await fetch(`${this.baseURL}/books?${query}`, {
      credentials: 'include'
    })
    return this.handleResponse(response)
  }

  // User library
  async addToLibrary(bookId, status = 'want_to_read') {
    const response = await fetch(`${this.baseURL}/library/${bookId}`, {
      method: 'POST',
      credentials: 'include',
      headers: this.defaultHeaders,
      body: JSON.stringify({ status })
    })
    return this.handleResponse(response)
  }

  async handleResponse(response) {
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return response.json()
  }
}

export default new APIService()
```

### Machine Learning Service Integration

```javascript
// ML Service Integration in backend
const mlService = {
  baseURL: process.env.ML_SERVICE_URL || 'http://localhost:8001',

  async getRecommendations(userId, preferences = {}) {
    try {
      const response = await fetch(`${this.baseURL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          preferences,
          num_recommendations: 10
        })
      })
      
      if (!response.ok) {
        throw new Error(`ML Service Error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Failed to get recommendations:', error)
      return []
    }
  },

  async updateUserBehavior(userId, bookId, action, metadata = {}) {
    try {
      await fetch(`${this.baseURL}/behavior`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          book_id: bookId,
          action, // 'view', 'rate', 'add_to_library', etc.
          metadata,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to update user behavior:', error)
    }
  }
}

// Usage in book controller
const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.user
    const recommendations = await mlService.getRecommendations(userId)
    
    // Fetch full book details from database
    const bookIds = recommendations.map(r => r.book_id)
    const books = await Book.findAll({
      where: { id: bookIds },
      include: ['categories', 'tags']
    })
    
    res.json({
      success: true,
      recommendations: books,
      scores: recommendations
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
```

### Database Integration

```javascript
// Enhanced database models with relationships
const { DataTypes } = require('sequelize')

// Book model with ML integration fields
const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [1, 255] }
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.TEXT,
  isbn: DataTypes.STRING,
  publishedDate: DataTypes.DATE,
  genre: DataTypes.STRING,
  
  // ML-specific fields
  features: {
    type: DataTypes.JSONB, // Store extracted features for ML
    defaultValue: {}
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  
  // Content analysis
  ingredients: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  cuisineType: DataTypes.STRING,
  difficulty: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
  
  // System fields
  isVisible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdBy: {
    type: DataTypes.UUID,
    references: { model: 'Users', key: 'id' }
  }
})

// UserBook relationship with ML behavior tracking
const UserBook = sequelize.define('UserBook', {
  userId: {
    type: DataTypes.UUID,
    references: { model: 'Users', key: 'id' }
  },
  bookId: {
    type: DataTypes.UUID,
    references: { model: 'Books', key: 'id' }
  },
  status: {
    type: DataTypes.ENUM('want_to_read', 'reading', 'completed'),
    defaultValue: 'want_to_read'
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  },
  notes: DataTypes.TEXT,
  
  // ML behavior tracking
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastViewedAt: DataTypes.DATE,
  timeSpent: DataTypes.INTEGER, // in minutes
  interactionScore: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  }
})

// Associations for complex queries
Book.belongsToMany(User, { through: UserBook, as: 'readers' })
User.belongsToMany(Book, { through: UserBook, as: 'library' })
Book.hasMany(UserBook)
UserBook.belongsTo(Book)
UserBook.belongsTo(User)
```

### WebSocket Integration

```javascript
// Real-time updates for frontend
const socketIO = require('socket.io')
const jwt = require('jsonwebtoken')

const setupWebSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true
    }
  })

  // Authentication middleware for websocket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.id
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`)
    
    // Join user-specific room
    socket.join(`user_${socket.userId}`)
    
    // Handle book interactions for ML tracking
    socket.on('book_interaction', async (data) => {
      try {
        // Update ML service
        await mlService.updateUserBehavior(
          socket.userId, 
          data.bookId, 
          data.action, 
          data.metadata
        )
        
        // Broadcast to user's devices
        io.to(`user_${socket.userId}`).emit('interaction_tracked', {
          bookId: data.bookId,
          action: data.action,
          timestamp: new Date()
        })
      } catch (error) {
        console.error('Error tracking interaction:', error)
      }
    })

    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`)
    })
  })

  return io
}

module.exports = setupWebSocket
```

---

## 🔧 Environment Configuration

### Complete Environment Setup

Create a comprehensive `.env` file for full integration:

```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (matches Database-Web project)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ghibli_food_db
DB_USER=ghibli_api_user
DB_PASSWORD=your_strong_password

# Authentication & Security
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# CORS Configuration
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# External Services Integration
ML_SERVICE_URL=http://localhost:8001
DATABASE_ADMIN_URL=http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
RATE_LIMIT_STRICT_MAX=20

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif

# Monitoring & Logging
LOG_LEVEL=info
LOG_FILE=./logs/api.log
ENABLE_METRICS=true

# Redis Configuration (for caching and sessions)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# WebSocket Configuration
ENABLE_WEBSOCKET=true
WEBSOCKET_CORS_ORIGIN=http://localhost:3000

# API Documentation
ENABLE_API_DOCS=true
API_DOCS_PATH=/docs

# Health Check Configuration
HEALTH_CHECK_ENDPOINT=/health
HEALTH_CHECK_TIMEOUT=5000

# Development Tools
ENABLE_CORS=true
ENABLE_MORGAN_LOGGING=true
ENABLE_HELMET_SECURITY=true
```

### Docker Integration Environment

For containerized deployment:

```bash
# Docker Environment (.env.docker)
PORT=5000
NODE_ENV=production

# Use service names from docker-compose
DB_HOST=postgres
ML_SERVICE_URL=http://ml-service:8001
REDIS_HOST=redis

# Production security
JWT_SECRET=${JWT_SECRET_FROM_SECRETS}
DB_PASSWORD=${DB_PASSWORD_FROM_SECRETS}

# Container-specific settings
LOG_LEVEL=warn
ENABLE_API_DOCS=false
```

---

## 🧪 API Testing & Development

### Postman Collection Integration

The provided `ghibli-api-postman.json` includes comprehensive testing scenarios:

1. **Environment Variables Setup**:
   ```json
   {
     "key": "baseUrl",
     "value": "http://localhost:5000/api/v1",
     "enabled": true
   }
   ```

2. **Authentication Flow Tests**:
   - User registration with validation
   - Login with credential verification
   - JWT token handling via cookies
   - Protected route access

3. **Integration Testing Scenarios**:
   - Frontend-to-backend communication
   - ML service recommendation requests
   - Database transaction handling
   - Error handling and edge cases

### Development Scripts

Add these npm scripts for integrated development:

```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "dev:integrated": "concurrently \"npm run dev\" \"npm run db:admin\" \"npm run ml:dev\"",
    "start": "node src/server.js",
    "test": "jest --watchAll",
    "test:integration": "jest --testNamePattern=\"integration\" --runInBand",
    "db:migrate": "sequelize-cli db:migrate",
    "db:seed": "sequelize-cli db:seed:all",
    "db:admin": "cd ../Database-Web/Ghibli-Food-Database && npm run admin",
    "ml:dev": "cd ../Machine-Learnimg-Web/Ghibli-Food-ML && python src/main.py",
    "docker:dev": "docker-compose -f ../DevOps-Web/Ghibli-Food-DevOps/docker-compose.yml up -d",
    "lint": "eslint src/",
    "format": "prettier --write src/"
  }
}
```

### ⏹️ Step 6: Stopping the Application

When you're done:

```bash
docker-compose down
```

To remove the persisted database volume as well (and lose all DB data):

```bash
docker-compose down -v
```
