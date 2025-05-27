import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUSer,
  login,
  logout,
  register,
  updateUser,
} from "../controller/user.js";
import {
  authToken,
  authorizeRoles,
  checkUser,
  validateObjectId,
} from "../middleware/auth.js";

const router = express.Router();
router.post("/", checkUser, register);
router.post("/login", login);
router.post("/logout", authToken, logout);

router.get("/", authToken, authorizeRoles("admin", "reporter"), getAllUsers);
router.get(
  "/profile",
  authToken,
  authorizeRoles("admin", "user", "reporter"),
  getUSer
);

router.patch(
  "/:id",
  validateObjectId("id"),
  authToken,
  authorizeRoles("admin", "user"),
  updateUser
);
router.delete(
  "/:id",
  validateObjectId(),
  authToken,
  authorizeRoles("admin", "user"),
  deleteUser
);

export default router;
