// src/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const config = require("../config/config");

// Helper function to parse JWT expiry string (e.g., "1d", "7d", "1h") to milliseconds
const parseExpiryToMilliseconds = (expiresInString) => {
  if (typeof expiresInString !== "string") {
    // Default to 1 day if format is unknown or not a string
    return 24 * 60 * 60 * 1000;
  }
  const unit = expiresInString.charAt(expiresInString.length - 1).toLowerCase();
  const value = parseInt(expiresInString.slice(0, -1));

  if (isNaN(value)) {
    return 24 * 60 * 60 * 1000; // Default
  }

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return value; // Assume it's already in ms if no unit or unknown unit
  }
};

const cookieOptions = {
  httpOnly: true, // Client-side JavaScript cannot access the cookie
  secure: config.env === "production", // Only send cookie over HTTPS in production
  sameSite: "strict", // Helps mitigate CSRF attacks ('lax' is also an option)
  maxAge: parseExpiryToMilliseconds(config.jwt.expiresIn || "1d"), // Cookie expiry in milliseconds
  path: "/api/v1", // Cookie accessible for all /api/v1 paths
};

// Helper function to generate JWT (remains the same)
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const token = generateToken(newUser.id, newUser.role);

    // Set token in HttpOnly cookie
    res.cookie("token", token, cookieOptions);

    // Send user details (without token in body)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res
        .status(400)
        .json({ message: error.errors.map((e) => e.message).join(", ") });
    }
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    // Check if user already has a valid session cookie
    if (req.cookies && req.cookies.token) {
      try {
        const decoded = jwt.verify(req.cookies.token, config.jwt.secret);
        const userFromCookie = await User.findByPk(decoded.id, {
          attributes: ["id", "name", "email", "role"],
        });

        if (userFromCookie) {
          // User has a valid token, refresh it and send back user info
          const newToken = generateToken(
            userFromCookie.id,
            userFromCookie.role
          );
          res.cookie("token", newToken, cookieOptions); // Refresh cookie
          return res.status(200).json({
            message: "Already logged in. Session refreshed.",
            user: userFromCookie,
          });
        }
      } catch (err) {
        // Invalid/expired cookie, clear it and proceed with normal login
        console.log(
          "Invalid or expired existing cookie, clearing and proceeding with login attempt."
        );
        res.clearCookie("token", { ...cookieOptions, path: "/api/v1" }); // ensure path matches
      }
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id, user.role);

    // Set token in HttpOnly cookie
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.guestLogin = async (req, res, next) => {
  try {
    const guestId = `guest_${Date.now()}`;
    const guestRole = "guest";
    const token = generateToken(guestId, guestRole);

    // Set token in HttpOnly cookie
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Guest login successful. Access is limited.",
      user: {
        id: guestId,
        name: "Guest User",
        email: null,
        role: guestRole,
      },
    });
  } catch (error) {
    console.error("Error during guest login:", error);
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // To logout with HttpOnly cookies, the server needs to clear the cookie.
    // The client cannot delete an HttpOnly cookie.
    res.clearCookie("token", { ...cookieOptions, path: "/api/v1" }); // Important: path must match the path cookie was set with

    res.status(200).json({
      message: "Logout successful. Token cookie cleared.",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    next(error);
  }
};
