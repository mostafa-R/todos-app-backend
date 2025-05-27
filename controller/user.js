import User from "../models/user.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { createJWT } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid inputs" });
    }
    const token = createJWT(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 3600000,
    });

    return res.status(200).json(token);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ message: "something went wrong", error: error.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    if (req.user.id !== id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "the userName already exists" });
    }
    res.status(400).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const getUSer = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const data = users.map((user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
    }));
    return res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "logout successful" });
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error("User has been Deleted");
    }
    // res.clearCookie("token");
    return res.status(200).json({ message: "User deleted " });
  } catch (error) {
    res.status(400).json({
      message: "something went wrong",
      error: error.message,
    });
  }
};
