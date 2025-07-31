// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimiter = require("./middlewares/rateLimit");
const mainRouter = require("./routes/routes");
const {
  errorMiddleware,
  notFoundMiddleware,
} = require("./middlewares/errorMiddleware");
const config = require("./config/config");

const app = express();
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

// Core Middlewares
const corsOptions = {
  origin: frontendOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(helmet()); // Set security HTTP headers
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // URL-encoded request body parser
app.use(cookieParser());

// HTTP request logger (Morgan)
if (config.env === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("short")); // Use 'combined' or 'short' for production
}

// Apply rate limiting to all requests
app.use(rateLimiter);

// API Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Ghibli Food Bookshelf API!");
});
app.use("/api/v1", mainRouter);

// Handle 404 Not Found
app.use(notFoundMiddleware);

// Global Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
