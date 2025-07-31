// src/controllers/userController.js
const { User } = require("../models"); // Make sure User model is imported
const { generateToken } = require("./authController"); // Import if re-issuing token (Advanced)
const config = require("../config/config"); // For cookie options if re-issuing token

const cookieOptions = {
  // Copied from authController for consistency if re-issuing token
  httpOnly: true,
  secure: config.env === "production",
  sameSite: "strict",
  // maxAge: parseExpiryToMilliseconds(config.jwt.expiresIn || "1d"), // If re-issuing
  path: "/api/v1",
};

exports.getCurrentUserProfile = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized, user data not available" });
    }
    // For consistency, the response from GET /me should match structure of PUT /me response
    res.status(200).json({
      message: "User profile fetched successfully",
      data: req.user, // req.user is already prepared by 'protect' middleware
    });
  } catch (error) {
    next(error);
  }
};

// Update and Delete remain as placeholders
exports.updateCurrentUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const currentUserRole = req.user.role;
    const { name, email, role: newRole } = req.body;

    // Find the user in the database
    const userToUpdate = await User.findByPk(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle specific case of guest users trying to update profile
    if (currentUserRole === "guest") {
      // Guests (even if they have a guest token) should not modify persistent user data
      // Or, if you want guests to be able to become registered users through this,
      // the logic would be much more complex (e.g., requiring a password to be set).
      // For now, disallow profile updates for sessions initiated via guest login.
      // The `protect` middleware already constructs a synthetic user for guest tokens.
      // If userToUpdate.role was 'guest' (a registered user who set their role to guest),
      // then they are not a "true" ephemeral guest.
      if (userToUpdate.id.startsWith("guest_")) {
        // Check if it's an ephemeral guest ID
        return res
          .status(403)
          .json({ message: "Ephemeral guest profiles cannot be updated." });
      }
    }

    const updateData = {};
    let roleChanged = false;

    if (name && name !== userToUpdate.name) {
      updateData.name = name;
    }
    if (email && email !== userToUpdate.email) {
      // Check if new email already exists for another user
      if (await User.findOne({ where: { email } })) {
        return res
          .status(400)
          .json({ message: "Email already in use by another account." });
      }
      updateData.email = email;
    }

    // --- CRITICAL: Role Change Logic ---
    if (newRole && newRole !== userToUpdate.role) {
      // **SECURITY WARNING:** Allowing users to set their role arbitrarily is dangerous.
      // A regular user should NEVER be able to set their role to 'admin'.
      // An admin might be able to change other users' roles (via a separate admin endpoint).

      if (newRole === "admin" && currentUserRole !== "admin") {
        // Only an existing admin can set/keep the role as admin for themselves,
        // or a separate admin-only endpoint should handle promoting other users.
        // For self-update, prevent non-admins from becoming admin.
        return res
          .status(403)
          .json({
            message: "Forbidden: You cannot assign yourself the admin role.",
          });
      }

      // If a user is demoting themselves from 'admin' to 'user' or 'guest', allow it.
      // If a user is changing from 'user' to 'guest', allow it.
      // If an admin is changing their own role to 'user' or 'guest', allow it.
      if (["user", "guest", "admin"].includes(newRole)) {
        // Ensure newRole is valid
        // If changing to 'guest' for a registered user:
        // This means their DB record will have role 'guest'. They'd still login with credentials.
        // This is different from an anonymous guest session from /auth/guest/login.
        // The `protect` middleware will read this 'guest' role from DB for them.
        updateData.role = newRole;
        roleChanged = true;
      } else {
        return res
          .status(400)
          .json({ message: "Invalid target role specified." });
      }
    }
    // --- End of Role Change Logic ---

    if (Object.keys(updateData).length === 0) {
      return res.status(200).json({
        message: "No changes provided.",
        data: {
          // Return current user data consistent with GET /me
          id: userToUpdate.id,
          name: userToUpdate.name,
          email: userToUpdate.email,
          role: userToUpdate.role,
        },
      });
    }

    await userToUpdate.update(updateData);

    // Prepare the response user object (without password)
    const updatedUserResponse = {
      id: userToUpdate.id,
      name: userToUpdate.name,
      email: userToUpdate.email,
      role: userToUpdate.role, // This will be the new role if changed
    };

    // OPTIONAL & ADVANCED: Re-issue JWT if role changed, so the current session reflects it.
    // If you don't do this, the user's active token still has the OLD role until they log out/in.
    // Your `protect` middleware DOES refetch user from DB (for non-guests),
    // so `req.user.role` on subsequent requests using the SAME token will reflect the DB change.
    // So, re-issuing the token here is for strict immediate consistency in the cookie itself,
    // but might not be strictly necessary if protect always re-validates against DB.
    // if (roleChanged) {
    //   const newToken = generateToken(updatedUserResponse.id, updatedUserResponse.role);
    //   res.cookie("token", newToken, {
    //      ...cookieOptions,
    //      maxAge: parseExpiryToMilliseconds(config.jwt.expiresIn || "1d") // Define parseExpiryToMilliseconds or use value
    //   });
    //   console.log("Role changed, token re-issued.");
    // }

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUserResponse,
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

exports.deleteCurrentUserAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const currentUserRole = req.user.role;

    if (currentUserRole === "guest" && userId.startsWith("guest_")) {
      // Ephemeral guest
      return res
        .status(403)
        .json({
          message: "Ephemeral guest accounts cannot be deleted this way.",
        });
    }

    const userToDelete = await User.findByPk(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found to delete." });
    }

    // Add any other checks, e.g., an admin cannot delete their own account if they are the last admin.

    await userToDelete.destroy();
    res.clearCookie("token", cookieOptions); // Use the one from top of file or define it here

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    next(error);
  }
};
