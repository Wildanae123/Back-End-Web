# Back-End-Web - Ghibli Food Recipe Platform

A comprehensive REST API backend service that serves as the central hub for the Ghibli Food Recipe platform, providing secure data management, user authentication, and seamless integration with frontend, database, and ML services.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Integration](#project-integration)
- [Quick Setup Guide](#quick-setup-guide)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Integration Examples](#integration-examples)
- [Development](#development)
- [Contributing](#contributing)

---

## Overview

The **Ghibli Food Bookshelf API** is a comprehensive Express.js-based backend service designed for culinary platforms and developers who want to integrate rich collections of food-related books into their applications. It serves as the operational backbone of the Ghibli Food Recipe ecosystem, handling user management, book collections, recommendations, and real-time updates.

This service provides secure user authentication, comprehensive book management, personalized user libraries, and intelligent integrations with machine learning recommendation systems.

---

## Features

### Core Features
- **User Authentication & Management** - JWT-based secure authentication with role-based access control
- **Book Collection Management** - Complete CRUD operations for recipe books with rich metadata
- **Personal User Libraries** - Individual user collections with reading status and ratings
- **Advanced Search & Filtering** - Multi-criteria search by title, author, genre, difficulty, and ingredients
- **Real-time Updates** - WebSocket support for live notifications and synchronization

### Advanced Features
- **Smart Recommendations Integration** - Seamless connection with ML recommendation engine
- **Secure API Design** - Rate limiting, input validation, and SQL injection prevention
- **Admin Panel Support** - Administrative controls for content management and user oversight
- **Multi-environment Support** - Development, staging, and production configurations
- **Health Monitoring** - Built-in health checks and performance metrics

---

## Project Integration

This backend API serves as the central communication hub connecting all services in the Ghibli Food Recipe platform:

### 🎨 **Frontend Integration** (Front-End-Web)
- **REST API Endpoints** - Serves all data and functionality for the React application
- **JWT Authentication** - Secure session management via HttpOnly cookies
- **Real-time Updates** - WebSocket connections for live book updates and notifications
- **File Upload Support** - Image upload capabilities for book covers

### 🗄️ **Database Integration** (Database-Web)
- **PostgreSQL Connection** - Direct integration with shared database schemas
- **Migration Management** - Automated database schema updates and seeding
- **Connection Pooling** - Optimized database performance with Sequelize ORM
- **Data Validation** - Consistent data integrity across all operations

### 🤖 **ML Integration** (Machine-Learning-Web)
- **Recommendation Pipeline** - Forwards user behavior data to ML service for analysis
- **Smart Search Enhancement** - Integrates ML-powered search with traditional filtering
- **User Behavior Tracking** - Captures interactions for continuous model improvement
- **API Proxy** - Acts as secure bridge between frontend and ML service

### 🚀 **DevOps Integration** (DevOps-Web)
- **Container Support** - Docker-ready with health checks and monitoring
- **CI/CD Pipeline** - Automated testing, building, and deployment
- **Environment Management** - Multi-stage deployment configurations
- **Performance Monitoring** - Prometheus metrics and structured logging

---

## Quick Setup Guide

### Prerequisites
- **Node.js 18+** and **npm**
- **PostgreSQL 15+** database
- **Docker & Docker Compose** (optional for containerized setup)
- **Redis** (optional for caching)

### Installation Steps

1. **Clone and Install Dependencies**
   ```bash
   cd Back-End-Web/Ghibli-Food-Receipt-API
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ghibli_food_db
   DB_USER=ghibli_api_user
   DB_PASSWORD=your_strong_password
   
   # Authentication
   JWT_SECRET=your_super_secure_jwt_secret
   JWT_EXPIRES_IN=7d
   
   # External Services
   ML_SERVICE_URL=http://localhost:8001
   FRONTEND_URL=http://localhost:3000
   ```

3. **Database Setup**
   ```bash
   # Run migrations
   npx sequelize-cli db:migrate
   
   # Seed initial data
   npx sequelize-cli db:seed:all
   ```

4. **Start the Service**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verification**
   ```bash
   # Health check
   curl http://localhost:5000/api/v1/health
   
   # API documentation
   # Visit: http://localhost:5000/api/v1/docs
   ```

### Docker Setup
```bash
# Using integrated Docker setup
cd ../DevOps-Web/Ghibli-Food-DevOps
docker-compose up -d
```

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 4.x | Web framework |
| **PostgreSQL** | 15+ | Primary database |
| **Sequelize** | 6.x | ORM and database management |
| **JWT** | Latest | Authentication and authorization |
| **bcrypt** | Latest | Password hashing |
| **WebSocket** | Latest | Real-time communication |
| **Docker** | Latest | Containerization |

### Security & Middleware
| Technology | Purpose |
|------------|---------|
| **express-validator** | Input validation and sanitization |
| **cors** | Cross-origin request handling |
| **helmet** | Security headers |
| **express-rate-limit** | Rate limiting and DoS protection |
| **morgan** | Request logging |

---

## API Documentation

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/auth/register` | Register new user | ❌ Public |
| POST | `/auth/login` | User login | ❌ Public |
| POST | `/auth/guest/login` | Guest access | ❌ Public |
| POST | `/auth/logout` | User logout | ✅ Session |

### Book Routes (`/api/v1/books`)

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/books` | Get all books (with filters) | ❌ Public |
| POST | `/books` | Create new book | ✅ User |
| GET | `/books/:id` | Get book details | ❌ Public |
| PUT | `/books/:id` | Update book | ✅ Owner/Admin |
| DELETE | `/books/:id` | Delete book | ✅ Owner/Admin |

### User Library Routes (`/api/v1/library`)

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/library` | Get user's library | ✅ User |
| POST | `/library/:bookId` | Add book to library | ✅ User |
| PUT | `/library/:bookId` | Update library entry | ✅ User |
| DELETE | `/library/:bookId` | Remove from library | ✅ User |

### Admin Routes (`/api/v1/admin`)

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/admin/users` | List all users | ✅ Admin |
| POST | `/admin/books/bulk` | Bulk add books | ✅ Admin |
| GET | `/admin/stats` | System statistics | ✅ Admin |
| DELETE | `/admin/users/:id` | Delete user | ✅ Admin |

---

## Configuration

### Environment Variables

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ghibli_food_db
DB_USER=ghibli_api_user
DB_PASSWORD=your_strong_password

# Authentication & Security
JWT_SECRET=your_super_secure_jwt_secret_key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# External Services Integration
ML_SERVICE_URL=http://localhost:8001
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Monitoring & Logging
LOG_LEVEL=info
ENABLE_METRICS=true
```

### Integration Settings
```env
# Cross-service URLs
DATABASE_ADMIN_URL=http://localhost:3001
DEVOPS_MONITORING_URL=http://localhost:3002

# WebSocket Configuration
ENABLE_WEBSOCKET=true
WEBSOCKET_CORS_ORIGIN=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif
```

---

## Integration Examples

### Frontend API Integration
```javascript
// API Service for Frontend (React)
class APIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1'
  }

  // Authentication
  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    return response.json()
  }

  // Book management
  async getBooks(params = {}) {
    const query = new URLSearchParams(params)
    const response = await fetch(`${this.baseURL}/books?${query}`, {
      credentials: 'include'
    })
    return response.json()
  }

  // User library
  async addToLibrary(bookId, status = 'want_to_read') {
    const response = await fetch(`${this.baseURL}/library/${bookId}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    return response.json()
  }
}
```

### ML Service Integration
```javascript
// ML Service Integration
const mlService = {
  async getRecommendations(userId, preferences = {}) {
    try {
      const response = await fetch(`${process.env.ML_SERVICE_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          preferences,
          num_recommendations: 10
        })
      })
      return await response.json()
    } catch (error) {
      console.error('ML Service Error:', error)
      return []
    }
  },

  async trackBehavior(userId, bookId, action, metadata = {}) {
    try {
      await fetch(`${process.env.ML_SERVICE_URL}/behavior`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          book_id: bookId,
          action,
          metadata,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to track behavior:', error)
    }
  }
}
```

---

## Development

### Development Scripts
```bash
# Development server with hot reload
npm run dev

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Code quality
npm run lint
npm run format

# Database operations
npm run db:migrate
npm run db:seed
npm run db:reset
```

### Testing
- **Unit Tests**: Jest for individual function testing
- **Integration Tests**: API endpoint testing
- **Database Tests**: Transaction-based test isolation
- **Security Tests**: Authentication and authorization validation

### Debugging
- Use `DEBUG=ghibli-api:*` for detailed logging
- Health check endpoint: `/api/v1/health`
- Metrics endpoint: `/api/v1/metrics`

---

## Contributing

1. **Development Workflow**
   - Follow semantic versioning
   - Use conventional commits
   - Create feature branches from `develop`

2. **Code Standards**
   - ESLint configuration provided
   - Prettier for code formatting
   - JSDoc for function documentation

3. **Testing Requirements**
   - Maintain 80%+ test coverage
   - All endpoints must have integration tests
   - Security tests for authentication flows

4. **Security Guidelines**
   - Never commit secrets or keys
   - Use environment variables for configuration
   - Follow OWASP security practices

---

**Part of the Ghibli Food Recipe Platform Ecosystem** 🍜✨