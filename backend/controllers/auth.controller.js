import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import prisma from "../config/prisma.js";

import {
  ACCESS_TOKEN_EXPIRATION,
  ACCESS_TOKEN_SECRET,
  NODE_ENV,
  REFRESH_TOKEN_EXPIRATION,
  REFRESH_TOKEN_SECRET,
} from "../config/env.js";




export const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRATION,
    }
  );

  return {
    accessToken,
    refreshToken,
  };
};



export const setCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    secure: NODE_ENV === "production",
    sameSite: NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};



export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;



    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }



    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Dans signIn, juste après avoir vérifié isValidPassword

    if (!existingUser.isActive) {
      return res.status(403).json({
        success: false,
        message: "This account has been suspended",
      });
    }

    // Don't reveal whether the email exists
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }



    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }


    const {
      accessToken,
      refreshToken,
    } = generateTokens(existingUser.id);



    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );


    await prisma.refreshToken.create({
      data: {
        userId: existingUser.id,
        token: refreshToken,
        expiresAt: refreshTokenExpiresAt,
      },
    });


    setCookies(
      res,
      accessToken,
      refreshToken
    );



    const userResponse = {
      id: existingUser.id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      role: existingUser.role,
      createdAt: existingUser.createdAt,
      updatedAt: existingUser.updatedAt,
    };


    return res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        user: userResponse,
      },
    });

  } catch (err) {
    next(err);
  }
};



export const signUp = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password1,
      password2
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password1 ||
      !password2
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();
  


    if (
      normalizedFirstName.length < 2 ||
      normalizedFirstName.length > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "First name must contain between 2 and 50 characters",
      });
    }

    if (
      normalizedLastName.length < 2 ||
      normalizedLastName.length > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "Last name must contain between 2 and 50 characters",
      });
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

        if (password1 !== password2) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password1)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
      });
    }


    const existingUser = await prisma.user.findUnique({
      where: {
        email
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }


    const passwordHash = await bcrypt.hash(
      password1,
      12
    );


    const user = await prisma.user.create({
      data: {
        firstName: normalizedFirstName,
        lastName: normalizedLastName,
        email: email,
        passwordHash,
        role: "USER",
      },
    });


    const {
      accessToken,
      refreshToken,
    } = generateTokens(user.id);


    const refreshTokenExpiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );


    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: refreshTokenExpiresAt,
      },
    });


    setCookies(
      res,
      accessToken,
      refreshToken
    );


    const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };


    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user: userResponse,
      },
    });

  } catch (err) {
    next(err);
  }
};


export const signOut = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    // ============================================================
    // REVOKE REFRESH TOKEN
    // ============================================================

    if (refreshToken) {
      await prisma.refreshToken.updateMany({
        where: {
          token: refreshToken,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    }

    // ============================================================
    // CLEAR COOKIES
    // ============================================================

    const cookieOptions = {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    // ============================================================
    // RESPONSE
    // ============================================================

    return res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });

  } catch (err) {
    next(err);
  }
};



export const getUser = async(req, res, next) => {

  try{

    
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where : {
        id :userId
      }
    })

    if(!user){
      return res.status(404).json({
        success : false,
        message : "Error user not found"
      });
    }

        const userResponse = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(200).json(
      {
        success : true,
        message : "user found",
        data : userResponse
      }
    )
  }catch(err){
    next(err);
  }

}