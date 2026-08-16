import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  NODE_ENV,
  ACCESS_TOKEN_EXPIRATION
} from "../config/env.js";

const authorize = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({
        message: "Authentication required"
      });
    }

    // ============================================================
    // 1. TRY ACCESS TOKEN
    // ============================================================

    if (accessToken) {
      try {
        const decoded = jwt.verify(
          accessToken,
          ACCESS_TOKEN_SECRET
        );

        const user = await prisma.user.findUnique({
          where: {
            id: decoded.id
          }
        });

        if (!user) {
          return res.status(401).json({
            message: "User not found"
          });
        }

        // Attach authenticated user to request
        req.user = user;

        return next();

      } catch (error) {
        // Access token invalid or expired.
        // We will try the refresh token.
        console.log(
          "Access token invalid or expired. Trying refresh token..."
        );
      }
    }

    // ============================================================
    // 2. REFRESH TOKEN
    // ============================================================

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token missing"
      });
    }

    let decodedRefresh;

    try {
      decodedRefresh = jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET
      );
    } catch (error) {
      return res.status(403).json({
        message: "Refresh token invalid or expired"
      });
    }

    // ============================================================
    // 3. CHECK REFRESH TOKEN IN DATABASE
    // ============================================================

    const storedRefreshToken = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken
      }
    });

    if (!storedRefreshToken) {
      return res.status(403).json({
        message: "Refresh token not found"
      });
    }

    // Token has been revoked
    if (storedRefreshToken.revokedAt) {
      return res.status(403).json({
        message: "Refresh token has been revoked"
      });
    }

    // Token has expired according to database
    if (storedRefreshToken.expiresAt <= new Date()) {
      return res.status(403).json({
        message: "Refresh token expired"
      });
    }

    // ============================================================
    // 4. CHECK USER
    // ============================================================

    const user = await prisma.user.findUnique({
      where: {
        id: storedRefreshToken.userId
      }
    });

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    // Optional additional security check:
    // make sure the user ID inside the JWT matches the DB record.
    if (decodedRefresh.id !== user.id) {
      return res.status(403).json({
        message: "Invalid refresh token"
      });
    }

    // ============================================================
    // 5. GENERATE NEW ACCESS TOKEN
    // ============================================================

    const newAccessToken = jwt.sign(
      {
        id: user.id
      },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRATION
      }
    );

    // ============================================================
    // 6. SET NEW ACCESS TOKEN COOKIE
    // ============================================================

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production"
        ? "none"
        : "lax",
      path: "/",
      maxAge: 15 * 60 * 1000
    });

    // ============================================================
    // 7. ATTACH USER TO REQUEST
    // ============================================================

    req.user = user;

    return next();

  } catch (error) {
    console.error(
      "Authorize middleware error:",
      error
    );

    return res.status(401).json({
      message: "Unauthorized"
    });
  }
};

export default authorize;