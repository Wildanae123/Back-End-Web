# Back-End-Web

## Table of Contents

- [Ghibli Food Bookshelf API: Seamless Food Book Collection Integration](#ghibli-food-bookshelf-api-seamless-food-book-collection-integration)

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

## 📋 Prerequisites

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

### ⏹️ Step 6: Stopping the Application

When you're done:

```bash
docker-compose down
```

To remove the persisted database volume as well (and lose all DB data):

```bash
docker-compose down -v
```
