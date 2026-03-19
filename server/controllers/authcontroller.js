import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";
import admin from "../config/firebaseAdmin.js";

export const googleAuth = async (req, res) => {
  console.log("🔥 googleAuth hit");
  console.log("📦 Body received:", req.body);
  console.log("🔑 Token present:", !!req.body.token);

  try {
    const { token } = req.body;

    if (!token) {
      console.log("❌ No token provided");
      return res.status(400).json({ message: "Token is required" });
    }

    // ✅ Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(token);
      console.log("✅ Token verified for:", decodedToken.email);
    } catch (verifyError) {
      console.error("❌ Token verification failed:", verifyError.message);
      return res.status(401).json({ message: "Invalid or expired Firebase token" });
    }

    const { name, email, picture } = decodedToken;

    if (!email) {
      console.log("❌ No email in token");
      return res.status(400).json({ message: "Email not found in token" });
    }

    // ✅ Find or create user
    let user = await User.findOne({ email });
    console.log("👤 Existing user found:", !!user);

    if (!user) {
      console.log("🆕 Creating new user:", email);
      user = await User.create({
        name: name || "User",
        email,
        avatar: picture || "https://www.gravatar.com/avatar/?d=mp",
      });
      console.log("✅ User created:", user._id);
    } else {
      // ✅ Keep profile fresh if changed on Google
      const needsUpdate =
        (name && user.name !== name) ||
        (picture && user.avatar !== picture);

      if (needsUpdate) {
        user.name = name || user.name;
        user.avatar = picture || user.avatar;
        await user.save();
        console.log("🔄 User profile updated");
      }
    }

    // ✅ Guard against missing JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not set");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // ✅ Sign JWT
    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Set cookie
    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("🎉 Login successful for:", email);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error("💥 Google Auth Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logOut = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};