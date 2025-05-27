import mongoose from "mongoose";
import User from "../models/user.js";
import { verifyJwt } from "../utils/jwt.js";

export const checkUser = async (req, res, next) => {
  const userName = req.body.firstName + " " + req.body.lastName;
  const user = await User.findOne({ userName });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  next();
};

export const authToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    const decoded = verifyJwt(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Invalid or missing token.", error: error.message });
  }
};

export const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      return res.status(400).json({ message: `Invalid ${paramName}` });
    }
    next();
  };
};


export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Access denied: insufficient role" });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong in role check",
        error: error.message,
      });
    }
  };
};
