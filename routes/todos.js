import express from "express";
import {
  createTodo,
  deleteTodo,
  editTodo,
  getTodos,
  getUserTodos,
} from "../controller/todo.js";
import { authToken, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authToken, createTodo);
router.patch("/:id", authToken, authorizeRoles("admin", "user"), editTodo);
router.get("/", authToken, authorizeRoles("admin", "reporter"), getTodos);
router.get(
  "/meTodos",
  authToken,
  authorizeRoles("admin", "user"),
  getUserTodos
);
router.delete("/:id", authToken, authorizeRoles("admin", "user"), deleteTodo);

export default router;
