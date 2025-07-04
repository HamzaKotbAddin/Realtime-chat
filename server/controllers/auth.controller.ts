import { NextFunction , Request, Response } from "express";
import User from "../models/user.model.ts";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";


const maxAge = 3 * 24 * 60 * 60 * 1000;
const maxAgeSeconds = maxAge / 1000;
const createToken = (email: string , userId: string) => {
    try{
        if (!process.env.JWT_KEY) {
            throw new Error("JWT_KEY is not defined in environment variables");
        }
        return jwt.sign({ email, userId }, process.env.JWT_KEY, {
            expiresIn: maxAgeSeconds
        });
    } catch (error) {
        console.error("Error creating token:", error);
        throw error;
    }
};

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<any> =>  {
  try {
    const { username, email, password } = req.body;

    if ( !email || !password) {
      return res.status(400).json({ message: `username, email and password are required` });
    }

    const existingUser = await User.findOne({ email }).select("+password");

    if (existingUser) {
      return res.status(400).json({ error: "Email already registered."  , message: "Email already registered." });
    }

    const user = await User.create({
      username,
      email,
      password
    })
    if (!user) {
      return res.status(400).json({ message: "User creation failed" });
    }

    const token = createToken(email, user.id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge,
      secure: true,
      sameSite: "strict", // Prevent CSRF attacks
    });
    res.status(201).json({ message: "User created successfully", user: {
      id: user.id,
      username: user.username,
      email: user.email,

      image: user.image,
      profileSetup: user.profileSetup
    } });

  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
    next(error);
  }
}


export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({  error: "Password is required" });
    }

    const user = await User.findOne({ email }).select("+password" );

    if (!user) {
      return res.status(401).json({ error: "no email found" });
    }


    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(401).json({ error: "Password is incorrect" });
    }

   
    const token = createToken(email, user.id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        color: user.color
      }
    });

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Something went wrong. Please try again later."});
  }
}