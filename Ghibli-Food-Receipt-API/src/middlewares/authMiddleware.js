// src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const config = require("../config/config");

// Define cookie options for clearing, mirroring how they are set
// This ensures the browser correctly identifies the cookie to clear
const cookieOptionsForClearing = {
  httpOnly: true,
  secure: config.env === "production",
  sameSite: "strict",
  path: "/api/v1", // Must match the 'path' used when setting the cookie
};

exports.protect = async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret); // Decoded payload: { id, role, iat, exp }

    // Check if the role is 'guest'
    if (decoded.role === 'guest') {
      // For guests, construct req.user directly from the token
      // The ID will be the synthetic guest ID (e.g., 'guest_timestamp')
      req.user = {
        id: decoded.id,
        name: 'Guest User', // Standard name for guests
        email: null,       // Guests typically don't have an email
        role: 'guest',
        // Add other fields if your guest object needs them and they are in the token,
        // or derive them if necessary.
        // For example, guest users won't have createdAt/updatedAt from the DB.
      };
    } else {
      // For regular users (e.g., 'user', 'admin'), look them up in the database
      req.user = await User.findByPk(decoded.id, {
        attributes: ["id", "name", "email", "role"], // Ensure all necessary fields are fetched
      });

      if (!req.user) {
        // User ID from a non-guest token not found in DB (e.g., user deleted)
        console.warn(`User with ID ${decoded.id} (role: ${decoded.role}) from token not found in database.`);
        res.clearCookie("token", cookieOptionsForClearing);
        return res
          .status(401)
          .json({
            message: "Not authorized, user for this token no longer exists",
          });
      }
    }
    next();
  } catch (error) {
    console.error(
      "Authentication error in protect middleware:",
      error.name,
      error.message
    );
    res.clearCookie("token", cookieOptionsForClearing);

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Not authorized, token is invalid" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Not authorized, token has expired" });
    }
    return res
      .status(401)
      .json({ message: "Not authorized, token verification failed" });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admin access required" });
  }
};
