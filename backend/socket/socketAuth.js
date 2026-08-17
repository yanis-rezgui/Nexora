import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

import {
  ACCESS_TOKEN_SECRET,
} from "../config/env.js";

const socketAuth = async (socket, next) => {
  try {

    console.log("========== NEW SOCKET CONNECTION ==========");

    // ============================================================
    // 1. GET COOKIES
    // ============================================================

    const cookies = socket.handshake.headers.cookie;

    console.log("Cookies:", cookies);

    if (!cookies) {
      console.log("No cookies");
      return next(new Error("Unauthorized"));
    }


    // ============================================================
    // 2. EXTRACT ACCESS TOKEN
    // ============================================================

    const accessToken = cookies
      .split("; ")
      .find((cookie) => cookie.startsWith("accessToken="))
      ?.split("=")[1];

    console.log("Access token:", accessToken ? "Present" : "Missing");

    if (!accessToken) {
      console.log("No access token");
      return next(new Error("Unauthorized"));
    }


    // ============================================================
    // 3. VERIFY ACCESS TOKEN
    // ============================================================

    const decoded = jwt.verify(
      accessToken,
      ACCESS_TOKEN_SECRET
    );

    console.log("Decoded token:", decoded);


    // ============================================================
    // 4. GET USER FROM DATABASE
    // ============================================================

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    console.log("User:", user?.id);


    if (!user) {
      console.log("User not found");
      return next(new Error("Unauthorized"));
    }


    // ============================================================
    // 5. ATTACH USER TO SOCKET
    // ============================================================

    socket.user = user;


    // ============================================================
    // 6. AUTHENTICATION SUCCESS
    // ============================================================

    console.log(
      `Socket authenticated successfully: ${user.firstName} ${user.lastName}`
    );

    next();

  } catch (err) {

    console.error("Socket authentication error:", err);

    return next(new Error("Unauthorized"));
  }
};

export default socketAuth;